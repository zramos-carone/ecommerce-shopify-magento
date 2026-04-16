import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import Stripe from 'stripe';
import { createPayPalOrder } from '@/lib/services/payments/paypal';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-08-16',
});

/**
 * POST /api/checkout
 * Orquestador principal del flujo checkout
 *
 * Body:
 * {
 *   cartItems: [{ productId, quantity, price, name }],
 *   shippingAddress: { street, city, state, zip, country },
 *   customerEmail: string,
 *   paymentMethod: 'stripe' | 'paypal',
 *   firstName: string,
 *   lastName: string,
 *   phone: string
 * }
 */
export async function POST(req: Request) {
  try {
    const {
      cartItems,
      shippingAddress,
      customerEmail,
      paymentMethod,
      firstName,
      lastName,
      phone,
      couponCode,
    } = await req.json();

    // Validar datos requeridos
    if (!cartItems?.length || !shippingAddress || !customerEmail || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields: cartItems, shippingAddress, customerEmail, paymentMethod' },
        { status: 400 }
      );
    }

    if (!['stripe', 'paypal'].includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Invalid paymentMethod. Must be "stripe" or "paypal"' },
        { status: 400 }
      );
    }

    console.log(`🛒 Checkout initiated: ${cartItems.length} items, method: ${paymentMethod}`);

    // 1️⃣ Validar carrito (stock, prices)
    const validationResult = await validateCart(cartItems);
    if (!validationResult.valid) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }

    // 2️⃣ Calcular subtotal (bruto)
    let subtotal = Number(
      (cartItems.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
      ).toFixed(2))
    );

    // 2.5️⃣ Aplicar Descuento de Promoción
    let discountAmount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const upperCode = couponCode.toUpperCase().trim();
      const promo = await prisma.promotion.findUnique({
        where: { code: upperCode }
      });

      if (promo && promo.active) {
        discountAmount = subtotal * (promo.discountPercent / 100);
        appliedCoupon = upperCode;
      }
    }

    subtotal = Number((subtotal - discountAmount).toFixed(2));

    // 3️⃣ Calcular shipping
    const shippingCost = calculateShipping(shippingAddress, subtotal);

    // 4️⃣ Calcular impuestos (IVA 16%)
    const taxableAmount = subtotal + shippingCost;
    const tax = Number((taxableAmount * 0.16).toFixed(2));

    // 5️⃣ Total
    const total = Number((subtotal + shippingCost + tax).toFixed(2));

    // 6️⃣ Crear orden en BD
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        email: customerEmail,
        phone: phone || '',
        firstName: firstName || 'Customer',
        lastName: lastName || '',
        address: shippingAddress.street || '',
        city: shippingAddress.city || '',
        postalCode: shippingAddress.zip || '',
        country: shippingAddress.country || 'Mexico',
        subtotal,
        shipping: shippingCost,
        tax,
        total,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod,
        items: {
          create: cartItems.map((item: any) => ({
            productId: item.productId,
            productName: item.name,
            quantity: item.quantity,
            price: item.price,
            subtotal: Number((item.price * item.quantity).toFixed(2)),
          })),
        },
      },
      include: { items: true },
    });

    console.log(`✅ Order created: ${order.orderNumber} (${order.id})`);

    // 7️⃣ Crear payment intent según método de pago
    let paymentDetails: any = {};

    if (paymentMethod === 'stripe') {
      // Crear Stripe Payment Intent
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(total * 100), // Stripe usa centavos
          currency: 'mxn',
          description: `Orden #${order.orderNumber}`,
          metadata: {
            orderId: order.id,
            orderNumber: order.orderNumber,
          },
          receipt_email: customerEmail,
        });

        // Guardar payment intent ID
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentId: paymentIntent.id },
        });

        paymentDetails = {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
        };

        console.log(`💳 Stripe Payment Intent created: ${paymentIntent.id}`);
      } catch (stripeError) {
        console.error('❌ Stripe error:', stripeError);
        // Marcar orden como fallida due to payment processing error
        await prisma.order.update({
          where: { id: order.id },
          data: { status: 'failed', paymentStatus: 'failed' },
        });
        throw new Error(
          stripeError instanceof Error ? stripeError.message : 'Stripe payment creation failed'
        );
      }
    } else if (paymentMethod === 'paypal') {
      // Crear PayPal Order Reál En API Externa
      try {
        const paypalResponse = await createPayPalOrder(total, order.id);
        const paypalOrderId = paypalResponse.id;
        
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentId: paypalOrderId },
        });

        const approveUrl = paypalResponse.links?.find((link: any) => link.rel === 'approve')?.href || `https://sandbox.paypal.com/checkoutnow?token=${paypalOrderId}`;

        paymentDetails = {
          paypalOrderId,
          approvalUrl: approveUrl,
        };

        console.log(`🅿️ PayPal Order link generated: ${paypalOrderId}`);
      } catch (err) {
        console.error('❌ Falló la generación de cuota PayPal', err);
        throw new Error('PayPal payment creation failed');
      }
    }

    // 8️⃣ Retornar respuesta
    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentMethod,
      paymentDetails,
      orderSummary: {
        subtotal: subtotal.toFixed(2),
        discountAmount: discountAmount.toFixed(2),
        coupon: appliedCoupon,
        shipping: shippingCost.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        itemCount: cartItems.length,
      },
      nextStep: 'payment',
    });
  } catch (error) {
    console.error('❌ Checkout error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Checkout process failed',
      },
      { status: 500 }
    );
  }
}

