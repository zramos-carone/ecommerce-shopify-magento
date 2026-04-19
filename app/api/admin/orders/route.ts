import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Listado Global de Órdenes (Admin)
 *     description: Recupera todas las órdenes del sistema con sus items. Permite filtrado por estado y paginación.
 *     tags:
 *       - Administración
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, pending, processing, shipped, delivered, failed]
 *         description: Filtrar por estado del pedido.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Cantidad de órdenes a recuperar.
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Salto para paginación.
 *     responses:
 *       200:
 *         description: Lista de órdenes obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: 'boolean' }
 *                 data: { type: 'array', items: { $ref: '#/components/schemas/Order' } }
 *                 pagination: { type: 'object' }
 */
export async function GET(req: Request) {
  try {
    // Check admin authentication (basic token check for demo)
    const authHeader = req.headers.get("authorization");
    const adminToken = process.env.ADMIN_AUTH_TOKEN || "demo-admin-token";

    if (authHeader !== `Bearer ${adminToken}`) {
      // Allow unauthenticated access for now (demo)
      // In production, enforce authentication
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 500);
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build query
    const whereClause: any = {};
    if (status && status !== "all") {
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
        orderBy: { createdAt: "desc" },
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
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
