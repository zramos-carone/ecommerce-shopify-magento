export * from './ingram'
export * from './distribuido'
export * from './synnex'

import { searchIngram } from './ingram'
import { searchDistribuido } from './distribuido'
import { searchSynnex } from './synnex'
import { SearchQuery, SearchResult, MayoristaProduct } from '../../types/mayorista'
import { cache } from '../cache'

export async function searchAllMayoristas(query: SearchQuery): Promise<SearchResult> {
  // Generate cache key
  const cacheKey = `search:${JSON.stringify(query)}`
  const cached = cache.get<SearchResult>(cacheKey)
  if (cached) {
    return cached
  }

  try {
    // Search in parallel
    const [ingramResults, distribuidoResults, synnexResults] = await Promise.all([
      searchIngram(query),
      searchDistribuido(query),
      searchSynnex(query),
    ])

    // Combine and deduplicate by SKU
    const allProducts = [...ingramResults, ...distribuidoResults, ...synnexResults]
    const seen = new Set<string>()
    const deduped: MayoristaProduct[] = []

    for (const product of allProducts) {
      if (!seen.has(product.sku)) {
        seen.add(product.sku)
        deduped.push(product)
      }
    }

    // Sort by price (ascending) + rating (descending)
    deduped.sort((a, b) => {
      const priceDiff = a.price - b.price
      if (priceDiff !== 0) return priceDiff
      return (b.rating || 0) - (a.rating || 0)
    })

    // Apply pagination
    const page = query.page || 1
    const limit = query.limit || 10
    const start = (page - 1) * limit
    const end = start + limit
    const paginated = deduped.slice(start, end)

    const result: SearchResult = {
      products: paginated,
      total: deduped.length,
      page,
      limit,
      hasMore: end < deduped.length,
      mayoristas: {
        ingram: ingramResults.length,
        distribuido: distribuidoResults.length,
        synnex: synnexResults.length,
      },
      timestamp: new Date().toISOString(),
    }

    // Cache result for 5 minutes
    cache.set(cacheKey, result, 5 * 60 * 1000)

    return result
  } catch (error) {
    throw new Error(
      `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
