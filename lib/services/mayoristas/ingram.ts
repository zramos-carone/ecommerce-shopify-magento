import { MayoristaProduct, SearchQuery } from '@/lib/types/mayorista'

// Mock data basado en productos tech reales
const INGRAM_PRODUCTS: MayoristaProduct[] = [
  {
    id: 'ingram-001',
    sku: 'DELL-XPS-13-2024',
    name: 'Dell XPS 13 Plus - Intel Core i5',
    description: 'Ultrabook premium con pantalla OLED',
    price: 999.99,
    stock: 45,
    inStock: true,
    category: 'Laptop',
    brand: 'Dell',
    rating: 4.7,
    mayorista: 'ingram',
    mayoristSku: 'ING-DELL-XPS13',
    mayoristPrice: 899.99,
  },
  {
    id: 'ingram-002',
    sku: 'LENOVO-THINKPAD-X1',
    name: 'Lenovo ThinkPad X1 Carbon Gen 12',
    description: 'Laptop enterprise de alto rendimiento',
    price: 1299.99,
    stock: 32,
    inStock: true,
    category: 'Laptop',
    brand: 'Lenovo',
    rating: 4.6,
    mayorista: 'ingram',
    mayoristSku: 'ING-LEN-X1C12',
    mayoristPrice: 1199.99,
  },
  {
    id: 'ingram-003',
    sku: 'APPLE-MACBOOK-M3',
    name: 'Apple MacBook Pro 14" - M3 Max',
    description: 'Laptop profesional con chip M3 Max',
    price: 1999.99,
    stock: 28,
    inStock: true,
    category: 'Laptop',
    brand: 'Apple',
    rating: 4.9,
    mayorista: 'ingram',
    mayoristSku: 'ING-APPL-MBP14',
    mayoristPrice: 1899.99,
  },
  {
    id: 'ingram-004',
    sku: 'NVIDIA-RTX-4090',
    name: 'NVIDIA RTX 4090 - 24GB GDDR6X',
    description: 'GPU top tier para gaming y AI',
    price: 1599.99,
    stock: 15,
    inStock: true,
    category: 'GPU',
    brand: 'NVIDIA',
    rating: 4.8,
    mayorista: 'ingram',
    mayoristSku: 'ING-NVD-4090',
    mayoristPrice: 1499.99,
  },
  {
    id: 'ingram-005',
    sku: 'SAMSUNG-990-PRO',
    name: 'Samsung 990 Pro NVMe - 4TB',
    description: 'SSD NVMe PCIe 4.0 ultra rápido',
    price: 299.99,
    stock: 89,
    inStock: true,
    category: 'Storage',
    brand: 'Samsung',
    rating: 4.5,
    mayorista: 'ingram',
    mayoristSku: 'ING-SAM-990P4TB',
    mayoristPrice: 249.99,
  },
]

function applyFilters(
  products: MayoristaProduct[],
  query: SearchQuery
): MayoristaProduct[] {
  return products.filter((product) => {
    // Text search
    if (query.q) {
      const q = query.q.toLowerCase()
      const matchesText =
        product.name.toLowerCase().includes(q) ||
        product.description?.toLowerCase().includes(q) ||
        product.brand?.toLowerCase().includes(q)
      if (!matchesText) return false
    }

    // Category filter
    if (
      query.category &&
      !product.category?.toLowerCase().includes(query.category.toLowerCase())
    ) {
      return false
    }

    // Brand filter
    if (query.brand && product.brand?.toLowerCase() !== query.brand.toLowerCase()) {
      return false
    }

    // Price range
    if (query.minPrice !== undefined && product.price < query.minPrice) {
      return false
    }
    if (query.maxPrice !== undefined && product.price > query.maxPrice) {
      return false
    }

    // Stock filter
    const minStockRequired = query.minStock ?? 1
    if (product.stock < minStockRequired) {
      return false
    }

    // Rating filter
    if (query.minRating && (!product.rating || product.rating < query.minRating)) {
      return false
    }

    return true
  })
}

export async function searchIngram(query: SearchQuery): Promise<MayoristaProduct[]> {
  return applyFilters(INGRAM_PRODUCTS, query)
}

export async function syncIngram(): Promise<number> {
  // En producción, aquí conectaría a Ingram Micro API real
  // Por ahora retorna el count de productos mock
  console.log(`[INGRAM] Synced ${INGRAM_PRODUCTS.length} products`)
  return INGRAM_PRODUCTS.length
}

export function getIngramProducts(): MayoristaProduct[] {
  return INGRAM_PRODUCTS
}
