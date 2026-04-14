import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * POST /api/orders
 * Crea nueva orden con items
 *
 * Body:
 * {
 *   items: [{ productId, quantity, price }, ...],
 *   email: string,
 *   phone: string,
 *   firstName: string,
 *   lastName: string,
 *   address: string,
 *   city: string,
 *   postalCode: string,
 *   country: string,
 *   subtotal: number,
 *   tax: number
 * }
 *
 * Response:
 * {
 *   id: string,
 *   orderNumber: string,
 *   subtotal: number,
 *   tax: number,
 *   shipping: number,
 *   total: number,
 *   status: string,
 *   createdAt: string
 * }
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

    // Validations
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Items required' }, { status: 400 })
    }

    if (!email || !phone || !firstName || !lastName || !address || !city || !postalCode) {
      return NextResponse.json({ error: 'Missing required shipping info' }, { status: 400 })
    }

    // Calculate totals
    let calculatedSubtotal = 0
    const orderItems = []

    for (const item of items) {
      // Valida que el producto existe y tiene stock
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })

      if (!product) {
        return NextResponse.json({ error: `Producto ${item.productId} no encontrado` }, { status: 400 })
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `${product.name} no tiene suficiente stock. Disponibles: ${product.stock}, Solicitados: ${item.quantity}`,
          },
          { status: 400 }
        )
      }

      const lineSubtotal = item.price * item.quantity
      calculatedSubtotal += lineSubtotal

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        subtotal: lineSubtotal,
      })
    }

    // Usa subtotal enviado o calcula
    const finalSubtotal = subtotal || calculatedSubtotal
    const finalTax = tax || finalSubtotal * 0.16
    const finalTotal = finalSubtotal + finalTax

    // Generar order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Crear orden
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
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        id: order.id,
        orderNumber: order.orderNumber,
        email: order.email,
        firstName: order.firstName,
        lastName: order.lastName,
        subtotal: order.subtotal,
        tax: order.tax,
        shipping: order.shipping,
        total: order.total,
        status: order.status,
        items: order.items.map((oi: any) => ({
          productId: oi.productId,
          productName: oi.product.name,
          quantity: oi.quantity,
          price: oi.price,
          subtotal: oi.subtotal,
        })),
        createdAt: order.createdAt.toISOString(),
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create order' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/orders
 * Returns order creation help
 */
export async function GET() {
  return NextResponse.json({
    message: 'POST /api/orders to create new order',
    example: {
      items: [{ productId: 'prod_123', quantity: 2, price: 99.99 }],
      email: 'customer@example.com',
      phone: '+52 55 1234 5678',
      firstName: 'Juan',
      lastName: 'Pérez',
      address: 'Calle Principal 123',
      city: 'Ciudad de México',
      postalCode: '28001',
      country: 'Mexico',
    },
  })
}
