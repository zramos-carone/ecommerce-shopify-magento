# Día 6: Frontend Catálogo - Product Listing 🛍️

**Timeline**: ~6-8 horas  
**Deliverables**: Product listing page, grid responsive, basic filters, React components  
**Acceptance Criteria**: 15 productos visibles, búsqueda funcional, filtro por categoría, responsive en mobile  

---

## Visión General

Hoy pasamos del backend puro al frontend visible. Construimos:

1. **Product Listing Page** (`/catalog`): Grid responsive de productos
2. **Product Card Component**: Tarjeta individual con imagen, precio, rating
3. **Filter Sidebar**: Filtros por categoría, rango de precio, stock
4. **Search Integration**: Conectar con `/api/mayoristas/search`
5. **Responsive Design**: Mobile-first con Tailwind CSS
6. **Performance**: Lazy loading de imágenes, skeleton loading

---

## Paso 1: Crear Componentes de Producto (15min)

### 1a. ProductCard Component

**File**: `app/components/ProductCard.tsx`

```typescript
import Image from 'next/image'
import { MayoristaProduct } from '@/lib/types/mayorista'

interface ProductCardProps {
  product: MayoristaProduct
  onAddToCart?: (product: MayoristaProduct) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow duration-200">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.imageUrl || 'https://via.placeholder.com/300?text=' + encodeURIComponent(product.name)}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Stock Badge */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-semibold">Sin Stock</span>
          </div>
        )}

        {/* Sale Badge */}
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
          {product.mayorista.toUpperCase().charAt(0)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Brand */}
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {product.brand || 'Generic'}
        </p>

        {/* Product Name */}
        <h3 className="mt-2 text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="mt-2 flex items-center gap-1">
            <div className="flex text-yellow-400">
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span className="text-xs text-gray-600">({product.rating.toFixed(1)})</span>
          </div>
        )}

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-xs text-gray-500">{product.mayorista}</span>
        </div>

        {/* Stock Info */}
        <p className="mt-2 text-xs text-gray-600">
          {product.stock > 0 ? `${product.stock} en stock` : 'Sin stock'}
        </p>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart?.(product)}
          disabled={!product.inStock}
          className={`mt-4 w-full py-2 px-3 rounded-md font-medium text-sm transition-colors ${
            product.inStock
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {product.inStock ? 'Agregar al Carrito' : 'Sin Stock'}
        </button>
      </div>
    </div>
  )
}
```

### 1b. FilterSidebar Component

**File**: `app/components/FilterSidebar.tsx`

```typescript
'use client'

import { useState } from 'react'
import { SearchQuery } from '@/lib/types/mayorista'

interface FilterSidebarProps {
  onFilterChange: (filters: Partial<SearchQuery>) => void
  isLoading?: boolean
}

const CATEGORIES = ['Laptop', 'GPU', 'Storage', 'CPU', 'RAM', 'Power Supply', 'Peripherals', 'Display', 'Audio', 'Accessories']
const BRANDS = ['Dell', 'Lenovo', 'Apple', 'HP', 'ASUS', 'Intel', 'NVIDIA', 'Samsung', 'Corsair', 'Kingston']

export function FilterSidebar({ onFilterChange, isLoading = false }: FilterSidebarProps) {
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(3000)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)

  const handlePriceChange = (min: number, max: number) => {
    setMinPrice(min)
    setMaxPrice(max)
    onFilterChange({ minPrice: min, maxPrice: max })
  }

  const handleCategoryChange = (category: string) => {
    const newCategory = selectedCategory === category ? null : category
    setSelectedCategory(newCategory)
    onFilterChange({ category: newCategory || undefined })
  }

  const handleBrandChange = (brand: string) => {
    const newBrand = selectedBrand === brand ? null : brand
    setSelectedBrand(newBrand)
    onFilterChange({ brand: newBrand || undefined })
  }

  return (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rango de Precio</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">Mínimo: ${minPrice}</label>
            <input
              type="range"
              min="0"
              max="3000"
              step="100"
              value={minPrice}
              onChange={(e) => handlePriceChange(Number(e.target.value), maxPrice)}
              disabled={isLoading}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Máximo: ${maxPrice}</label>
            <input
              type="range"
              min="0"
              max="3000"
              step="100"
              value={maxPrice}
              onChange={(e) => handlePriceChange(minPrice, Number(e.target.value))}
              disabled={isLoading}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categoría</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {CATEGORIES.map((category) => (
            <label key={category} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategory === category}
                onChange={() => handleCategoryChange(category)}
                disabled={isLoading}
                className="rounded"
              />
              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Marca</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {BRANDS.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBrand === brand}
                onChange={() => handleBrandChange(brand)}
                disabled={isLoading}
                className="rounded"
              />
              <span className="text-sm text-gray-700">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Stock Filter */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            onChange={(e) => onFilterChange({ minStock: e.target.checked ? 1 : undefined })}
            disabled={isLoading}
            className="rounded"
          />
          <span className="text-sm text-gray-700">En stock</span>
        </label>
      </div>
    </div>
  )
}
```

### 1c. ProductGrid Component

**File**: `app/components/ProductGrid.tsx`

```typescript
'use client'

import { MayoristaProduct } from '@/lib/types/mayorista'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: MayoristaProduct[]
  isLoading?: boolean
}

