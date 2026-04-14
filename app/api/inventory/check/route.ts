import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * POST /api/inventory/check
 * Valida disponibilidad de productos antes de checkout
 *
 * Body:
 * {
 *   items: [
 *     { productId: string, quantity: number },
 *     ...
 *   ]
 * }
 *
 * Response:
 * {
 *   available: boolean,
 *   unavailable: [
 *     { productId, requested, available },
 *     ...
 *   ]
 * }
 */
export async function POST(req: Request) {
  try {
    const { items } = await req.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Items array required' }, { status: 400 })
    }

    const unavailable = []

    // Valida cada producto
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })

      if (!product) {
        unavailable.push({
          productId: item.productId,
          requested: item.quantity,
          available: 0,
          reason: 'Producto no encontrado',
        })
      } else if (product.stock < item.quantity) {
        unavailable.push({
          productId: item.productId,
          name: product.name,
          requested: item.quantity,
          available: product.stock,
          reason: `Solo hay ${product.stock} disponibles`,
        })
      }
    }

    return NextResponse.json({
      available: unavailable.length === 0,
      unavailable,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Inventory check error:', error)
    return NextResponse.json({ error: 'Failed to check inventory' }, { status: 500 })
  }
}

// GET para debug
export async function GET() {
  return NextResponse.json({
    message: 'POST /api/inventory/check to validate product availability',
    example: {
      items: [
        { productId: 'prod_123', quantity: 2 },
        { productId: 'prod_456', quantity: 1 },
      ],
    },
  })
}
