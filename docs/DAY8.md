# Día 8: Checkout Flow & Inventory Management

**Objetivo:** Implementar página de checkout con formulario de dirección, mejorar validación de inventario, y preparar API para pagos en Días 9-10.

**Timeline:** 1 día

## Ejecución - 12 Pasos

### 1. Mejorar schema Prisma para Order y Inventory

Actualizar `prisma/schema.prisma` con modelos mejorados:

```prisma
model Product {
  id       String   @id @default(cuid())
  name     String
  description String?
  price    Float
  stock    Int      @default(0)      // NUEVO: track stock
  category String?
  brand    String?
  rating   Float    @default(4.0)
  inStock  Boolean  @default(true)
  mayorista String
  imageUrl String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  cartItems CartItem[]
  orderItems OrderItem[]
}

model Order {
  id        String   @id @default(cuid())
  userId    String?  @db.String
  email     String
  phone     String
  status    String   @default("pending") // pending, processing, shipped, delivered, cancelled
  
  // Shipping details
  firstName String
  lastName  String
  address   String
  city      String
  postalCode String
  country   String  @default("Mexico")
  
  // Order summary
  subtotal  Float
  tax       Float
  total     Float
  
  // Payment
  paymentMethod String? // stripe, paypal, pending
  paymentId String?     // Stripe paymentIntentId or PayPal transactionId
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  items OrderItem[]
}

model OrderItem {
  id       String @id @default(cuid())
  orderId  String
  productId String
  quantity Int
  price    Float  // price at time of purchase
  
  order    Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product  Product @relation(fields: [productId], references: [id])
  
  @@unique([orderId, productId])
}
```

### 2. Ejecutar migraciones Prisma

```bash
npx prisma migrate dev --name add_order_inventory
npx prisma generate
```

Status: Actualizar schema con Order + OrderItem relaciones

---

### 3. Crear API `/api/inventory/check`

**File:** `app/api/inventory/check/route.ts`

Valida disponibilidad de productos antes de checkout:

```typescript
// POST /api/inventory/check
// Body: { items: [{ productId, quantity }, ...] }
// Response: { available: bool, unavailable: [] }

export async function POST(req: Request) {
  const { items } = await req.json()
  
  const unavailable = []
  
  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId }
    })
    
    if (!product || product.stock < item.quantity) {
      unavailable.push({
        productId: item.productId,
        requested: item.quantity,
        available: product?.stock || 0
      })
    }
  }
  
  return NextResponse.json({
    available: unavailable.length === 0,
    unavailable
  })
}
```

---

### 4. Crear componentes de checkout

**A. CheckoutForm.tsx** - Formulario de dirección

```typescript
'use client'

interface CheckoutFormProps {
  onSubmit: (formData: CheckoutData) => Promise<void>
  isLoading?: boolean
}

export function CheckoutForm({ onSubmit, isLoading }: CheckoutFormProps) {
  const [formData, setFormData] = useState<CheckoutData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Mexico'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Email */}
      <input type="email" placeholder="Email" required />
      
      {/* Name */}
      <input type="text" placeholder="Nombre" required />
      <input type="text" placeholder="Apellido" required />
      
      {/* Phone */}
      <input type="tel" placeholder="Teléfono" required />
      
      {/* Address */}
      <input type="text" placeholder="Dirección" required />
      <textarea placeholder="Instrucciones especiales (opcional)" />
      
      {/* City & Postal */}
      <input type="text" placeholder="Ciudad" required />
      <input type="text" placeholder="Código Postal" required />
      
      {/* Country selector */}
      <select defaultValue="Mexico">
        <option value="Mexico">México</option>
        <option value="USA">USA</option>
        <option value="Canada">Canadá</option>
      </select>
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Procesando...' : 'Continuar al pago'}
      </button>
    </form>
  )
}
```

---

### 5. Crear página `/checkout/page.tsx`

**File:** `app/checkout/page.tsx` (200 líneas)

