import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

/**
 * @swagger
 * /api/payments/create-intent:
 *   post:
 *     summary: Crear Intención de Pago (Stripe)
 *     description: Genera un Payment Intent en Stripe para procesar un pago con tarjeta. Valida que la orden exista y esté pendiente.
 *     tags:
 *       - Transacción
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderId, amount, email]
 *             properties:
 *               orderId: { type: 'string', description: 'ID de la orden de TECNO' }
 *               amount: { type: 'number', description: 'Monto total en MXN' }
 *               email: { type: 'string', description: 'Correo del cliente para recibo' }
 *     responses:
 *       200:
 *         description: Intención de pago creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentIntent'
 *       400:
 *         description: Orden ya pagada o campos faltantes.
 *       404:
 *         description: Orden no encontrada.
 */
export async function POST(req: Request) {
  try {
    const { orderId, amount, email } = await req.json();

    if (!orderId || !amount || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validar que la orden existe y está en estado correcto
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.paymentStatus !== "pending") {
      return NextResponse.json(
        { error: "Order payment already processed" },
        { status: 400 },
      );
    }

    // Crear Payment Intent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe usa centavos
      currency: "mxn",
      description: `Orden #${order.orderNumber}`,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
      receipt_email: email,
    });

    // Guardar paymentIntentId en la orden
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentId: paymentIntent.id,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Payment intent creation error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create payment intent",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/payments/create-intent
 * Información de ayuda
 */
export async function GET() {
  return NextResponse.json({
    message:
      "POST /api/payments/create-intent to create a Stripe payment intent",
    example: {
      orderId: "clxx...",
      amount: 5800.0,
      email: "customer@example.com",
    },
  });
}
