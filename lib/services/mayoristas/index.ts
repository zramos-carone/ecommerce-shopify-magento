export * from './ingram'
export * from './distribuido'
export * from './synnex'

import { searchIngram } from './ingram'
import { searchDistribuido } from './distribuido'
import { searchSynnex } from './synnex'
import { SearchQuery, SearchResult, MayoristaProduct } from '@/lib/types/mayorista'

export async function searchAllMayoristas(query: SearchQuery): Promise<{
  results: SearchResult[]
  allProducts: MayoristaProduct[]
  total: number
}> {
  // Busca en paralelo en todos los mayoristas
  const [ingramResult, distribuidoResult, synnexResult] = await Promise.all([
    searchIngram(query),
    searchDistribuido(query),
    searchSynnex(query),
  ])

  const allProducts = [
    ...ingramResult.products,
    ...distribuidoResult.products,
    ...synnexResult.products,
  ]

  return {
    results: [ingramResult, distribuidoResult, synnexResult],
    allProducts: allProducts.sort((a, b) => a.price - b.price), // Orden por precio
    total: allProducts.length,
  }
}
