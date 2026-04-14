import { MayoristaProduct, SearchQuery, SearchResult } from '@/lib/types/mayorista'

const SYNNEX_PRODUCTS: MayoristaProduct[] = [
  {
    id: 'syn-001',
    sku: 'RAZER-BLADE-15',
    name: 'Razer Blade 15 - RTX 4080',
    description: 'Gaming laptop ultrafino con RTX 4080',
    price: 2999.99,
    stock: 12,
    category: 'Laptop',
    brand: 'Razer',
    mayorista: 'synnex',
    mayoristSku: 'SYN-RAZR-BLADE15',
    mayoristPrice: 2899.99,
  },
  {
    id: 'syn-002',
    sku: 'LOGITECH-MX-MASTER',
    name: 'Logitech MX Master 3S',
    description: 'Ratón profesional multi-dispositivo',
    price: 99.99,
    stock: 234,
    category: 'Peripherals',
    brand: 'Logitech',
    mayorista: 'synnex',
    mayoristSku: 'SYN-LOG-MXM3S',
    mayoristPrice: 79.99,
  },
  {
    id: 'syn-003',
    sku: 'SAMSUNG-OLED-55',
    name: 'Samsung 55" OLED 4K TV',
    description: 'Monitor/TV OLED 4K para profesionales',
    price: 1299.99,
    stock: 18,
    category: 'Display',
    brand: 'Samsung',
    mayorista: 'synnex',
    mayoristSku: 'SYN-SAM-OLED55',
    mayoristPrice: 1199.99,
  },
  {
    id: 'syn-004',
    sku: 'SONOS-ARC',
    name: 'Sonos Arc - Soundbar WiFi',
    description: 'Soundbar WiFi con Dolby Atmos',
    price: 799.99,
    stock: 45,
    category: 'Audio',
    brand: 'Sonos',
    mayorista: 'synnex',
    mayoristSku: 'SYN-SON-ARC',
    mayoristPrice: 699.99,
  },
  {
    id: 'syn-005',
    sku: 'BELKIN-USB-HUB',
    name: 'Belkin 7-in-1 USB-C Hub',
    description: 'Hub USB-C con múltiples puertos',
    price: 149.99,
    stock: 178,
    category: 'Accessories',
    brand: 'Belkin',
    mayorista: 'synnex',
    mayoristSku: 'SYN-BLK-HUB7',
    mayoristPrice: 119.99,
  },
]

export async function searchSynnex(query: SearchQuery): Promise<SearchResult> {
  const searchTerm = query.q.toLowerCase()

  const filtered = SYNNEX_PRODUCTS.filter((product) => {
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
    mayorista: 'synnex',
  }
}

export async function syncSynnex(): Promise<number> {
  console.log(`[SYNNEX] Synced ${SYNNEX_PRODUCTS.length} products`)
  return SYNNEX_PRODUCTS.length
}

export function getSynnexProducts(): MayoristaProduct[] {
  return SYNNEX_PRODUCTS
}
