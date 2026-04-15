import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * PATCH /api/admin/orders/[id]
 * Update order status
 *
 * Body:
 * {
 *   status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'failed'
 * }
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status } = await req.json();

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'failed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Fetch order
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });

    console.log(`✅ Order ${order.orderNumber} status updated to: ${status}`);

    return NextResponse.json(
      {
        success: true,
        data: updatedOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Failed to update order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/orders/[id]
 * Get specific order details
 */
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Failed to fetch order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
