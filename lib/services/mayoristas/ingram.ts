import { MayoristaProduct, SearchQuery, SearchResult } from '@/lib/types/mayorista'

// Mock data basado en productos tech reales
const INGRAM_PRODUCTS: MayoristaProduct[] = [
  {
    id: 'ingram-001',
    sku: 'DELL-XPS-13-2024',
    name: 'Dell XPS 13 Plus - Intel Core i5',
    description: 'Ultrabook premium con pantalla OLED',
    price: 999.99,
    stock: 45,
    category: 'Laptop',
    brand: 'Dell',
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
    category: 'Laptop',
    brand: 'Lenovo',
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
    category: 'Laptop',
    brand: 'Apple',
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
    category: 'GPU',
    brand: 'NVIDIA',
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
    category: 'Storage',
    brand: 'Samsung',
    mayorista: 'ingram',
    mayoristSku: 'ING-SAM-990P4TB',
    mayoristPrice: 249.99,
  },
]

export async function searchIngram(query: SearchQuery): Promise<SearchResult> {
  // Simula búsqueda (sin credenciales reales aún)
  const searchTerm = query.q.toLowerCase()

  const filtered = INGRAM_PRODUCTS.filter((product) => {
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
    mayorista: 'ingram',
  }
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
