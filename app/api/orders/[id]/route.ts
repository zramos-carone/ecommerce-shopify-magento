import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface RouteParams {
  params: {
    id: string
  }
}

/**
 * PATCH /api/orders/{id}
 * Actualiza el estado de una orden (usado después de pago)
 */
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { id } = params
    const body = await req.json()

    const { paymentId, paymentStatus, status } = body

    // Actualizar orden
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        ...(paymentId && { paymentId }),
        ...(paymentStatus && { paymentStatus }),
        ...(status && { status }),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/orders/{id}
 * Obtiene los detalles de una orden
 */
export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const { id } = params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Order fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}
