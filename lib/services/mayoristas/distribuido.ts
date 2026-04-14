import { MayoristaProduct, SearchQuery, SearchResult } from '@/lib/types/mayorista'

const DISTRIBUIDO_PRODUCTS: MayoristaProduct[] = [
  {
    id: 'dist-001',
    sku: 'HP-PAVILION-15',
    name: 'HP Pavilion 15 - Ryzen 5 7520U',
    description: 'Laptop balanceada para estudiantes',
    price: 599.99,
    stock: 67,
    category: 'Laptop',
    brand: 'HP',
    mayorista: 'distribuido',
    mayoristSku: 'DIST-HP-PAV15',
    mayoristPrice: 549.99,
  },
  {
    id: 'dist-002',
    sku: 'ASUS-ROG-STRIX',
    name: 'ASUS ROG Strix G16 - RTX 4070',
    description: 'Gaming laptop de alto rendimiento',
    price: 1799.99,
    stock: 23,
    category: 'Laptop',
    brand: 'ASUS',
    mayorista: 'distribuido',
    mayoristSku: 'DIST-ASUS-ROG',
    mayoristPrice: 1699.99,
  },
  {
    id: 'dist-003',
    sku: 'INTEL-CORE-I9',
    name: 'Intel Core i9-13900K - LGA1700',
    description: 'Procesador flagship para gaming/workstation',
    price: 599.99,
    stock: 41,
    category: 'CPU',
    brand: 'Intel',
    mayorista: 'distribuido',
    mayoristSku: 'DIST-INTEL-I9',
    mayoristPrice: 549.99,
  },
  {
    id: 'dist-004',
    sku: 'KINGSTON-DDR5',
    name: 'Kingston DDR5 32GB (2x16) 6000MHz',
    description: 'Memoria RAM DDR5 de alto rendimiento',
    price: 149.99,
    stock: 156,
    category: 'RAM',
    brand: 'Kingston',
    mayorista: 'distribuido',
    mayoristSku: 'DIST-KING-DDR5',
    mayoristPrice: 129.99,
  },
  {
    id: 'dist-005',
    sku: 'CORSAIR-RM850X',
    name: 'Corsair RM850x 850W 80+ Gold',
    description: 'Fuente modular para gaming/workstation',
    price: 119.99,
    stock: 87,
    category: 'Power Supply',
    brand: 'Corsair',
    mayorista: 'distribuido',
    mayoristSku: 'DIST-CORS-RM850',
    mayoristPrice: 99.99,
  },
]

export async function searchDistribuido(query: SearchQuery): Promise<SearchResult> {
  const searchTerm = query.q.toLowerCase()

  const filtered = DISTRIBUIDO_PRODUCTS.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.sku.toLowerCase().includes(searchTerm) ||
      product.brand?.toLowerCase().includes(searchTerm)

    const matchesCategory = !query.category || product.category === query.category
    const matchesPrice =
      (!query.priceMin || product.price >= query.priceMin) &&
      (!query.priceMax || product.price <= query.priceMax)

    return matchesSearch && matchesCategory && matchesPrice
  })

  return {
    products: filtered,
    total: filtered.length,
    mayorista: 'distribuido',
  }
}

export async function syncDistribuido(): Promise<number> {
  console.log(`[DISTRIBUIDO] Synced ${DISTRIBUIDO_PRODUCTS.length} products`)
  return DISTRIBUIDO_PRODUCTS.length
}

export function getDistribuidoProducts(): MayoristaProduct[] {
  return DISTRIBUIDO_PRODUCTS
}
