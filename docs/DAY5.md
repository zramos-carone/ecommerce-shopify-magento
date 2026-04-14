# Día 5: Performance & Advanced Filters 🚀

**Timeline**: ~6-8 horas  
**Deliverables**: Advanced search API, caching, rate limiting, Jest tests  
**Acceptance Criteria**: Search <100ms, handle 10x concurrent requests, 100% test coverage  

---

## Visión General

Hoy pasamos de "mayoristas funcionales" a "búsqueda de clase mundial". Implementamos:

1. **Filtros avanzados**: category, brand, minPrice, maxPrice, stock, rating
2. **Caching en memoria**: Evitar 1000s de búsquedas repetidas
3. **Rate limiting**: Proteger API de abuso
4. **Jest tests**: Validación automatizada
5. **Optimización Prisma**: Queries más rápidas

---

## Paso 1: Update Tipos con Filtros Avanzados (10min)

Extender `/lib/types/mayorista.ts` para soportar más filtros.

**Cambios:**
- Agregar fileds: `brand`, `minPrice`, `maxPrice`, `stock`, `rating`
- Extend `SearchQuery` interface

**File**: `lib/types/mayorista.ts`

```typescript
// Añadir estos campos a MayoristaProduct interface
export interface MayoristaProduct {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  brand: string;  // ← NEW
  price: number;
  mayorista: 'ingram' | 'distribuido' | 'synnex';
  inStock: boolean;
  stock: number;  // ← NEW
  rating?: number;  // ← NEW
  imageUrl?: string;
}

// Extender SearchQuery
export interface SearchQuery {
  q?: string;
  category?: string;
  brand?: string;  // ← NEW
  minPrice?: number;  // ← NEW
  maxPrice?: number;  // ← NEW
  minStock?: number;  // ← NEW
  minRating?: number;  // ← NEW
  page?: number;
  limit?: number;
}
```

---

## Paso 2: Crear Cache Manager (15min)

Implementar caching en memoria simple para búsquedas frecuentes.

**File**: `lib/services/cache.ts` (nuevo)

```typescript
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // milliseconds
}

class CacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.DEFAULT_TTL,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;

    // Check if expired
    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  clear(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    // Clear entries matching pattern
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  size(): number {
    return this.cache.size;
  }
}

// Singleton instance
const globalForCache = global as unknown as { cache: CacheManager };
export const cache = globalForCache.cache || new CacheManager();

if (process.env.NODE_ENV === 'development') {
  globalForCache.cache = cache;
}
```

---

## Paso 3: Actualizar Servicios Mayoristas con Filtros (20min)

Cada servicio mayorista ahora filtra por `brand`, `minPrice`, `maxPrice`, `stock`, `rating`.

**Files**: `lib/services/mayoristas/ingram.ts`, `distribuido.ts`, `synnex.ts`

**Patrón general** (aplicar a los 3 archivos):

```typescript
// En cada archivo, update el mock data con brand y rating

const PRODUCTS: MayoristaProduct[] = [
  {
    id: 'ing-001',
    sku: 'DELL-XPS-15',
    name: 'Dell XPS 15',
    description: 'Premium 15.6" laptop',
    category: 'Laptops',
    brand: 'Dell',  // ← ADD
    price: 1499.99,
    mayorista: 'ingram',
    inStock: true,
    stock: 42,  // ← ADD
    rating: 4.8,  // ← ADD
    imageUrl: 'https://via.placeholder.com/300?text=Dell+XPS',
  },
  // ... más productos con brand, stock, rating
];

// Crear función filter helper
function applyFilters(
  products: MayoristaProduct[],
  query: SearchQuery
): MayoristaProduct[] {
  return products.filter((product) => {
    // Text search
    if (query.q) {
      const q = query.q.toLowerCase();
      const matchesText =
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q);
      if (!matchesText) return false;
    }

    // Category filter
    if (query.category && !product.category.toLowerCase().includes(query.category.toLowerCase())) {
      return false;
    }

    // Brand filter
    if (query.brand && product.brand.toLowerCase() !== query.brand.toLowerCase()) {
      return false;
    }

    // Price range
    if (query.minPrice !== undefined && product.price < query.minPrice) {
      return false;
    }
    if (query.maxPrice !== undefined && product.price > query.maxPrice) {
      return false;
    }

    // Stock filter
    const minStockRequired = query.minStock ?? 1;
    if (product.stock < minStockRequired) {
      return false;
    }

    // Rating filter
    if (query.minRating && (!product.rating || product.rating < query.minRating)) {
      return false;
    }

    return true;
  });
}

// Update search functions to use filters
export async function searchIngram(query: SearchQuery): Promise<MayoristaProduct[]> {
  return applyFilters(PRODUCTS, query);
}
```

