import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createPayPalOrder } from '@/lib/services/payments/paypal';

/**
 * POST /api/payments/paypal-order
 * Create a PayPal order for checkout
 *
 * Body:
 * {
 *   orderId: string,
 *   amount: number (in MXN),
 *   email: string
 * }
 */
export async function POST(req: Request) {
  try {
    const { orderId, amount, email } = await req.json();

    if (!orderId || !amount || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, amount, email' },
        { status: 400 }
      );
    }

    // Verify order exists and hasn't been paid yet
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.paymentStatus !== 'pending') {
      return NextResponse.json(
        { error: 'Order payment already processed' },
        { status: 400 }
      );
    }

    // Call PayPal Core Service
    const paypalResponse = await createPayPalOrder(amount, orderId);
    const paypalOrderId = paypalResponse.id;

    // Store PayPal order ID in database for webhook matching
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentId: paypalOrderId,
        paymentMethod: 'paypal',
      },
    });

    console.log(`📦 PayPal order requested via API standalone: ${paypalOrderId}`);

    const approveUrl = paypalResponse.links?.find((link: any) => link.rel === 'approve')?.href || `https://sandbox.paypal.com/checkoutnow?token=${paypalOrderId}`;

    return NextResponse.json({
      success: true,
      paypalOrderId,
      orderNumber: order.orderNumber,
      amount: amount.toFixed(2),
      currency: 'MXN',
      approvalUrl: approveUrl,
      redirectUrl: `/payment?method=paypal&paypalOrderId=${paypalOrderId}`,
    });
  } catch (error) {
    console.error('❌ PayPal order creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create PayPal order' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/payments/paypal-order
 * Help/documentation
 */
export async function GET() {
  return NextResponse.json({
    message: 'PayPal Order Creation Endpoint',
    usage: 'POST with orderId, amount, email',
    example: {
      orderId: 'clxx...',
      amount: 5800.00,
      email: 'customer@example.com',
    },
  });
}
