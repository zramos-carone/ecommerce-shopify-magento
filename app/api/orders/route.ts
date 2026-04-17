import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * POST /api/orders
 * Crea nueva orden con items.
 * Realiza Upsert de los productos si vienen de mayoristas externos.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      items,
      email,
      phone,
      firstName,
      lastName,
      address,
      city,
      postalCode,
      country = 'Mexico',
      subtotal = 0,
      tax = 0,
    } = body

    // 1. Validaciones básicas
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Se requieren productos para la orden' }, { status: 400 })
    }

    if (!email || !phone || !firstName || !lastName || !address || !city || !postalCode) {
      return NextResponse.json({ error: 'Faltan datos de envío obligatorios' }, { status: 400 })
    }

    // 2. Procesar Items y Sincronizar Productos
    let calculatedSubtotal = 0
    const orderItemsCreate = []

    for (const item of items) {
      console.log(`[ORDER_API] Procesando producto: ${item.sku || item.id}`)

      // UPSERT: Si el producto no existe en nuestra DB local, lo creamos
      // Esto permite que el catálogo dinámico de mayoristas funcione con el sistema de órdenes
      const synchronizedProduct = await prisma.product.upsert({
        where: { sku: item.sku },
        update: {
          stock: { increment: -item.quantity }, // Reducir stock si ya existe
          price: item.price, // Actualizar precio al más reciente
        },
        create: {
          id: item.id, // Usamos el ID del mayorista como secundario o dejamos que genere uno
          sku: item.sku,
          name: item.name || 'Producto Tecnológico',
          price: item.price,
          brand: item.brand,
          category: item.category,
          stock: 100 - item.quantity, // Stock inicial ficticio menos la compra
          image: item.imageUrl,
        },
      })

      const lineSubtotal = item.price * item.quantity
      calculatedSubtotal += lineSubtotal

      orderItemsCreate.push({
        productId: synchronizedProduct.id,
        productName: synchronizedProduct.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: lineSubtotal,
      })
    }

    // 3. Totales Finales
    const finalSubtotal = subtotal || calculatedSubtotal
    const finalTax = tax || finalSubtotal * 0.16
    const finalTotal = finalSubtotal + finalTax

    // 4. Crear Orden
    const orderNumber = `MAX-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`

    const order = await prisma.order.create({
      data: {
        orderNumber,
        email,
        phone,
        firstName,
        lastName,
        address,
        city,
        postalCode,
        country,
        subtotal: finalSubtotal,
        tax: finalTax,
        shipping: 0,
        total: finalTotal,
        status: 'pending',
        paymentStatus: 'pending',
        items: {
          create: orderItemsCreate,
        },
      },
      include: {
        items: true,
      },
    })

    console.log(`[ORDER_API] Orden creada con éxito: ${order.orderNumber}`)

    return NextResponse.json(
      {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[ORDER_API_ERROR]', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al procesar la orden' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Use POST para crear una orden' })
}
