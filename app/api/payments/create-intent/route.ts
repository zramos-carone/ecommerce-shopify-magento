import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'

/**
 * POST /api/payments/create-intent
 * Crea un Payment Intent en Stripe para que el frontend pueda procesar el pago
 *
 * Body:
 * {
 *   orderId: string,
 *   amount: number (en centavos, ej. 5000 = $50.00),
 *   email: string
 * }
 *
 * Response:
 * {
 *   clientSecret: string,
 *   paymentIntentId: string
 * }
 */
export async function POST(req: Request) {
  try {
    const { orderId, amount, email } = await req.json()

    if (!orderId || !amount || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validar que la orden existe y está en estado correcto
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.paymentStatus !== 'pending') {
      return NextResponse.json(
        { error: 'Order payment already processed' },
        { status: 400 }
      )
    }

    // Crear Payment Intent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe usa centavos
      currency: 'mxn',
      description: `Orden #${order.orderNumber}`,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
      receipt_email: email,
    })

    // Guardar paymentIntentId en la orden
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentId: paymentIntent.id,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('Payment intent creation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/payments/create-intent
 * Información de ayuda
 */
export async function GET() {
  return NextResponse.json({
    message: 'POST /api/payments/create-intent to create a Stripe payment intent',
    example: {
      orderId: 'clxx...',
      amount: 5800.00,
      email: 'customer@example.com',
    },
  })
}
