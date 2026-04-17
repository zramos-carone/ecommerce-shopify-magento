import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { searchAllMayoristas } from '@/lib/services/mayoristas'
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
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.product.count({ where: whereClause })
    ]);

    // --- ORÁCULO DE STOCK EN TIEMPO REAL ---
    // Consultamos a los mayoristas para obtener el stock "fresco" antes de mostrar
    const products: MayoristaProduct[] = await Promise.all(localProductsRaw.map(async (p) => {
      let currentStock = p.stock;
      
      // Si tiene vínculo con mayorista, validamos disponibilidad real
      if (p.mayoristSku && p.mayoristId) {
        try {
          // Buscamos en los servicios de mayoristas (Ingram, Synnex, etc)
          const allExternal = await searchAllMayoristas({ q: p.mayoristSku });
          const externalMatch = allExternal.products.find(ep => ep.sku === p.sku || ep.sku === p.mayoristSku);
          
          if (externalMatch) {
            currentStock = externalMatch.stock;
            // Opcional: Podríamos actualizar la DB local aquí para que el admin lo vea
          }
        } catch (err) {
          console.warn(`⚠️ [STOCK_SYNC_FAILED] SKU: ${p.sku}. Usando stock local.`);
        }
      }

      return {
        id: p.id,
        sku: p.sku,
        name: p.name,
        price: p.price,
        imageUrl: p.image || '',
        brand: p.brand || 'MaxTech',
        category: p.category || '',
        stock: currentStock,
        inStock: currentStock > 0,
        mayorista: 'MAXTECH',
        rating: 5.0,
        description: p.description || ''
      };
    }));
    // ----------------------------------------

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
