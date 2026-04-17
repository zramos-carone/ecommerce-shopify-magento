import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { MayoristaProduct, SearchResult } from '@/lib/types/mayorista'
import { rateLimiter } from '@/lib/services/rateLimit'

export const dynamic = 'force-dynamic'

/**
 * GET /api/mayoristas/search (BOUTIQUE EDITION)
 * En este modelo, el catálogo público SOLO muestra productos que han sido
 * "curados" por el administrador (están en la DB local y tienen imagen).
 */
export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    if (!rateLimiter.isAllowed(ip)) {
      const remaining = rateLimiter.getRemaining(ip)
      return NextResponse.json({ error: 'Too many requests', remaining }, { status: 429 })
    }

    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get('q') || ''
    const category = searchParams.get('category')
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 12

    // 1. Búsqueda exclusiva en Base de Datos Local
    const skip = (page - 1) * limit;

    const whereClause: any = {
      // FILTRO DE CALIDAD: El producto DEBE tener imagen para ser visible
      NOT: { image: null },
      AND: []
    };

    if (q) {
      whereClause.AND.push({
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { sku: { contains: q, mode: 'insensitive' } },
          { brand: { contains: q, mode: 'insensitive' } },
        ]
      });
    }

    if (category) {
      whereClause.AND.push({ category: { equals: category, mode: 'insensitive' } });
    }

    // 2. Ejecutar consulta
    const [localProductsRaw, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        orderBy: { updatedAt: 'desc' }, // Mostrar lo más reciente curado primero
        skip,
        take: limit
      }),
      prisma.product.count({ where: whereClause })
    ]);

    // 3. Convertir al formato de visualización (MayoristaProduct)
    const products: MayoristaProduct[] = localProductsRaw.map(p => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      price: p.price,
      imageUrl: p.image || '', // Ya filtramos nulos, pero react lo necesita
      brand: p.brand || 'MaxTech',
      category: p.category || '',
      stock: p.stock,
      inStock: p.stock > 0,
      mayorista: 'MAXTECH', // Ocultamos la procedencia real
      rating: 5.0,
      description: p.description || ''
    }));

    const result: SearchResult = {
      products,
      total: totalCount,
      page,
      limit,
      hasMore: (skip + products.length) < totalCount,
      timestamp: new Date().toISOString()
    };

    console.log(`💎 [BOUTIQUE_SEARCH] Query: "${q}". Visibles: ${products.length}/${totalCount}`);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'X-RateLimit-Remaining': String(rateLimiter.getRemaining(ip)),
      },
    })
  } catch (error) {
    console.error('[BOUTIQUE_SEARCH_ERROR]', error)
    return NextResponse.json({ error: 'Failed to search curated products' }, { status: 500 })
  }
}
