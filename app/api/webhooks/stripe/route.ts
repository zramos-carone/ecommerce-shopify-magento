import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { prisma } from "@/lib/db";
import {
  deductOrderStock,
  sendOrderConfirmationEmail,
} from "@/lib/services/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-08-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

/**
 * @swagger
 * /api/webhooks/stripe:
 *   post:
 *     summary: Receptor de Eventos Stripe
 *     description: Endpoint seguro para recibir webhooks de Stripe. Maneja la confirmación de pago (payment_intent.succeeded) y reembolsos (charge.refunded). Requiere verificación de firma.
 *     tags:
 *       - Administración
 *     responses:
 *       200:
 *         description: Evento verificado y procesado exitosamente.
 *       400:
 *         description: Firma de Stripe inválida o falta de metadata.
 */
export async function POST(req: Request) {
  const body = await req.text();
  const headersList = headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    console.error("❌ Missing Stripe signature");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log(`📨 Received Stripe webhook: ${event.type}`);
  } catch (error) {
    console.error("❌ Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Signature verification failed" },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case "charge.refunded":
        await handleRefund(event.data.object as Stripe.Charge);
        break;

      default:
        console.log(`⏭️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}

/**
 * Manejar pago exitoso
 */
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata.orderId;
    const orderNumber = paymentIntent.metadata.orderNumber;

    if (!orderId) {
      console.error("❌ No orderId in payment intent metadata");
      return;
    }

    // Obtener orden
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      console.error(`❌ Order not found: ${orderId}`);
      return;
    }

    // Marcar pago como completado
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "completed",
        status: "confirmed",
      },
    });

    console.log(`✅ Payment confirmed for order ${orderNumber}`);

    // Deducir stock
    await deductOrderStock(orderId);

    // Enviar email de confirmación
    await sendOrderConfirmationEmail({
      ...order,
      email: order.email,
      firstName: order.firstName,
      lastName: order.lastName,
    });

    console.log(`📧 Order confirmation email sent for ${orderNumber}`);
  } catch (error) {
    console.error("❌ Error handling payment success:", error);
    throw error;
  }
}

/**
 * Manejar pago fallido
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata.orderId;
    const orderNumber = paymentIntent.metadata.orderNumber;

    if (!orderId) {
      console.error("❌ No orderId in payment intent metadata");
      return;
    }

    // Marcar orden como pagada pero falló
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "failed",
        status: "cancelled",
      },
    });

    console.log(`❌ Payment failed for order ${orderNumber}`);
  } catch (error) {
    console.error("❌ Error handling payment failure:", error);
    throw error;
  }
}

/**
 * Manejar reembolso
 */
async function handleRefund(charge: Stripe.Charge) {
  try {
    if (!charge.refunded) {
      return;
    }

    // Buscar orden por payment ID
    const order = await prisma.order.findFirst({
      where: { paymentId: charge.payment_intent as string },
      include: { items: true },
    });

    if (!order) {
      console.error("❌ Order not found for refunded charge");
      return;
    }

    // Revertir stock
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });

      console.log(
        `♻️ Stock returned: Product ${item.productId} (+${item.quantity})`,
      );
    }

    // Marcar orden como refundada
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "refunded",
        status: "cancelled",
      },
    });

    console.log(`💰 Order ${order.orderNumber} refunded and stock returned`);
  } catch (error) {
    console.error("❌ Error handling refund:", error);
    throw error;
  }
}

/**
 * GET /api/webhooks/stripe
 * Health check
 */
export async function GET() {
  return NextResponse.json({ message: "Stripe webhook endpoint" });
}