export function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 aspect-square rounded-lg" />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">No hay productos</h3>
          <p className="text-gray-600 mt-2">Intenta cambiar los filtros</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={(p) => console.log('Add to cart:', p.name)}
        />
      ))}
    </div>
  )
}
```

---

## Paso 2: Crear Página de Catálogo (15min)

**File**: `app/catalog/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { MayoristaProduct, SearchResult } from '@/lib/types/mayorista'
import { FilterSidebar } from '@/components/FilterSidebar'
import { ProductGrid } from '@/components/ProductGrid'
import { SearchBar } from '@/components/SearchBar'

export default function CatalogPage() {
  const [products, setProducts] = useState<MayoristaProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Fetch products when search or filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams({
          ...(searchQuery && { q: searchQuery }),
          ...filters,
          page: String(page),
          limit: '12',
        })

        const response = await fetch(`/api/mayoristas/search?${params}`)
        const data: SearchResult = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Search failed')
        }

        setProducts(data.products)
        setTotalPages(Math.ceil(data.total / 12))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    // Debounce search to avoid too many requests
    const timer = setTimeout(fetchProducts, 500)
    return () => clearTimeout(timer)
  }, [searchQuery, filters, page])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPage(1)
  }

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Catálogo de Productos</h1>
              <p className="text-gray-600 mt-1">Explora nuestros productos de mayoristas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white p-6 rounded-lg border border-gray-200">
              <FilterSidebar onFilterChange={handleFilterChange} isLoading={isLoading} />
            </div>
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <ProductGrid products={products} isLoading={isLoading} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1 || isLoading}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Anterior
                </button>
                <div className="flex gap-1">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = i + 1
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-2 rounded-lg ${
                          page === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages || isLoading}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## Paso 3: Crear SearchBar Component (10min)

**File**: `app/components/SearchBar.tsx`

```typescript
'use client'

import { useState } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
  isLoading?: boolean
}

export function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1 relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar productos..."
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
      >
        {isLoading ? 'Buscando...' : 'Buscar'}
      </button>
    </form>
  )
}
```

---

## Paso 4: Actualizar Navegación (10min)

**File**: `app/layout.tsx` (update navigation)

```typescript
// En la sección de navigation, agregar link a /catalog:

<nav className="flex gap-4">
  <a href="/" className="hover:text-blue-600">
    Inicio
  </a>
  <a href="/catalog" className="hover:text-blue-600">
    Catálogo
  </a>
  <a href="/api-docs" className="hover:text-blue-600">
    API Docs
  </a>
</nav>
```

---

## Paso 5: Crear Página de Detalle de Producto (10min)

