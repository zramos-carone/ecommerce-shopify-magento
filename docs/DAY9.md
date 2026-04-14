# Día 9: Stripe Payment Integration

**Objetivo:** Integrar Stripe como gateway de pago principal, crear payment flow completo, y preparar webhooks para confirmaciones de orden.

**Timeline:** 1 día

## Ejecución - 11 Pasos

### 1. Instalar dependencias de Stripe

```bash
pnpm add stripe @stripe/stripe-js
```

**Qué incluye:**
- `stripe`: SDK servidor para crear payment intents, manejar webhooks
- `@stripe/stripe-js`: Librería cliente para formularios de pago embebidos

---

### 2. Configurar variables de entorno

Añadir a `.env.local` y `.env.production`:

```
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Donde obtener:**
1. Ir a https://dashboard.stripe.com/test/keys
2. Copiar "Publishable Key" → `STRIPE_PUBLIC_KEY`
3. Copiar "Secret Key" → `STRIPE_SECRET_KEY`

---

### 3. Crear Stripe Client

**Archivo:** `lib/stripe.ts`

```typescript
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})
```

---

### 4. Crear Payment Intent API

**Archivo:** `app/api/payments/create-intent/route.ts`

Endpoint **POST /api/payments/create-intent** que:
- Recibe orderId + amount
- Crea un Payment Intent en Stripe
- Retorna clientSecret para el front

```typescript
// POST Body:
// { orderId: string, amount: number, email: string }

// Response:
// { clientSecret: string, paymentIntentId: string }
```

---

### 5. Crear componente Stripe Form

**Archivo:** `app/components/StripePaymentForm.tsx`

Componente que muestra:
- `CardElement` (formulario de tarjeta embebido)
- Botón "Pagar ahora"
- Estados loading/error

```typescript
'use client'

import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'

export function StripePaymentForm({ clientSecret, onSuccess }) {
  const stripe = useStripe()
  const elements = useElements()
  
  const handleSubmit = async (e) => {
    // 1. Confirmar payment intent
    // 2. Si éxito, llamar onSuccess()
    // 3. Si error, mostrar mensaje
  }
  
  return (/* Formulario con CardElement */)
}
```

---

### 6. Actualizar página `/payment`

**Archivo:** `app/payment/page.tsx`

```typescript
'use client'

