# Día 7: Carrito de Compras con localStorage

**Objetivo:** Implementar shopping cart con persistencia en localStorage, componentes React reutilizables y integración con el catálogo.

**Status:** ✅ COMPLETADO

## Ejecución - 10 Pasos

### 1. Crear carpetas de decisiones de estructura
```bash
mkdir -p app/hooks
mkdir -p app/cart  
mkdir -p app/api/cart
```
**Resultado:** Directorios creados para hooks, página del carrito y API de carrito.

---

### 2. Crear hook personalizado `useCart.ts`

**Archivo:** `app/hooks/useCart.ts` (98 líneas)

```typescript
'use client'

import { useState, useEffect } from 'react'
import type { MayoristaProduct } from '@/lib/types/mayorista'

export interface CartItem {
  product: MayoristaProduct
  quantity: number
}

const CART_STORAGE_KEY = 'ecommerce-cart'

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        setItems(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Failed to load cart:', error)
    }
    setIsLoaded(true)
  }, [])

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
      } catch (error) {
        console.error('Failed to save cart:', error)
      }
    }
  }, [items, isLoaded])

  const addToCart = (product: MayoristaProduct, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id)

      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...prevItems, { product, quantity }]
    })
  }

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0)
  }

  return {
    items,
    isLoaded,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getItemCount,
  }
}
```

**Características:**
- ✅ localStorage persist automaticamente
- ✅ useState + useEffect para sincronización
- ✅ Métodos: addToCart, removeFromCart, updateQuantity, clearCart
- ✅ Cálculos: getTotalPrice, getItemCount
- ✅ TypeScript tipado con CartItem interface
- ✅ Manejo de errores try-catch

---

### 3. Crear componente `CartItem.tsx`

**Archivo:** `app/components/CartItem.tsx` (93 líneas)

Muestra individual item en el carrito con:
- ✅ Imagen del producto (placeholder si no existe)
- ✅ Nombre, marca, precio unitario
- ✅ Controles de cantidad (- / cantidad / +)
- ✅ Subtotal calculado
- ✅ Botón eliminar con ícono Trash2 de lucide-react

```typescript
const { product, quantity } = item
const subtotal = product.price * quantity
```

---

### 4. Crear componente `CartSummary.tsx`

**Archivo:** `app/components/CartSummary.tsx` (83 líneas)

Muestra resumen del carrito:
- ✅ Recuento de artículos
- ✅ Subtotal
- ✅ IVA (16% México)
- ✅ Total final
- ✅ Botón "Proceder al pago"
- ✅ Link "Continuar comprando"
- ✅ Estado vacío con link al catálogo

```typescript
const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0)
const tax = subtotal * 0.16 // IVA 16%
const total = subtotal + tax
```

---

### 5. Crear API endpoint `/api/cart`

**Archivo:** `app/api/cart/route.ts` (125 líneas)

Endpoints para operaciones de carrito:

**GET /api/cart**
- Recibe cart items en query string (JSON)
- Retorna: items, total, itemCount, tax, grandTotal

**POST /api/cart**
- Body: { items, email, phone }
- Retorna: cartId, subtotal, tax, total (para checkout)
- Validaciones: carrito no vacío, email y phone requeridos

Ejemplo response:
```json
{
  "success": true,
  "cartId": "cart_1713055234",
  "itemCount": 3,
  "subtotal": 5000.00,
  "tax": 800.00,
  "total": 5800.00
}
```

---

### 6. Crear página `/cart/page.tsx`

**Archivo:** `app/cart/page.tsx` (149 líneas)

Página principal del carrito:
- ✅ Header con recuento de artículos
- ✅ Grid 2 columnas: items + sidebar
- ✅ Lista de CartItems con botones remove/cantidad
- ✅ CartSummary sticky en sidebar
- ✅ Botón "Vaciar carrito"
- ✅ Links de navegación (volver al catálogo)
- ✅ Estado loading durante carga inicial
- ✅ Estado vacío con CTA al catálogo

```typescript
const handleCheckout = async () => {
  if (items.length === 0) return

  // Store cart total in sessionStorage for checkout page
  sessionStorage.setItem('checkout-total', JSON.stringify({
    items: items.length,
    subtotal: getTotalPrice(),
    tax: getTotalPrice() * 0.16,
    total: getTotalPrice() * 1.16,
  }))

  window.location.href = '/checkout'
}
```

