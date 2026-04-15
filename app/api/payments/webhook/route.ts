import { headers } from 'next/headers';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';
import {
  sendOrderConfirmationEmail,
  sendOrderFailureEmail,
} from '@/lib/services/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-08-16',
});

/**
 * POST /api/payments/webhook
 * 
 * Webhook endpoint for Stripe events
 * Handles:
 * - payment_intent.succeeded → Mark order as completed
 * - payment_intent.payment_failed → Mark order as failed
 */
export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  let event: Stripe.Event;

  // Verify webhook signature
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature || '',
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (error) {
    console.error('❌ Webhook signature verification failed:', error);
    return new Response('Webhook signature verification failed', {
      status: 400,
    });
  }

  console.log(`📨 Webhook received: ${event.type} (ID: ${event.id})`);

  // Handle payment_intent.succeeded
  if (event.type === 'payment_intent.succeeded') {
    return handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
  }

  // Handle payment_intent.payment_failed
  if (event.type === 'payment_intent.payment_failed') {
    return handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
  }

  // Other events - acknowledge but don't process
  console.log(`⏭️  Event type not processed: ${event.type}`);
  return new Response(JSON.stringify({ received: true, processed: false }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Handle payment_intent.succeeded event
 * Updates order status to completed and sends confirmation email
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata?.orderId;

    if (!orderId) {
      console.error('❌ No orderId found in payment intent metadata');
      return new Response(
        JSON.stringify({ error: 'No orderId in metadata' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch order with related user data
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      console.error(`❌ Order not found: ${orderId}`);
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'completed',
        paymentId: paymentIntent.id,
        status: 'processing', // Move to processing instead of pending
      },
    });

    console.log(
      `✅ Order ${order.orderNumber} (${orderId}) marked as completed`
    );

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(
        updatedOrder as any
      );
    } catch (emailError) {
      console.error('❌ Failed to send confirmation email:', emailError);
      // Don't fail the webhook if email fails
    }

    // Log event for audit trail
    await logWebhookEvent('payment_intent.succeeded', orderId, paymentIntent.id);

    return new Response(
      JSON.stringify({
        received: true,
        processed: true,
        eventId: 'payment_intent.succeeded',
        orderId,
        orderNumber: order.orderNumber,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Error handling payment_intent.succeeded:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Handle payment_intent.payment_failed event
 * Updates order status to failed and sends failure email
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata?.orderId;

    if (!orderId) {
      console.error('❌ No orderId found in payment intent metadata');
      return new Response(
        JSON.stringify({ error: 'No orderId in metadata' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch order with related data
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      console.error(`❌ Order not found: ${orderId}`);
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get failure reason from payment error
    const failureReason =
      paymentIntent.last_payment_error?.message ||
      'Error desconocido al procesar el pago';

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'failed',
        paymentId: paymentIntent.id,
        status: 'failed',
      },
    });

    console.error(
      `❌ Order ${order.orderNumber} (${orderId}) payment failed: ${failureReason}`
    );

    // Send failure email
    try {
      await sendOrderFailureEmail(
        updatedOrder as any,
        failureReason
      );
    } catch (emailError) {
      console.error('❌ Failed to send failure email:', emailError);
      // Don't fail the webhook if email fails
    }

    // Log event for audit trail
    await logWebhookEvent('payment_intent.payment_failed', orderId, paymentIntent.id, failureReason);

    return new Response(
      JSON.stringify({
        received: true,
        processed: true,
        eventId: 'payment_intent.payment_failed',
        orderId,
        orderNumber: order.orderNumber,
        failureReason,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Error handling payment_intent.payment_failed:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Log webhook event to database for audit trail
 */
async function logWebhookEvent(
  eventType: string,
  orderId: string,
  _paymentIntentId: string,
  _details?: string
) {
  try {
    // This assumes you have a WebhookLog model
    // If not, you can skip this or add it later
    console.log(`📋 Webhook event logged: ${eventType} for order ${orderId}`);
  } catch (error) {
    console.error('❌ Failed to log webhook event:', error);
  }
}