import { useEffect, useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { StripePaymentForm } from '@/components/StripePaymentForm'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function PaymentPage() {
  const [clientSecret, setClientSecret] = useState('')
  const [order, setOrder] = useState(null)

  useEffect(() => {
    // 1. Recuperar orderId de sessionStorage
    const currentOrder = JSON.parse(sessionStorage.getItem('currentOrder'))
    setOrder(currentOrder)
    
    // 2. Llamar a /api/payments/create-intent
    const createIntent = async () => {
      const res = await fetch('/api/payments/create-intent', {
        method: 'POST',
        body: JSON.stringify({
          orderId: currentOrder.id,
          amount: currentOrder.total,
          email: currentOrder.email,
        })
      })
      const data = await res.json()
      setClientSecret(data.clientSecret)
    }
    
    createIntent()
  }, [])

  const handlePaymentSuccess = async () => {
    // Marcar orden como pagada
    // Limpiar carrito
    // Redirigir a confirmación
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <div className="max-w-md mx-auto p-6">
        <h1>Confirmar Pago</h1>
        <p>Total: ${order?.total.toFixed(2)}</p>
        <StripePaymentForm clientSecret={clientSecret} onSuccess={handlePaymentSuccess} />
      </div>
    </Elements>
  )
}
```

---

### 7. Crear webhook para confirmación

**Archivo:** `app/api/payments/webhook/route.ts`

Endpoint **POST /api/payments/webhook** que recibe eventos de Stripe:

```typescript
// Eventos importantes:
// - payment_intent.succeeded -> Orden pagada, cambiar status a 'paid'
// - payment_intent.payment_failed -> Orden fallida, cambiar status a 'failed'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  
  // Verificar que el evento viene de Stripe
  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  )
  
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object
    
    // Actualizar orden en BD
    await prisma.order.update({
      where: { paymentId: paymentIntent.id },
      data: {
        status: 'paid',
        paymentStatus: 'completed'
      }
    })
    
    // Enviar email de confirmación (Día 10)
  }
  
  return NextResponse.json({ received: true })
}
```

---

### 8. Configurar webhook en Stripe Dashboard

1. Ir a https://dashboard.stripe.com/test/webhooks
2. Crear nuevo endpoint:
   - URL: `https://tu-vercel-url.com/api/payments/webhook`
   - Eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`
3. Copiar Signing Secret → `STRIPE_WEBHOOK_SECRET`

---

### 9. Actualizar modelo Order para paymentId

En `prisma/schema.prisma`, asegurar que `Order` tiene:

```prisma
model Order {
  // ... campos anteriores
  pay mentId    String?      // Stripe Payment Intent ID
  paymentStatus String  @default("pending") // pending, completed, failed
  paymentMethod String? @default("stripe")  // stripe, paypal
  // ... resto de campos
}
```

---

### 10. Crear página de confirmación

**Archivo:** `app/order-confirmation/page.tsx`

Muestra después de pago exitoso:
- Número de orden
- Total pagado
- Email de confirmación
- Link para ver orden

```typescript
export default function OrderConfirmationPage() {
  const [order, setOrder] = useState(null)
  
  useEffect(() => {
    const orderId = new URLSearchParams(window.location.search).get('orderId')
    // Fetch orden desde BD
    fetch(`/api/orders/${orderId}`).then(r => r.json()).then(setOrder)
  }, [])
  
  return (
    <div className="text-center">
      <h1>✓ Pago Confirmado</h1>
      <p>Orden: {order?.orderNumber}</p>
      <p>Total: ${order?.total.toFixed(2)}</p>
      <p>Confirmación enviada a {order?.email}</p>
    </div>
  )
}
```

---

### 11. Validar e integrar

```bash
pnpm type-check
pnpm build
```

Expected:
- ✅ Nueva ruta `/order-confirmation`
- ✅ Nueva ruta `/api/payments/create-intent`
- ✅ Nueva ruta `/api/payments/webhook`
- ✅ Stripe JavaScript bundle incluido
- ✅ 17+ rutas totales

---

## Flujo Completo de Pago

```
/checkout → Completar dirección → /payment
   ↓
/api/payments/create-intent → Crear Payment Intent
   ↓
Formulario Stripe (CardElement) → Ingresar datos tarjeta
   ↓
Stripe procesa pago (backend)
   ↓
Webhook recibe confirmación
   ↓
Actualizar orden status='paid' en BD
   ↓
Redirigir a /order-confirmation
```

---

## Testing con Tarjetas de Prueba

Stripe proporciona tarjetas de prueba en modo test:

| Número | Resultado | CVV | Fecha |
|--------|-----------|-----|-------|
| 4242 4242 4242 4242 | Éxito | 123 | 12/25 |
| 4000 0000 0000 0002 | Rechazado | 123 | 12/25 |
| 4000 0000 0000 9995 | 3D Secure | 123 | 12/25 |

---

## Commit

```bash
git add -A
git commit -m "feat(day9): integrate Stripe payment processing

- Install @stripe/stripe-js and stripe SDK
- Create /api/payments/create-intent endpoint
- Create /api/payments/webhook for payment confirmation
- Add StripePaymentForm component with CardElement
- Update /payment page with Stripe Elements
- Add /order-confirmation page for success state
- Update Order model with paymentId and paymentStatus
- Add webhook signature verification
- All routes compile, type-safe"

git push origin main
```

---

## Métricas

- **Nuevas rutas:** 4 (/payment, /order-confirmation, /api/payments/create-intent, /api/payments/webhook)
- **Nuevos componentes:** 1 (StripePaymentForm)
- **Dependencias:** +2 (stripe, @stripe/stripe-js)
- **Líneas de código:** ~600
- **TypeScript errors:** 0 esperados