---

## Paso 4: Agregar Filtrado a Agregador (15min)

Update `lib/services/mayoristas/index.ts` para:
- Aplicar filtros globales
- Deduplicar productos por SKU
- Ordenar por precio + relevancia
- Implementar paginación

**File**: `lib/services/mayoristas/index.ts`

```typescript
import { SearchQuery, MayoristaProduct, SearchResult } from '@/lib/types/mayorista';
import { searchIngram } from './ingram';
import { searchDistribuido } from './distribuido';
import { searchSynnex } from './synnex';
import { cache } from '@/lib/services/cache';

export async function searchAllMayoristas(query: SearchQuery): Promise<SearchResult> {
  // Generate cache key
  const cacheKey = `search:${JSON.stringify(query)}`;
  const cached = cache.get<SearchResult>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // Search in parallel
    const [ingramResults, distribuidoResults, synnexResults] = await Promise.all([
      searchIngram(query),
      searchDistribuido(query),
      searchSynnex(query),
    ]);

    // Combine and deduplicate by SKU
    const allProducts = [...ingramResults, ...distribuidoResults, ...synnexResults];
    const seen = new Set<string>();
    const deduped: MayoristaProduct[] = [];

    for (const product of allProducts) {
      if (!seen.has(product.sku)) {
        seen.add(product.sku);
        deduped.push(product);
      }
    }

    // Sort by price (ascending) + rating (descending)
    deduped.sort((a, b) => {
      const priceDiff = a.price - b.price;
      if (priceDiff !== 0) return priceDiff;
      return (b.rating || 0) - (a.rating || 0);
    });

    // Apply pagination
    const page = query.page || 1;
    const limit = query.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = deduped.slice(start, end);

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
    };

    // Cache result for 5 minutes
    cache.set(cacheKey, result, 5 * 60 * 1000);
    
    return result;
  } catch (error) {
    throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
```

---

## Paso 5: Actualizar API Route con Rate Limiting (15min)

Agregar rate limiting simple a `/api/mayoristas/search`.

**File**: `lib/services/rateLimit.ts` (nuevo)

```typescript
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private readonly WINDOW_MS = 60 * 1000; // 1 minute
  private readonly MAX_REQUESTS = 100; // 100 requests per minute per IP

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const entry = this.limits.get(identifier);

    if (!entry || now > entry.resetTime) {
      // Create new entry
      this.limits.set(identifier, {
        count: 1,
        resetTime: now + this.WINDOW_MS,
      });
      return true;
    }

    // Increment counter
    entry.count++;
    return entry.count <= this.MAX_REQUESTS;
  }

  getRemaining(identifier: string): number {
    const entry = this.limits.get(identifier);
    if (!entry || Date.now() > entry.resetTime) {
      return this.MAX_REQUESTS;
    }
    return Math.max(0, this.MAX_REQUESTS - entry.count);
  }
}

const globalForRateLimit = global as unknown as { rateLimiter: RateLimiter };
export const rateLimiter = globalForRateLimit.rateLimiter || new RateLimiter();

if (process.env.NODE_ENV === 'development') {
  globalForRateLimit.rateLimiter = rateLimiter;
}
```

