import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
  sendOrderConfirmationEmail,
  sendOrderFailureEmail,
} from '@/lib/services/email';

/**
 * POST /api/payments/paypal-webhook
 *
 * Webhook endpoint for PayPal Intelligent Payment Notifications (IPN)
 * Handles:
 * - PAYMENT.CAPTURE.COMPLETED → Order completed
 * - PAYMENT.CAPTURE.DENIED → Order failed
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log(`📨 PayPal webhook received: ${body.event_type}`);

    // Verify PayPal signature (basic validation for demo)
    if (!verifyPayPalSignature(body)) {
      console.error('❌ PayPal signature verification failed');
      return NextResponse.json(
        { error: 'Signature verification failed' },
        { status: 400 }
      );
    }

    // Handle PAYMENT.CAPTURE.COMPLETED
    if (body.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      return await handlePaymentCaptureCompleted(body);
    }

    // Handle PAYMENT.CAPTURE.DENIED
    if (body.event_type === 'PAYMENT.CAPTURE.DENIED') {
      return await handlePaymentCaptureDenied(body);
    }

    // Other events - acknowledge but don't process
    console.log(`⏭️  PayPal event not processed: ${body.event_type}`);
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('❌ PayPal webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Handle PAYMENT.CAPTURE.COMPLETED event
 */
async function handlePaymentCaptureCompleted(body: any) {
  try {
    const captureId = body.resource?.id;
    const orderId = body.resource?.supplementary_data?.related_ids?.order_reference_id;

    if (!orderId) {
      console.error('❌ No orderId found in PayPal webhook');
      return NextResponse.json(
        { error: 'No orderId in metadata' },
        { status: 400 }
      );
    }

    // Fetch order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      console.error(`❌ Order not found: ${orderId}`);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order in database
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'completed',
        paymentId: captureId,
        status: 'processing',
      },
    });

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(updatedOrder as any);
    } catch (emailError) {
      console.error('❌ Failed to send confirmation email:', emailError);
      // Don't fail the webhook if email fails
    }

    console.log(`✅ Order ${order.orderNumber} (${orderId}) marked as completed via PayPal`);

    return NextResponse.json(
      {
        received: true,
        orderId,
        orderNumber: order.orderNumber,
        status: 'completed',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error processing PayPal payment:', error);
    return NextResponse.json(
      { error: 'Processing error' },
      { status: 500 }
    );
  }
}

/**
 * Handle PAYMENT.CAPTURE.DENIED event
 */
async function handlePaymentCaptureDenied(body: any) {
  try {
    const orderId = body.resource?.supplementary_data?.related_ids?.order_reference_id;
    const reason = body.resource?.reason_code || 'Unknown error';

    if (!orderId) {
      console.error('❌ No orderId found in PayPal denied webhook');
      return NextResponse.json(
        { error: 'No orderId in metadata' },
        { status: 400 }
      );
    }

    // Fetch order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      console.error(`❌ Order not found: ${orderId}`);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order as failed
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'failed',
        status: 'failed',
      },
    });

    // Send failure email
    try {
      await sendOrderFailureEmail(updatedOrder as any, `PayPal rejected: ${reason}`);
    } catch (emailError) {
      console.error('❌ Failed to send failure email:', emailError);
      // Don't fail the webhook if email fails
    }

    console.error(`❌ Order ${order.orderNumber} (${orderId}) payment denied via PayPal: ${reason}`);

    return NextResponse.json(
      {
        received: true,
        orderId,
        orderNumber: order.orderNumber,
        status: 'failed',
        reason,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error handling PayPal denied payment:', error);
    return NextResponse.json(
      { error: 'Processing error' },
      { status: 500 }
    );
  }
}

/**
 * Verify PayPal signature
 * In production, verify actual PayPal signature using their certificate
 * For demo, do basic validation
 */
function verifyPayPalSignature(body: any): boolean {
  // Basic validation - in production, verify against PayPal's certificate
  return body.id && body.event_type && body.resource;
}

/**
 * GET /api/payments/paypal-webhook
 * Health check / documentation
 */
export async function GET() {
  return NextResponse.json({
    message: 'PayPal Webhook Endpoint',
    events: [
      'PAYMENT.CAPTURE.COMPLETED',
      'PAYMENT.CAPTURE.DENIED',
    ],
    documentation: 'https://developer.paypal.com/docs/integration/direct/webhooks/event-types/',
  });
}
