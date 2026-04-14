import { NextRequest, NextResponse } from 'next/server'
import { searchAllMayoristas } from '@/lib/services/mayoristas'
import { SearchQuery } from '@/lib/types/mayorista'

/**
 * GET /api/mayoristas/search
 * Query params:
 *   - q: string (búsqueda)
 *   - category?: string (filtro por categoría)
 *   - priceMin?: number (precio mínimo)
 *   - priceMax?: number (precio máximo)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get('q') || ''
    const category = searchParams.get('category') || undefined
    const priceMin = searchParams.get('priceMin')
      ? parseFloat(searchParams.get('priceMin')!)
      : undefined
    const priceMax = searchParams.get('priceMax')
      ? parseFloat(searchParams.get('priceMax')!)
      : undefined

    if (!q) {
      return NextResponse.json(
        {
          error: 'Query parameter "q" is required',
          example: '/api/mayoristas/search?q=laptop',
        },
        { status: 400 }
      )
    }

    const query: SearchQuery = {
      q,
      category,
      priceMin,
      priceMax,
    }

    const results = await searchAllMayoristas(query)

    return NextResponse.json(
      {
        success: true,
        query,
        results: results.results,
        allProducts: results.allProducts,
        total: results.total,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[MAYORISTAS_SEARCH_ERROR]', error)
    return NextResponse.json(
      {
        error: 'Failed to search products',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