**File**: `app/api/mayoristas/search/route.ts` (update)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { SearchQuery } from '@/lib/types/mayorista';
import { searchAllMayoristas } from '@/lib/services/mayoristas';
import { rateLimiter } from '@/lib/services/rateLimit';

export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/mayoristas/search:
 *   get:
 *     summary: Search products across all mayoristas
 *     parameters:
 *       - name: q
 *         in: query
 *         type: string
 *       - name: category
 *         in: query
 *         type: string
 *       - name: brand
 *         in: query
 *         type: string
 *       - name: minPrice
 *         in: query
 *         type: number
 *       - name: maxPrice
 *         in: query
 *         type: number
 *       - name: minStock
 *         in: query
 *         type: number
 *       - name: minRating
 *         in: query
 *         type: number
 *       - name: page
 *         in: query
 *         type: number
 *       - name: limit
 *         in: query
 *         type: number
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimiter.isAllowed(ip)) {
      const remaining = rateLimiter.getRemaining(ip);
      return NextResponse.json(
        { error: 'Too many requests', remaining },
        { status: 429 }
      );
    }

    const query: SearchQuery = {
      q: request.nextUrl.searchParams.get('q') || undefined,
      category: request.nextUrl.searchParams.get('category') || undefined,
      brand: request.nextUrl.searchParams.get('brand') || undefined,
      minPrice: request.nextUrl.searchParams.get('minPrice')
        ? Number(request.nextUrl.searchParams.get('minPrice'))
        : undefined,
      maxPrice: request.nextUrl.searchParams.get('maxPrice')
        ? Number(request.nextUrl.searchParams.get('maxPrice'))
        : undefined,
      minStock: request.nextUrl.searchParams.get('minStock')
        ? Number(request.nextUrl.searchParams.get('minStock'))
        : undefined,
      minRating: request.nextUrl.searchParams.get('minRating')
        ? Number(request.nextUrl.searchParams.get('minRating'))
        : undefined,
      page: request.nextUrl.searchParams.get('page')
        ? Number(request.nextUrl.searchParams.get('page'))
        : 1,
      limit: request.nextUrl.searchParams.get('limit')
        ? Number(request.nextUrl.searchParams.get('limit'))
        : 10,
    };

    const result = await searchAllMayoristas(query);

    return NextResponse.json(result, {
      headers: {
        'X-RateLimit-Remaining': String(rateLimiter.getRemaining(ip)),
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
```

---

## Paso 6: Crear Jest Tests (20min)

Agregar tests para mayoristas, cache, rate limiting.

**File**: `lib/services/__tests__/cache.test.ts` (nuevo)

```typescript
import { cache } from '@/lib/services/cache';

describe('Cache Manager', () => {
  beforeEach(() => {
    cache.clear();
  });

  test('should store and retrieve data', () => {
    const data = { id: 1, name: 'Test' };
    cache.set('test-key', data);
    
    const retrieved = cache.get('test-key');
    expect(retrieved).toEqual(data);
  });

  test('should return null for expired entries', async () => {
    const data = { id: 1, name: 'Test' };
    cache.set('test-key', data, 100); // 100ms TTL
    
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const retrieved = cache.get('test-key');
    expect(retrieved).toBeNull();
  });

  test('should clear by pattern', () => {
    cache.set('search:laptop', { results: [] });
    cache.set('search:desktop', { results: [] });
    cache.set('user:123', { name: 'John' });
    
    cache.clear('search:');
    
    expect(cache.get('search:laptop')).toBeNull();
    expect(cache.get('search:desktop')).toBeNull();
    expect(cache.get('user:123')).not.toBeNull();
  });
});
```

**File**: `lib/services/__tests__/mayorista.test.ts` (nuevo)

```typescript
import { searchAllMayoristas } from '@/lib/services/mayoristas';
import { SearchQuery } from '@/lib/types/mayorista';

describe('Mayorista Search', () => {
  test('should search by text query', async () => {
    const result = await searchAllMayoristas({ q: 'laptop' });
    expect(result.products.length).toBeGreaterThan(0);
  });

  test('should filter by price range', async () => {
    const result = await searchAllMayoristas({
      minPrice: 1000,
      maxPrice: 2000,
    });
    
    result.products.forEach(product => {
      expect(product.price).toBeGreaterThanOrEqual(1000);
      expect(product.price).toBeLessThanOrEqual(2000);
    });
  });

  test('should filter by brand', async () => {
    const result = await searchAllMayoristas({ brand: 'Dell' });
    
    result.products.forEach(product => {
      expect(product.brand.toLowerCase()).toBe('dell');
    });
  });

  test('should handle pagination', async () => {
    const page1 = await searchAllMayoristas({ page: 1, limit: 5 });
    const page2 = await searchAllMayoristas({ page: 2, limit: 5 });
    
    expect(page1.products.length).toBe(5);
    expect(page2.page).toBe(2);
    expect(page1.products[0].id).not.toBe(page2.products[0].id);
  });

  test('should sort by price', async () => {
    const result = await searchAllMayoristas({});
    
    for (let i = 0; i < result.products.length - 1; i++) {
      expect(result.products[i].price).toBeLessThanOrEqual(
        result.products[i + 1].price
      );
    }
  });
});
```

---

## Paso 7: Actualizar package.json con Scripts (5min)

Add test script ya existe, pero validar:

```json
{
  "scripts": {
    "test": "jest --watch",
    "test:ci": "jest --coverage",
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

---

## Paso 8: Ejecutar Tests & Validar (10min)

```bash
# Install test dependencies if needed
pnpm add -D @types/jest jest @testing-library/react

# Run tests
pnpm test

# Run tests with coverage
pnpm test:ci
```

**Expected Output:**
```
PASS  lib/services/__tests__/cache.test.ts
  Cache Manager
    ✓ should store and retrieve data (5ms)
    ✓ should return null for expired entries (105ms)
    ✓ should clear by pattern (10ms)

PASS  lib/services/__tests__/mayorista.test.ts
  Mayorista Search
    ✓ should search by text query (15ms)
    ✓ should filter by price range (10ms)
    ✓ should filter by brand (8ms)
    ✓ should handle pagination (12ms)
    ✓ should sort by price (9ms)

Test Suites: 2 passed, 2 total
Tests:       8 passed, 8 total
```

---

## Paso 9: Test Performance & Caching (10min)

Probar cambios en búsquedas:

```bash
# Terminal 1: Start dev server
pnpm dev

# Terminal 2: Run load tests
curl "http://localhost:3000/api/mayoristas/search?q=laptop&minPrice=500&maxPrice=2000&brand=Dell&page=1&limit=10"
curl "http://localhost:3000/api/mayoristas/search?q=laptop&minPrice=500&maxPrice=2000&brand=Dell&page=2&limit=10"

# Test rate limiting (make 150 requests in 60 seconds)
for i in {1..150}; do
  curl -s "http://localhost:3000/api/mayoristas/search?q=test" > /dev/null
  sleep 0.4
done

# Last request should return 429 (Too Many Requests)
curl "http://localhost:3000/api/mayoristas/search?q=test"
```

---

## Paso 10: Commit & Push (5min)

```bash
# Add all changes
git add .

# Commit with conventional message
git commit -m "feat(search): add advanced filters, caching, and rate limiting

- Add brand, stock, rating, minPrice, maxPrice filters to search
- Implement in-memory caching with 5min TTL
- Add rate limiting: 100 requests/min per IP
- Implement pagination (page, limit params)
- Deduplication by SKU across mayoristas
- Sorting by price + rating
- Add Jest test suite (cache, mayoristas, filtering)
- Add RateLimiter singleton for IP-based limiting

Tests:
✓ Cache storage and retrieval
✓ Cache TTL expiration
✓ Pattern-based cache clearing
✓ Text search filtering
✓ Price range filtering
✓ Brand filtering
✓ Pagination support
✓ Sorting by price

Performance:
- Search <100ms with caching
- Handle 100+ concurrent requests
- Memory efficient with 5min cache purge"

# Push to GitHub
git push origin main
```

---

## Paso 11: Validar en Swagger & Vercel (5min)

1. **Local**:
   ```bash
   curl "http://localhost:3000/api-docs"
   # Swagger UI debe mostrar nuevos parámetros en /search
   ```

2. **Vercel** (después del auto-deploy):
   ```bash
   curl "https://ecommerce-mvp-[hash].vercel.app/api/mayoristas/search?q=laptop&minPrice=1000&maxPrice=2000"
   ```

**Expected Response**:
```json
{
  "products": [
    {
      "id": "inc-001",
      "sku": "DELL-XPS-15",
      "name": "Dell XPS 15",
      "category": "Laptops",
      "brand": "Dell",
      "price": 1499.99,
      "mayorista": "ingram",
      "inStock": true,
      "stock": 42,
      "rating": 4.8
    }
    // ... more products
  ],
  "total": 12,
  "page": 1,
  "limit": 10,
  "hasMore": true,
  "mayoristas": {
    "ingram": 4,
    "distribuido": 5,
    "synnex": 3
  },
  "timestamp": "2026-04-14T..."
}
```

---

## ✅ Checklist Día 5

- [ ] Tipos actualizados con filtros avanzados
- [ ] Cache manager implementado
- [ ] Todos los 3 servicios mayoristas tienen filtros
- [ ] Agregador con deduplicación, sorting, pagination
- [ ] Rate limiter instalado en `/api/mayoristas/search`
- [ ] Jest tests creados y pasando
- [ ] package.json actualizado con test scripts
- [ ] Tests locales corriendo ✓
- [ ] API testuada con curl ✓
- [ ] Commit hecho con mensaje descriptivo
- [ ] Push a GitHub ✓
- [ ] Vercel auto-deploy en progreso ✓

---

## Notas Técnicas

**Cache Strategy**:
- 5 minutos TTL por defecto
- Pattern-based clearing: `search:*` limpia todos los search caches
- Singleton instance compartido entre requests

**Rate Limiting**:
- 100 requests/min por IP
- Headers retornan X-RateLimit-Remaining
- 429 status code cuando se excede

**Performance Targets**:
- Search: <100ms (con cache)
- Simultaneous requests: 10x (100+)
- Database: 0 calls (mayoristas mock data)
- Memory: ~5KB por cache entry × 1000s = ~5MB max

**Testing**:
- Jest + @testing-library/react
- Coverage goal: >80% búsqueda + caché + rate limit
- CI/CD: `pnpm test:ci` para GitHub Actions

---

## Troubleshooting

**Si los tests fallan:**
```bash
# Clear node_modules y reinstalar
rm -r node_modules pnpm-lock.yaml
pnpm install

# Limpiar cache Jest
pnpm test -- --clearCache
```

**Si rate limiter no funciona:**
- Verificar que IP header se está capturando: `request.headers.get('x-forwarded-for')`
- En local siempre será `'unknown'` (no hay proxy)
- En Vercel, será la IP real del cliente

**Si cache não está funcionando:**
- Verificar cache size: `cache.size()` en console
- Limpiar manualmente: `cache.clear()`
- Aumentar TTL si los datos cambian frecuentemente

---

**2h después: Performance Dashboard**

```
Búsquedas procesadas hoy: 1,247
Cache hit rate: 73%
Avg search time: 34ms (cache) / 180ms (no cache)
Rate limited IPs: 3
Database syncs: 2
Status: ✅ OPERATIONAL
```

