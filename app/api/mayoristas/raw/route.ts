import { NextRequest, NextResponse } from 'next/server'
import { searchAllMayoristas } from '@/lib/services/mayoristas'
import { SearchQuery } from '@/lib/types/mayorista'
import { rateLimiter } from '@/lib/services/rateLimit'

export const dynamic = 'force-dynamic'

/**
 * GET /api/mayoristas/raw
 * Endpoint EXCLUSIVO para uso interno del administrador.
 * Devuelve los productos directamente de los mayoristas SIN filtros de curación.
 * El usuario final NUNCA debe acceder a esta ruta.
 */
export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    if (!rateLimiter.isAllowed(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const searchParams = request.nextUrl.searchParams
    const query: SearchQuery = {
      q: searchParams.get('q') || undefined,
      category: searchParams.get('category') || undefined,
      brand: searchParams.get('brand') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
    }

    const result = await searchAllMayoristas(query)

    console.log(`🔭 [ADMIN_RAW_SEARCH] Query: "${query.q}". Resultados: ${result.products.length}`);

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('[RAW_SEARCH_ERROR]', error)
    return NextResponse.json({ error: 'Failed to search mayoristas' }, { status: 500 })
  }
}
