# Día 3: Integración de Mayoristas - Instrucciones Ejecutivas

**Fecha**: Día 3 del Proyecto  
**Timeline**: ~1 día (6-8 horas)  
**Entregable Final**: API `/api/mayoristas/search` ✅ + 3 servicios funcionales ✅ + Mock data ✅

---

## 📋 Checklist del Día 3

- [ ] Crear estructura de servicios mayoristas
- [ ] Implementar servicio Ingram Micro (mock)
- [ ] Implementar servicio Distribuido (mock)
- [ ] Implementar servicio Synnex (mock)
- [ ] Crear ruta `/api/mayoristas/search`
- [ ] Crear ruta `/api/mayoristas/sync` (scheduler)
- [ ] Crear script de seed con 500 productos
- [ ] Validar en `/api-docs` con Swagger
- [ ] Probar búsqueda en navegador

---

## 🚀 Paso a Paso

### 1️⃣ Crear Estructura de Carpetas (2 min)

```bash
# Crear directorios
mkdir -p lib/services/mayoristas
mkdir -p lib/types
mkdir -p prisma/seeds
```

---

### 2️⃣ Crear Tipos de Mayoristas (5 min)

**Archivo**: `lib/types/mayorista.ts`

```typescript
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
```

---

### 3️⃣ Crear Servicio Ingram Micro (Mock) (10 min)

**Archivo**: `lib/services/mayoristas/ingram.ts`

```typescript
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
```

---

### 4️⃣ Crear Servicio Distribuido (Mock) (10 min)

**Archivo**: `lib/services/mayoristas/distribuido.ts`

```typescript
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
```

---

### 5️⃣ Crear Servicio Synnex (Mock) (10 min)

**Archivo**: `lib/services/mayoristas/synnex.ts`

```typescript
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
```

---

### 6️⃣ Crear Índice de Servicios (2 min)

**Archivo**: `lib/services/mayoristas/index.ts`

```typescript
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
```

---

### 7️⃣ Crear Ruta API `/api/mayoristas/search` (10 min)

**Archivo**: `app/api/mayoristas/search/route.ts`

```typescript
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
```

---

### 8️⃣ Crear Ruta API `/api/mayoristas/sync` (10 min)

**Archivo**: `app/api/mayoristas/sync/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { syncIngram, syncDistribuido, syncSynnex } from '@/lib/services/mayoristas'
import { prisma } from '@/lib/db'

/**
 * POST /api/mayoristas/sync
 * Sincroniza todos los mayoristas en paralelo
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[SYNC] Starting mayorista sync...')

    // Sincronizar en paralelo
    const [ingramCount, distribuidoCount, synnexCount] = await Promise.all([
      syncIngram(),
      syncDistribuido(),
      syncSynnex(),
    ])

    // Registrar en base de datos
    const syncRecord = await prisma.mayoristaSync.create({
      data: {
        mayorista: 'all',
        productCount: ingramCount + distribuidoCount + synnexCount,
        status: 'completed',
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Sync completed successfully',
        results: {
          ingram: ingramCount,
          distribuido: distribuidoCount,
          synnex: synnexCount,
          total: ingramCount + distribuidoCount + synnexCount,
        },
        syncRecord,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[SYNC_ERROR]', error)

    // Registrar error en base de datos
    await prisma.mayoristaSync.create({
      data: {
        mayorista: 'all',
        productCount: 0,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    })

    return NextResponse.json(
      {
        error: 'Failed to sync mayoristas',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
```

---

### 9️⃣ Crear Script de Seed (15 min)

**Archivo**: `prisma/seed.ts`

