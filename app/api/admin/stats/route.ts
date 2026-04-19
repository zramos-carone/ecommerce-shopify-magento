import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: KPIs del Dashboard Administrativo
 *     description: Retorna métricas críticas del negocio, incluyendo total de ventas, órdenes procesadas, volumen de productos y las órdenes más recientes del sistema TECNO.
 *     tags:
 *       - Administración
 *     responses:
 *       200:
 *         description: Estadísticas cargadas exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalOrders: { type: 'integer' }
 *                 totalProducts: { type: 'integer' }
 *                 totalSales: { type: 'number' }
 *                 recentOrders: { type: 'array', items: { $ref: '#/components/schemas/Order' } }
 */
export async function GET() {
  try {
    const [totalOrders, totalProducts, recentOrders] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          orderNumber: true,
          firstName: true,
          lastName: true,
          status: true,
          total: true,
          createdAt: true,
        },
      }),
    ]);

    // aggregate sales
    const salesAggregate = await prisma.order.aggregate({
      where: {
        status: {
          notIn: ["cancelled", "failed"],
        },
      },
      _sum: {
        total: true,
      },
    });

    const totalSales = salesAggregate._sum.total || 0;

    return NextResponse.json({
      totalOrders,
      totalProducts,
      totalSales,
      recentOrders,
    });
  } catch (error) {
    console.error("[API_ADMIN_STATS_ERROR]", error);
    return NextResponse.json(
      { error: "Error al cargar estadísticas" },
      { status: 500 },
    );
  }
}
