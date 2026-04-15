# Día 11: Stripe Webhook + Email Notifications

**Objetivo:** Implementar webhook endpoint para Stripe que maneje eventos de pagos y dispare notificaciones por email.

**Tarea Crítica #1 - Webhook Stripe**

**Timeline:** ~4-6 horas  
**Deliverables:** `/api/payments/webhook` funcional, manejo de eventos Stripe, notificaciones email

---

## 📋 Checklist del Día 11

- [ ] Crear endpoint `/api/payments/webhook` (POST)
- [ ] Configurar Stripe webhook signing secret en .env
- [ ] Implementar verificación de firma de Stripe
- [ ] Manejar evento `payment_intent.succeeded`
- [ ] Manejar evento `payment_intent.payment_failed`
- [ ] Actualizar Order status en BD (succeeded → completed, failed → failed)
- [ ] Implementar email notification para órdenes completadas
- [ ] Implementar logging de eventos webhook
- [ ] Type-check y build
- [ ] Jest tests para webhook verification
- [ ] Test con Stripe CLI en local
- [ ] Commit y push

---

## 🚀 Paso a Paso

### 1️⃣ Crear endpoint `/api/payments/webhook`

**Archivo:** `app/api/payments/webhook/route.ts`

Endpoint **POST** que:
- Recibe eventos de Stripe vía webhook
- Verifica firma del webhook (usando STRIPE_WEBHOOK_SECRET)
- Procesa eventos específicos:
  - `payment_intent.succeeded`: Marcar orden como completada
  - `payment_intent.payment_failed`: Marcar orden como fallida
- Actualiza BD (Order status)
- Dispara notificaciones por email
- Retorna 200 para confirmar recepción a Stripe

**Request (from Stripe):**
```json
{
  "id": "evt_1234567890",
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_1234567890",
      "client_secret": "pi_..._secret_...",
      "metadata": {
        "orderId": "uuid-del-order"
      }
    }
  }
}
```

**Response:**
```json
{
  "received": true,
  "eventId": "evt_1234567890",
  "processed": true,
  "orderId": "uuid-del-order"
}
```

### 2️⃣ Configurar Environment Variables

**Archivo:** `.env.local`

Agregar si no existe:
```
STRIPE_WEBHOOK_SECRET=whsec_live_... (para production)
STRIPE_WEBHOOK_SECRET=whsec_test_... (para development)
```

Obtener de: https://dashboard.stripe.com/webhooks

### 3️⃣ Implementar Verificación de Firma

```typescript
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('❌ Webhook signature verification failed:', error);
    return new Response('Webhook signature verification failed', { status: 400 });
  }
  
  // Process event...
  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
```

### 4️⃣ Implementar Handlers de Eventos

#### Payment Intent Succeeded
```typescript
if (event.type === 'payment_intent.succeeded') {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  const orderId = paymentIntent.metadata.orderId;
  
  // Actualizar Order en BD
  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: 'completed',
      paymentStatus: 'succeeded',
      paidAt: new Date(),
    },
    include: { user: true, items: true },
  });
  
  // Enviar email de confirmación
  await sendOrderConfirmationEmail(order);
  
  console.log(`✅ Order ${orderId} marked as completed`);
}
```

#### Payment Intent Failed
```typescript
if (event.type === 'payment_intent.payment_failed') {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  const orderId = paymentIntent.metadata.orderId;
  
  // Actualizar Order en BD
  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: 'failed',
      paymentStatus: 'failed',
      failureReason: paymentIntent.last_payment_error?.message,
    },
  });
  
  // Enviar email de fallo
  await sendOrderFailureEmail(order);
  
  console.error(`❌ Order ${orderId} payment failed`);
}
```

### 5️⃣ Implementar Email Notifications

Utilizar Resend (ya instalado):

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOrderConfirmationEmail(order: Order) {
  try {
    await resend.emails.send({
      from: 'orders@ecommerce.local',
      to: order.user.email,
      subject: `Orden confirmada #${order.id}`,
      html: `
        <h1>¡Gracias por tu compra!</h1>
        <p>Tu orden ha sido confirmada y será procesada.</p>
        <p><strong>Número de Orden:</strong> ${order.id}</p>
        <p><strong>Total:</strong> $${order.total}</p>
        <p>Rastrear: <a href="${process.env.NEXT_PUBLIC_BASE_URL}/orders/${order.id}">Ver orden</a></p>
      `,
    });
    console.log(`✅ Confirmation email sent to ${order.user.email}`);
  } catch (error) {
    console.error('❌ Failed to send confirmation email:', error);
  }
}

async function sendOrderFailureEmail(order: Order) {
  try {
    await resend.emails.send({
      from: 'support@ecommerce.local',
      to: order.user.email,
      subject: `Problema con tu pago - Orden #${order.id}`,
      html: `
        <h1>Problema procesando tu pago</h1>
        <p>No pudimos procesar tu orden en este momento.</p>
        <p><strong>Orden:</strong> ${order.id}</p>
        <p><strong>Razón:</strong> ${order.failureReason || 'Error desconocido'}</p>
        <p>Por favor intenta nuevamente: <a href="${process.env.NEXT_PUBLIC_BASE_URL}/checkout">Reintentar</a></p>
      `,
    });
    console.log(`✅ Failure email sent to ${order.user.email}`);
  } catch (error) {
    console.error('❌ Failed to send failure email:', error);
  }
}
```

### 6️⃣ Configurar Webhook en Stripe Dashboard

**Local Testing (Stripe CLI):**
```bash
stripe listen --forward-to localhost:3002/api/payments/webhook --events payment_intent.succeeded,payment_intent.payment_failed
```

**Production:**
1. Ir a https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Ingresar: `https://tu-dominio.com/api/payments/webhook`
4. Seleccionar eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`
5. Copiar signing secret a `.env.production`

### 7️⃣ Testing con Stripe CLI

```bash
# Trigger payment_intent.succeeded
stripe trigger payment_intent.succeeded

# Trigger payment_intent.payment_failed
stripe trigger payment_intent.payment_failed

# Ver logs
stripe logs tail
```

---

## ✅ Acceptance Criteria

- [x] Endpoint `/api/payments/webhook` recibe POST requests
- [x] Verifica firma de Stripe correctamente
- [x] Procesa `payment_intent.succeeded` y actualiza Order a "completed"
- [x] Procesa `payment_intent.payment_failed` y actualiza Order a "failed"
- [x] Envía email de confirmación al usuario
- [x] Envía email de fallo al usuario
- [x] Logs detallados de eventos procesados
- [x] TypeScript tipos correctos (Stripe.Event)
- [x] Type-check: 0 errors
- [x] Build: ✅ Success
- [x] Tests: Jest coverage >80%
- [x] Webhook funciona contra Stripe CLI localmente
- [x] Commit con mensaje: `feat: stripe webhook handler for payment confirmation`

---

## 📚 Referencias

- [Stripe Webhooks Docs](https://stripe.com/docs/webhooks)
- [Stripe Event Types](https://stripe.com/docs/api/events/types)
- [Resend Documentation](https://resend.com/docs)
- [Stripe Webhook Verification](https://stripe.com/docs/webhooks/signatures)
