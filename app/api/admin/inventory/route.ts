import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/admin/inventory
 * Listar inventario con filtros y búsqueda
 *
 * Query params:
 * - search: buscar por nombre o SKU
 * - category: filtrar por categoría
 * - limit: número máximo de resultados (default 100, max 500)
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category');
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500);

    // Build query
    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      whereClause.category = category;
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        sku: true,
        price: true,
        stock: true,
        category: true,
      },
      take: limit,
      orderBy: { name: 'asc' },
    });

    console.log(`📦 Inventory query: ${products.length} products (search: "${search}", category: "${category}")`);

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
      search: search || undefined,
      category: category || undefined,
    });
  } catch (error) {
    console.error('❌ Inventory fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/inventory
 * Actualizar stock en bulk
 *
 * Body: [{ productId, stockAdjustment }, ...]
 * stockAdjustment: número positivo o negativo para ajustar stock
 */
export async function PATCH(req: Request) {
  try {
    const updates = await req.json();

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request body. Expected array of updates.' },
        { status: 400 }
      );
    }

    const results = [];

    for (const { productId, stockAdjustment } of updates) {
      if (!productId || typeof stockAdjustment !== 'number') {
        results.push({
          productId,
          error: 'Invalid productId or stockAdjustment',
        });
        continue;
      }

      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        results.push({ productId, error: 'Product not found' });
        continue;
      }

      const newStock = Math.max(0, product.stock + stockAdjustment);

      const updated = await prisma.product.update({
        where: { id: productId },
        data: { stock: newStock },
      });

      results.push({
        productId,
        name: updated.name,
        oldStock: product.stock,
        newStock,
        adjustment: stockAdjustment,
        success: true,
      });
    }

    const successCount = results.filter((r: any) => r.success).length;
    console.log(`📦 Inventory bulk updated: ${successCount}/${results.length} products`);

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('❌ Inventory update error:', error);
    return NextResponse.json(
      { error: 'Failed to update inventory' },
      { status: 500 }
    );
  }
}
