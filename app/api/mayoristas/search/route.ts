import { NextRequest, NextResponse } from 'next/server'
import { searchAllMayoristas } from '@/lib/services/mayoristas'
import { SearchQuery } from '@/lib/types/mayorista'

// Force dynamic rendering because this route uses query parameters
export const dynamic = 'force-dynamic'

/**
 * @swagger
 * /api/mayoristas/search:
 *   get:
 *     tags:
 *       - Mayoristas
 *     summary: Buscar productos en todos los mayoristas
 *     description: Busca productos en Ingram, Distribuido y Synnex. Retorna resultados agregados y ordenados por precio.
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
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
 *         name: priceMin
 *         required: false
 *         schema:
 *           type: number
 *         description: Precio mínimo en USD
 *         example: 100
 *       - in: query
 *         name: priceMax
 *         required: false
 *         schema:
 *           type: number
 *         description: Precio máximo en USD
 *         example: 2000
 *     responses:
 *       200:
 *         description: Búsqueda exitosa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResult'
 *       400:
 *         description: Falta parámetro requerido "q"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
