import { NextRequest, NextResponse } from 'next/server'
import { searchAllMayoristas } from '@/lib/services/mayoristas'
import { SearchQuery } from '@/lib/types/mayorista'
import { rateLimiter } from '@/lib/services/rateLimit'

// Force dynamic rendering because this route uses query parameters
export const dynamic = 'force-dynamic'

/**
 * @swagger
 * /api/mayoristas/search:
 *   get:
 *     tags:
 *       - Mayoristas
 *     summary: Buscar productos en todos los mayoristas
 *     description: Busca productos en Ingram, Distribuido y Synnex. Retorna resultados agregados con caching y paginación.
 *     parameters:
 *       - in: query
 *         name: q
 *         required: false
 *         schema:
 *           type: string
 *         description: Término de búsqueda (nombre, SKU, marca)
 *         example: laptop
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtrar por categoría
 *         example: Laptop
 *       - in: query
 *         name: brand
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtrar por marca
 *         example: Dell
 *       - in: query
 *         name: minPrice
 *         required: false
 *         schema:
 *           type: number
 *         description: Precio mínimo en USD
 *         example: 100
 *       - in: query
 *         name: maxPrice
 *         required: false
 *         schema:
 *           type: number
 *         description: Precio máximo en USD
 *         example: 2000
 *       - in: query
 *         name: minStock
 *         required: false
 *         schema:
 *           type: number
 *         description: Stock mínimo disponible
 *         example: 1
 *       - in: query
 *         name: minRating
 *         required: false
 *         schema:
 *           type: number
 *         description: Rating mínimo (0-5)
 *         example: 4
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: number
 *         description: Página de resultados (comienza en 1)
 *         example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: number
 *         description: Resultados por página
 *         example: 10
 *     responses:
 *       200:
 *         description: Búsqueda exitosa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResult'
 *       429:
 *         description: Demasiadas solicitudes (rate limit excedido)
 *       500:
 *         description: Error interno del servidor
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    if (!rateLimiter.isAllowed(ip)) {
      const remaining = rateLimiter.getRemaining(ip)
      return NextResponse.json(
        { error: 'Too many requests', remaining },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': String(remaining),
          },
        }
      )
    }

    const searchParams = request.nextUrl.searchParams

    const query: SearchQuery = {
      q: searchParams.get('q') || undefined,
      category: searchParams.get('category') || undefined,
      brand: searchParams.get('brand') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      minStock: searchParams.get('minStock') ? Number(searchParams.get('minStock')) : undefined,
      minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 10,
    }

    const result = await searchAllMayoristas(query)

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'X-RateLimit-Remaining': String(rateLimiter.getRemaining(ip)),
      },
    })
  } catch (error) {
    console.error('[MAYORISTAS_SEARCH_ERROR]', error)
    return NextResponse.json(
      {
        error: 'Failed to search products',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
