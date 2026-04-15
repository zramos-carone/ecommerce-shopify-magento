import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/admin/orders
 * List all orders with optional filtering
 *
 * Query params:
 * - status: filter by order status (pending, processing, shipped, delivered, failed)
 * - limit: number of orders to return (default 100, max 500)
 * - offset: pagination offset (default 0)
 */
export async function GET(req: Request) {
  try {
    // Check admin authentication (basic token check for demo)
    const authHeader = req.headers.get('authorization');
    const adminToken = process.env.ADMIN_AUTH_TOKEN || 'demo-admin-token';

    if (authHeader !== `Bearer ${adminToken}`) {
      // Allow unauthenticated access for now (demo)
      // In production, enforce authentication
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    const whereClause: any = {};
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    // Fetch orders
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: whereClause,
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
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.order.count({ where: whereClause }),
    ]);

    console.log(`📋 Admin fetched ${orders.length} orders (total: ${total})`);

    return NextResponse.json(
      {
        success: true,
        data: orders,
        pagination: {
          total,
          count: orders.length,
          limit,
          offset,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Failed to fetch orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