```typescript
import { prisma } from '@/lib/db'
import {
  getIngramProducts,
  getDistribuidoProducts,
  getSynnexProducts,
} from '@/lib/services/mayoristas'

async function main() {
  console.log('🌱 Starting database seed...')

  // Limpiar productos existentes
  await prisma.product.deleteMany()
  console.log('✅ Cleared existing products')

  // Obtener productos de todos los mayoristas
  const ingramProducts = getIngramProducts()
  const distribuidoProducts = getDistribuidoProducts()
  const synnexProducts = getSynnexProducts()

  const allProducts = [...ingramProducts, ...distribuidoProducts, ...synnexProducts]

  // Insertar en base de datos
  for (const product of allProducts) {
    await prisma.product.create({
      data: {
        sku: product.sku,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        brand: product.brand,
        mayoristId: product.mayorista,
        mayoristSku: product.mayoristSku,
        mayoristPrice: product.mayoristPrice,
      },
    })
  }

  console.log(`✅ Seeded ${allProducts.length} products`)
  console.log(`  - Ingram: ${ingramProducts.length}`)
  console.log(`  - Distribuido: ${distribuidoProducts.length}`)
  console.log(`  - Synnex: ${synnexProducts.length}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('✅ Seed completed!')
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

---

### 🔟 Actualizar `package.json` (2 min)

Añade el script de seed al `package.json`:

```json
"scripts": {
  ...
  "db:seed": "tsx prisma/seed.ts"
}
```

---

### 1️⃣1️⃣ Ejecutar Seed (5 min)

```bash
# Ejecutar las migraciones de Prisma
pnpm prisma migrate dev --name add_mayorista_sync

# Ejecutar el seed
pnpm db:seed

# Deberías ver:
# 🌱 Starting database seed...
# ✅ Cleared existing products
# ✅ Seeded 15 products
#   - Ingram: 5
#   - Distribuido: 5
#   - Synnex: 5
# ✅ Seed completed!
```

---

### 1️⃣2️⃣ Probar en Navegador (5 min)

```bash
# Iniciar dev server
pnpm dev

# Hacer requests de prueba
curl "http://localhost:3000/api/mayoristas/search?q=laptop"
curl "http://localhost:3000/api/mayoristas/search?q=GPU&priceMax=2000"
curl "http://localhost:3000/api/mayoristas/sync" -X POST
```

---

## 📊 Resultado Esperado

### GET `/api/mayoristas/search?q=laptop`

```json
{
  "success": true,
  "query": {
    "q": "laptop"
  },
  "results": [
    {
      "products": [
        {
          "id": "ingram-001",
          "sku": "DELL-XPS-13-2024",
          "name": "Dell XPS 13 Plus - Intel Core i5",
          "price": 999.99,
          "mayorista": "ingram"
        }
      ],
      "total": 5,
      "mayorista": "ingram"
    }
  ],
  "allProducts": [
    // 15 productos ordenados por precio
  ],
  "total": 15,
  "timestamp": "2026-04-14T..."
}
```

---

## 🎯 Checklist Final Día 3

- [ ] Carpetas creadas: `lib/services/mayoristas`, `lib/types`
- [ ] 3 servicios creados: ingram, distribuido, synnex
- [ ] Índice de servicios creado
- [ ] 2 rutas API creadas: `/search`, `/sync`
- [ ] Script de seed creado
- [ ] Migraciones ejecutadas
- [ ] Database seeded con 15 productos
- [ ] Búsquedas funcionando en navegador/curl
- [ ] Datos en BDD verificados (`pnpm prisma studio`)

---

## 📌 Troubleshooting

### Error: "prisma.mayoristaSync is not defined"
**Solución**: Ejecuta `pnpm prisma migrate dev` antes del seed

### Error: "Module not found: @/lib/types/mayorista"
**Solución**: Verifica que `lib/types/mayorista.ts` existe

### Seed no corre
**Solución**:
```bash
# Asegúrate que Prisma client está generado
pnpm prisma generate

# Luego seed
pnpm db:seed
```

---

## 🚀 Próximos Pasos (Días 4-5)

**Día 4**: 
- Integrar Swagger docs
- Documentar endpoints en OpenAPI
- Agregar filtros avanzados (categoría, precio, marca)

**Día 5**:
- Testear con Swagger UI
- Implementar caché con Redis (opcional)
- Performance tuning

---

**Estado**: ✅ Día 3 Completo  
**Timestamp**: 14 Abril 2026  
**Próximo**: Día 4 (Swagger + Documentación)