Página que muestra:
- Resumen del carrito (desde useCart hook)
- Validación de inventario
- Formulario de dirección (CheckoutForm)
- Botón "Ir a pago" que redirige a `/payment`

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import { CheckoutForm } from '@/components/CheckoutForm'
import { OrderSummary } from '@/components/OrderSummary'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice } = useCart()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  if (items.length === 0) {
    return <div>Carrito vacío. <Link href="/catalog">Volver al catálogo</Link></div>
  }

  const handleCheckout = async (formData: CheckoutData) => {
    setIsLoading(true)
    setError('')

    try {
      // 1. Valida inventario
      const invRes = await fetch('/api/inventory/check', {
        method: 'POST',
        body: JSON.stringify({
          items: items.map(i => ({
            productId: i.product.id,
            quantity: i.quantity
          }))
        })
      })
      
      const invData = await invRes.json()
      
      if (!invData.available) {
        setError('Algunos productos no están disponibles')
        return
      }

      // 2. Crea orden en base de datos
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: items.map(i => ({
            productId: i.product.id,
            quantity: i.quantity,
            price: i.product.price
          })),
          email: formData.email,
          phone: formData.phone,
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        })
      })

      const orderData = await orderRes.json()

      // 3. Redirige a página de pago
      sessionStorage.setItem('orderId', orderData.id)
      router.push('/payment')

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en checkout')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {error && <ErrorAlert message={error} />}
            <CheckoutForm onSubmit={handleCheckout} isLoading={isLoading} />
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <OrderSummary items={items} />
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

### 6. Crear `/api/orders` endpoint

**File:** `app/api/orders/route.ts` (150 líneas)

```typescript
// POST /api/orders
// Crea nuevo Order + OrderItems en DB
// Body: { items, email, phone, firstName, lastName, address, city, postalCode, country }
// Response: { id, subtotal, tax, total, paymentId (null for now) }

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, email, phone, firstName, lastName, address, city, postalCode, country } = body

    // Calcular totales
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      })

      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Producto ${product?.name} no disponible` },
          { status: 400 }
        )
      }

      subtotal += item.price * item.quantity

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      })
    }

    const tax = subtotal * 0.16
    const total = subtotal + tax

    // Crear orden
    const order = await prisma.order.create({
      data: {
        email,
        phone,
        firstName,
        lastName,
        address,
        city,
        postalCode,
        country,
        subtotal,
        tax,
        total,
        status: 'pending',
        items: {
          create: orderItems
        }
      },
      include: {
        items: true
      }
    })

    return NextResponse.json({
      id: order.id,
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      status: order.status
    })

  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
```

---

### 7. Crear componente OrderSummary

**File:** `app/components/OrderSummary.tsx`

Similar a CartSummary pero muestra orden confirming detalles finales:

```typescript
'use client'

import type { CartItem } from '@/hooks/useCart'

interface OrderSummaryProps {
  items: CartItem[]
}

export function OrderSummary({ items }: OrderSummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const tax = subtotal * 0.16
  const total = subtotal + tax

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold mb-4">Resumen de Orden</h2>

      <div className="space-y-4 mb-6">
        {items.map(item => (
          <div key={item.product.id} className="flex justify-between text-sm">
            <span>{item.product.name} x{item.quantity}</span>
            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>IVA (16%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-blue-600">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
```

---

### 8. Actualizar ProductCard para respetar stock

```typescript
{product.inStock && product.stock > 0 ? (
  <button onClick={() => onAddToCart?.(product)}>
    Agregar al Carrito
  </button>
) : (
  <button disabled className="bg-gray-300">
    Sin Stock
  </button>
)}
```

---

### 9. Crear página `/payment` placeholder

**File:** `app/payment/page.tsx`

Página placeholder que dirá "Sistema de pagos en construcción" (Días 9-10 integración real)

```typescript
export default function PaymentPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Sistema de Pagos</h1>
        <p className="text-gray-600 mb-6">Integración Stripe/PayPal en preparación</p>
        <p className="text-sm text-gray-500">(Disponible en Día 9)</p>
      </div>
    </div>
  )
}
```

---

### 10. Actualizar Cart para link a checkout

En `/cart/page.tsx`:

```typescript
<button
  onClick={() => router.push('/checkout')}
  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
>
  Proceder a Checkout
</button>
```

---

### 11. Validar compilación

```bash
pnpm type-check
pnpm build
```

Expected routes:
- `/checkout` - nuevo
- `/payment` - nuevo
- `/api/orders` - nuevo
- `/api/inventory/check` - nuevo
- Total: 14 rutas

---

### 12. Commit & Push

```bash
git add -A
git commit -m "feat(day8): add checkout flow and inventory management

- Add Order and OrderItem models to Prisma
- Create /checkout page with address form
- Create /api/orders endpoint for order creation
- Add /api/inventory/check for stock validation
- Create CheckoutForm and OrderSummary components
- Add /payment placeholder page (ready for Days 9-10)
- Update ProductCard to respect stock
- Update Cart page with checkout link
- All routes compile, type-safe"

git push origin main
```

---

## Métricas

- **Nuevos componentes:** 2 (CheckoutForm, OrderSummary)
- **Nuevas rutas:** 4 (/checkout, /payment, /api/orders, /api/inventory/check)
- **Modelos Prisma:** +2 (Order, OrderItem)
- **Líneas de código:** ~600
- **TypeScript errors:** 0 esperados
