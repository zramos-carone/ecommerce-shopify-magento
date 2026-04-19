import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  deductOrderStock,
  sendOrderConfirmationEmail,
} from "@/lib/services/email";

/**
 * @swagger
 * /api/webhooks/paypal:
 *   post:
 *     summary: Receptor de Eventos PayPal
 *     description: Endpoint asíncrono para recibir notificaciones de PayPal (IPN/Webhooks). Procesa órdenes completadas, capturas de pago y reembolsos.
 *     tags:
 *       - Administración
 *     responses:
 *       200:
 *         description: Evento recibido y procesado.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(`📨 Received PayPal webhook: ${body.event_type}`);

    switch (body.event_type) {
      case "CHECKOUT.ORDER.COMPLETED":
        await handlePaymentCompleted(body);
        break;

      case "CHECKOUT.ORDER.APPROVED":
        console.log(`✅ PayPal order approved (pending capture)`);
        break;

      case "PAYMENT.CAPTURE.COMPLETED":
        await handlePaymentCaptured(body);
        break;

      case "PAYMENT.CAPTURE.REFUNDED":
        await handlePaymentRefunded(body);
        break;

      default:
        console.log(`⏭️ Unhandled PayPal event: ${body.event_type}`);
    }

    // Responder con éxito siempre
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ PayPal webhook processing error:", error);
    // Responder con éxito para que PayPal no reintente
    return NextResponse.json({ received: true }, { status: 200 });
  }
}

/**
 * Manejar orden completada de PayPal
 */
async function handlePaymentCompleted(body: any) {
  try {
    const paypalOrderId = body.resource?.id;
    const orderStatus = body.resource?.status;

    if (!paypalOrderId || orderStatus !== "COMPLETED") {
      console.log("⏭️ PayPal order not completed");
      return;
    }

    // Buscar orden por PayPal ID
    const order = await prisma.order.findFirst({
      where: { paymentId: paypalOrderId },
      include: { items: true },
    });

    if (!order) {
      console.error(`❌ Order not found for PayPal ID: ${paypalOrderId}`);
      return;
    }

    // Marcar como pagada
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "completed",
        status: "confirmed",
      },
    });

    console.log(`✅ PayPal payment completed for order ${order.orderNumber}`);

    // Deducir stock
    await deductOrderStock(order.id);

    // Enviar email
    await sendOrderConfirmationEmail({
      ...order,
      email: order.email,
      firstName: order.firstName,
      lastName: order.lastName,
    });

    console.log(`📧 Order confirmation email sent for ${order.orderNumber}`);
  } catch (error) {
    console.error("❌ Error handling PayPal completion:", error);
  }
}

/**
 * Manejar captura de pago en PayPal
 */
async function handlePaymentCaptured(body: any) {
  try {
    const supplementaryData =
      body.resource?.supplementary_data?.related_ids?.order_id;

    if (!supplementaryData) {
      console.log("⏭️ No order ID in PayPal capture");
      return;
    }

    const order = await prisma.order.findFirst({
      where: { paymentId: supplementaryData },
      include: { items: true },
    });

    if (!order) {
      console.error(`❌ Order not found for capture`);
      return;
    }

    // Actualizar estado
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "completed",
        status: "confirmed",
      },
    });

    // Deducir stock si no se ha hecho
    if (order.paymentStatus === "pending") {
      await deductOrderStock(order.id);

      await sendOrderConfirmationEmail({
        ...order,
        email: order.email,
        firstName: order.firstName,
        lastName: order.lastName,
      });
    }

    console.log(`✅ PayPal capture completed for order ${order.orderNumber}`);
  } catch (error) {
    console.error("❌ Error handling PayPal capture:", error);
  }
}

/**
 * Manejar reembolso en PayPal
 */
async function handlePaymentRefunded(body: any) {
  try {
    const supplementaryData =
      body.resource?.supplementary_data?.related_ids?.order_id;

    if (!supplementaryData) {
      console.log("⏭️ No order ID in PayPal refund");
      return;
    }

    const order = await prisma.order.findFirst({
      where: { paymentId: supplementaryData },
      include: { items: true },
    });

    if (!order) {
      console.error(`❌ Order not found for refund`);
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

    // Marcar como refundada
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "refunded",
        status: "cancelled",
      },
    });

    console.log(`💰 Order ${order.orderNumber} refunded and stock returned`);
  } catch (error) {
    console.error("❌ Error handling PayPal refund:", error);
  }
}

/**
 * GET /api/webhooks/paypal
 * Health check
 */
export async function GET() {
  return NextResponse.json({ message: "PayPal webhook endpoint" });
}
