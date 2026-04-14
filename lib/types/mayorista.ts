// Tipos compartidos para mayoristas
export interface MayoristaProduct {
  id: string
  sku: string
  name: string
  description?: string
  price: number
  stock: number
  category?: string
  brand?: string
  mayorista: 'ingram' | 'distribuido' | 'synnex'
  mayoristSku: string
  mayoristPrice: number
}

export interface SearchQuery {
  q: string
  category?: string
  priceMin?: number
  priceMax?: number
}

export interface SearchResult {
  products: MayoristaProduct[]
  total: number
  mayorista: string
}
