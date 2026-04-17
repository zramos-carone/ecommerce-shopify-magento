import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [
      totalOrders,
      totalProducts,
      recentOrders
    ] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          orderNumber: true,
          firstName: true,
          lastName: true,
          status: true,
          total: true,
          createdAt: true,
        }
      })
    ])

    // aggregate sales
    const salesAggregate = await prisma.order.aggregate({
      where: {
        status: {
          notIn: ['cancelled', 'failed']
        }
      },
      _sum: {
        total: true
      }
    })
    
    const totalSales = salesAggregate._sum.total || 0

    return NextResponse.json({
      totalOrders,
      totalProducts,
      totalSales,
      recentOrders
    })
  } catch (error) {
    console.error('[API_ADMIN_STATS_ERROR]', error)
    return NextResponse.json(
      { error: 'Error al cargar estadísticas' },
      { status: 500 }
    )
  }
}