---

### 7. Actualizar `ProductGrid.tsx`

**Cambios:**
- Agregado prop `onAddToCart?: (product: MayoristaProduct) => void`
- Pasado callback a ProductCard dentro del map

```typescript
<ProductCard
  key={product.id}
  product={product}
  onAddToCart={onAddToCart}
/>
```

---

### 8. Actualizar `app/catalog/page.tsx`

**Cambios:**
- Importado `useCart` hook
- Desestructurado `addToCart` del hook
- Pasado a ProductGrid:

```typescript
const { addToCart } = useCart()
// ...
<ProductGrid products={products} isLoading={isLoading} onAddToCart={addToCart} />
```

---

### 9. Instalar dependencias faltantes

```bash
pnpm add lucide-react
```

**Razón:** CartItem usa ícono Trash2 de lucide-react.

---

### 10. Validar compilación

```bash
pnpm type-check  # ✅ PASS - Zero errors
pnpm build       # ✅ PASS - All 10 routes compiled
```

**Output del build:**
```
Route (app)                              Size     First Load JS
├ ○ /cart                                11.7 kB         105 kB
├ ƒ /api/cart                            0 B                0 B
├ ○ /catalog                             3.24 kB        96.1 kB
└ ... (otras rutas)

Total routes: 10
Build status: SUCCESS
```

---

## Características Implementadas

| Feature | Status | Details |
|---------|--------|---------|
| **Custom Hook** | ✅ | `useCart` con localStorage sync |
| **Add to Cart** | ✅ | Botón en ProductCard + hook integration |
| **Cart Display** | ✅ | /cart page muestra todos los items |
| **Quantity Control** | ✅ | + / - buttons en CartItem |
| **Remove Item** | ✅ | Trash icon en CartItem |
| **Persistent Storage** | ✅ | localStorage con key 'ecommerce-cart' |
| **Price Calculation** | ✅ | Subtotal + IVA 16% = Total |
| **Clear Cart** | ✅ | Botón en página del carrito |
| **API Endpoint** | ✅ | GET/POST /api/cart para checkout |
| **Responsive Design** | ✅ | 1 col mobile, 2 col desktop |

---

## Testing Manual

### Paso 1: Agregar producto al carrito
1. Ir a `/catalog`
2. Click "Agregar al Carrito" en cualquier producto
3. **Expected:** Carrito se actualiza (localStorage persiste)

### Paso 2: Verificar localStorage
```javascript
// En DevTools Console:
JSON.parse(localStorage.getItem('ecommerce-cart'))
```

### Paso 3: Ir a página del carrito
1. Click en icono del carrito o ir a `/cart`
2. **Expected:** Item aparece con imagen, nombre, precio
3. Cambiar cantidad con botones +/-
4. **Expected:** Subtotal y Total se recalculan

### Paso 4: Persistencia
1. Agregar producto
2. Recargar página (F5)
3. **Expected:** Carrito conserva items

### Paso 5: Vaciar carrito
1. Click "Vaciar carrito"
2. **Expected:** localStorage se limpia, página muestra "carrito vacío"

---

## Commits Pendientes

```bash
git add -A
git commit -m "feat(day7): add shopping cart with localStorage persistence

- Create useCart custom hook for cart state management
- Add CartItem component with quantity controls
- Add CartSummary component with price calculations
- Create /cart page for cart display
- Create /api/cart endpoint for checkout prep
- Integrate ProductCard with addToCart functionality
- Install lucide-react for icons
- All type checks passing, build succeeds"

git push origin main
```

---

## Métricas

- **Líneas de código nuevas:** ~500
- **Componentes nuevos:** 3 (CartItem, CartSummary, useCart hook)
- **Rutas nuevas:** 2 (/cart, /api/cart)
- **Dependencias agregadas:** 1 (lucide-react)
- **TypeScript errors:** 0
- **Build warnings:** 0

---

## Próximos pasos (Día 8)

- [ ] Crear página `/checkout` para formulario de dirección
- [ ] Integrar Stripe payment gateway
- [ ] Crear Order model en Prisma
- [ ] Validar inventario antes de checkout
- [ ] Enviar confirmación por email

---

## Links Útiles

- Carrito: http://localhost:3001/cart
- Catálogo: http://localhost:3001/catalog
- localStorage key: `ecommerce-cart`
- Build status: ✅ 10 routes, 0 errors