/**
 * Validar carrito: verificar stock y precios
 */
async function validateCart(
  cartItems: any[]
): Promise<{ valid: boolean; error?: string }> {
  try {
    for (const item of cartItems) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return {
          valid: false,
          error: 'Invalid cart item: missing or invalid productId/quantity',
        };
      }

      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return {
          valid: false,
          error: `Producto no encontrado`,
        };
      }

      if (product.stock < item.quantity) {
        return {
          valid: false,
          error: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}, solicitado: ${item.quantity}`,
        };
      }

      // Verificar que el precio no sea muy diferente (validación básica de fraude)
      // Allow 1% variance
      const priceVariance = Math.abs(product.price - item.price) / product.price;
      if (priceVariance > 0.01) {
        return {
          valid: false,
          error: `Precio cambió para ${product.name}. Esperado: ${product.price}, recibido: ${item.price}`,
        };
      }
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Validation error',
    };
  }
}

/**
 * Calcular costo de shipping basado en destino y monto
 */
function calculateShipping(
  address: any,
  subtotal: number
): number {
  // Envío gratuito para compras >$1000 MXN
  if (subtotal > 1000) {
    return 0;
  }

  // Envío gratuito en CDMX/Ciudad de México
  const city = (address.city || '').toUpperCase();
  if (city.includes('CDMX') || city.includes('MEXICO CITY')) {
    return 0;
  }

  // Envío nacional estándar: $100 MXN
  return 100;
}

/**
 * Generar número de orden único
 */
function generateOrderNumber(): string {
  const prefix = 'ORD';
  const timestamp = Date.now().toString().slice(-5);
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
}

/**
 * GET /api/checkout
 * Helper / documentation
 */
export async function GET() {
  return NextResponse.json({
    message: 'Checkout API Endpoint',
    usage: 'POST with cart items, shipping address, and payment details',
    example: {
      cartItems: [
        {
          productId: 'clxxx...',
          name: 'Laptop Pro',
          quantity: 1,
          price: 999.99,
        },
      ],
      shippingAddress: {
        street: '123 Avenida Principal',
        city: 'Mexico City',
        state: 'CDMX',
        zip: '06500',
        country: 'Mexico',
      },
      customerEmail: 'customer@example.com',
      paymentMethod: 'stripe',
      firstName: 'Juan',
      lastName: 'Pérez',
      phone: '5512345678',
    },
    response: {
      success: true,
      orderId: 'clxxx...',
      orderNumber: 'ORD-12345ABC',
      paymentMethod: 'stripe',
      paymentDetails: {
        clientSecret: 'pi_....',
        paymentIntentId: 'pi_...',
      },
      orderSummary: {
        subtotal: '999.99',
        shipping: '0.00',
        tax: '159.98',
        total: '1159.97',
        itemCount: 1,
      },
      nextStep: 'payment',
    },
  });
}