**File**: `app/catalog/[id]/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { MayoristaProduct } from '@/lib/types/mayorista'
import Image from 'next/image'
import { useParams } from 'next/navigation'

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const [product, setProduct] = useState<MayoristaProduct | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // En producción, obtener del API
    // Por ahora, buscamos en la lista
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/mayoristas/search?page=1&limit=100`)
        const data = await response.json()
        const found = data.products.find((p: MayoristaProduct) => p.id === productId)
        setProduct(found || null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Producto no encontrado</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="bg-white rounded-lg p-6">
            <div className="relative aspect-square overflow-hidden rounded">
              <Image
                src={product.imageUrl || 'https://via.placeholder.com/600?text=' + encodeURIComponent(product.name)}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-blue-600">{product.category}</p>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
              <p className="text-gray-600 mt-2">{product.description}</p>
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {'★'.repeat(Math.floor(product.rating))}
                  {'☆'.repeat(5 - Math.floor(product.rating))}
                </div>
                <span className="text-gray-600">({product.rating.toFixed(1)})</span>
              </div>
            )}

            {/* Price */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Precio</p>
              <p className="text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-2">De: {product.mayorista}</p>
            </div>

            {/* Stock */}
            <div>
              <p className="text-gray-600 text-sm">Disponibilidad</p>
              <p className={`text-lg font-semibold ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {product.inStock ? `${product.stock} en stock` : 'Sin stock'}
              </p>
            </div>

            {/* Add to Cart */}
            <button
              disabled={!product.inStock}
              className={`w-full py-3 rounded-lg font-semibold text-lg transition-colors ${
                product.inStock
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {product.inStock ? 'Agregar al Carrito' : 'Sin Stock'}
            </button>

            {/* Specs */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información</h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-600">SKU</dt>
                  <dd className="font-mono text-gray-900">{product.sku}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Marca</dt>
                  <dd className="text-gray-900">{product.brand || 'N/A'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Mayorista</dt>
                  <dd className="uppercase text-gray-900">{product.mayorista}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## Paso 6: Ajustar Tipos si es necesario (5min)

Validar que `MayoristaProduct` tenga `imageUrl` opcional (ya está hecho en Día 5).

---

## Paso 7: Ejecutar Tests y Build (10min)

```bash
# Type check
pnpm type-check

# Full build
pnpm build
```

**Expected Output:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (0/7)
...
✓ Generating static pages (7/7)

Route (app)                              Size     First Load JS
├ ○ /                                    139 B          87.7 kB
├ ○ /_not-found                          873 B          88.4 kB
├ ○ /api-docs                            353 kB          441 kB
├ ○ /catalog                             45 kB           132 kB   ← NEW
├ ○ /catalog/[id]                        32 kB           120 kB   ← NEW
├ ƒ /api/mayoristas/search               0 B                0 B
├ ƒ /api/mayoristas/sync                 0 B                0 B
└ ○ /api/swagger                         0 B                0 B
```

---

## Paso 8: Commit & Push (5min)

```bash
git add -A
git commit -m "feat(day6): add product listing catalog with React components

Frontend Components:
- ProductCard: Tarjeta individual con imagen, precio, rating, stock
- ProductGrid: Grid responsive (1-4 cols) con skeleton loading
- FilterSidebar: Filtros por precio, categoría, marca, stock
- SearchBar: Búsqueda en tiempo real con debounce
- ProductDetailPage: Detalle individual del producto

Pages:
- /catalog: Listado completo con filtros + paginación
- /catalog/[id]: Detalle de producto individual

Features:
- Responsive design: mobile-first con Tailwind CSS
- Lazy loading: Next.js Image optimization
- Skeleton loading: UX durante carga de datos
- Pagination: 12 productos por página
- Error handling: Mensajes claros si hay problemas
- Real-time search: Debounce para evitar exceso de requests

Styling:
- Card hover effects
- Smooth transitions
- Star rating display
- Stock/availability badges
- Price highlights
- Category organization

Accessibility:
- Semantic HTML
- Form labels
- Button states (disabled)
- Image alt text
- Focus management

Files Created:
- app/components/ProductCard.tsx
- app/components/ProductGrid.tsx
- app/components/FilterSidebar.tsx
- app/components/SearchBar.tsx
- app/catalog/page.tsx
- app/catalog/[id]/page.tsx

Build Status:
- TypeScript: ✓ zero errors
- Next.js: ✓ 7 routes, all optimized
- Bundle: ✓ 45kB (catalog page)
- Images: ✓ optimized with Next.js Image"

git push origin main
```

---

## Paso 9: Validar en Vercel (5min)

Una vez desplegado en Vercel:
1. Abrir: `https://ecommerce-mvp-[hash].vercel.app/catalog`
2. Buscar "laptop" → debe retornar 4 productos
3. Filtrar por rango de precio $500-$2000 → debe reducirse a 4
4. Click en un producto → detalle correctamente
5. Responsive en mobile: probar pantalla 375px ancho

---

## Paso 10: Performance Check (5min)

```bash
# Local
pnpm dev

# Pruebas
curl http://localhost:3001/catalog
# Debe cargar en <2s

# Lighthouse check (Manual en DevTools)
# Target: >85 score
```

---

## ✅ Checklist Día 6

- [ ] ProductCard component creado
- [ ] ProductGrid component creado
- [ ] FilterSidebar component creado
- [ ] SearchBar component creado
- [ ] /catalog page creado
- [ ] /catalog/[id] page creado
- [ ] Layout navigation actualizado
- [ ] pnpm type-check pasando ✓
- [ ] pnpm build pasando ✓
- [ ] Commit hecho con mensaje descriptivo
- [ ] Push a GitHub ✓
- [ ] Vercel auto-deploy en progreso ✓

---

## Notas Técnicas

**Componentización React:**
- Client components para interactividad (`'use client'`)
- Props typing con TypeScript
- Custom hooks si es necesario

**State Management:**
- useState para filtros locales
- useEffect para fetch data
- Debounce para búsqueda

**Performance:**
- Next.js Image para optimización
- Skeleton loading durante fetch
- Lazy load images

**Responsive Design:**
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns
- XL: 4+ columns

**Accessibility:**
- Semantic HTML5
- ARIA labels si es necesario
- Keyboard navigation funcional
- Color contrast OK

---

## Troubleshooting

**Si los productos no cargan:**
```bash
# Verificar que la API está disponible
curl http://localhost:3001/api/mayoristas/search?page=1&limit=12

# Verificar logs en Vercel deployment
```

**Si componentes no renderean:**
```bash
# Limpiar cache
rm -rf .next
pnpm build
```

**Si hay error de tipos:**
```bash
pnpm type-check
# Ver errores específicos
```

---

**Después del deploy: Catálogo visible en Vercel con 15 productos listados** 🎉

