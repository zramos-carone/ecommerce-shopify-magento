import { Resend } from 'resend';
import { Order } from '@prisma/client';
import { prisma } from '@/lib/db';

let resendInstance: Resend | null = null;

/**
 * Lazy initialization of Resend client to avoid build-time errors
 * when the API key is missing.
 */
function getResend() {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    // During build or if missing, we use a placeholder to avoid constructor crash.
    // The actual error will only happen if we try to SEND an email without a key.
    resendInstance = new Resend(apiKey || 're_build_placeholder');
  }
  return resendInstance;
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(
  order: Order & { email: string; firstName: string; lastName: string }
) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002';
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
            .section { margin: 20px 0; }
            .order-number { font-size: 24px; font-weight: bold; color: #2c3e50; }
            .total { font-size: 20px; color: #27ae60; font-weight: bold; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table th, .items-table td { border-bottom: 1px solid #ddd; padding: 10px; text-align: left; }
            .items-table th { background-color: #ecf0f1; }
            .button { display: inline-block; background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { color: #7f8c8d; font-size: 12px; margin-top: 40px; border-top: 1px solid #ecf0f1; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Gracias por tu compra!</h1>
              <p>Tu orden ha sido confirmada y será procesada en breve.</p>
            </div>
            
            <div class="section">
              <p>Hola <strong>${order.firstName} ${order.lastName}</strong>,</p>
              <p>Tu pago ha sido procesado exitosamente. A continuación encontrarás los detalles de tu orden:</p>
            </div>
            
            <div class="section">
              <div><strong>📦 Número de Orden:</strong> <span class="order-number">${order.orderNumber}</span></div>
              <div><strong>📅 Fecha:</strong> ${new Date(order.createdAt).toLocaleDateString('es-ES')}</div>
              <div><strong>📍 Entrega a:</strong> ${order.address}, ${order.city}, ${order.postalCode}</div>
            </div>
            
            <div class="section">
              <h3>Detalles de tu orden:</h3>
              <p><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
              <p><strong>Impuestos:</strong> $${order.tax.toFixed(2)}</p>
              ${order.shipping > 0 ? `<p><strong>Envío:</strong> $${order.shipping.toFixed(2)}</p>` : ''}
              <p class="total"><strong>TOTAL:</strong> $${order.total.toFixed(2)}</p>
            </div>
            
            <a href="${baseUrl}/orders/${order.id}" class="button">Ver detalles de tu orden</a>
            
            <div class="footer">
              <p>¿Preguntas? Contáctanos en support@ecommerce.local</p>
              <p>Este es un mensaje automático, por favor no responder a este email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const response = await getResend().emails.send({
      from: 'orders@ecommerce.local',
      to: order.email,
      subject: `¡Orden confirmada! #${order.orderNumber}`,
      html,
    });

    console.log(`✅ Confirmation email sent to ${order.email} (Order: ${order.orderNumber})`);
    return response;
  } catch (error) {
    console.error('❌ Failed to send confirmation email:', error);
    throw error;
  }
}

/**
 * Send order failure email to customer
 */
export async function sendOrderFailureEmail(
  order: Order & { email: string; firstName: string; lastName: string },
  failureReason?: string
) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002';
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #fff3cd; padding: 20px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #ffc107; }
            .section { margin: 20px 0; }
            .error-message { background-color: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .button { display: inline-block; background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .footer { color: #7f8c8d; font-size: 12px; margin-top: 40px; border-top: 1px solid #ecf0f1; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ Problema procesando tu pago</h1>
              <p>No pudimos procesar tu orden en este momento.</p>
            </div>
            
            <div class="section">
              <p>Hola <strong>${order.firstName} ${order.lastName}</strong>,</p>
              <p>Lamentablemente, hubo un problema al procesar el pago de tu orden.</p>
            </div>
            
            <div class="error-message">
              <p><strong>Razón del error:</strong></p>
              <p>${failureReason || 'Error desconocido durante el procesamiento del pago.'}</p>
            </div>
            
            <div class="section">
              <h3>Detalles de tu orden:</h3>
              <div><strong>Número de Orden:</strong> ${order.orderNumber}</div>
              <div><strong>Monto:</strong> $${order.total.toFixed(2)}</div>
            </div>
            
            <div class="section">
              <p><strong>¿Qué hacer ahora?</strong></p>
              <ul>
                <li>Verifica que los datos de tu tarjeta sean correctos</li>
                <li>Intenta con otro método de pago</li>
                <li>Contacta a tu banco si el problema persiste</li>
              </ul>
              <a href="${baseUrl}/checkout" class="button">Reintentar pago</a>
            </div>
            
            <div class="footer">
              <p>¿Necesitas ayuda? Contáctanos en support@ecommerce.local</p>
              <p>Este es un mensaje automático, por favor no responder a este email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const response = await getResend().emails.send({
      from: 'support@ecommerce.local',
      to: order.email,
      subject: `Problema con tu pago - Orden #${order.orderNumber}`,
      html,
    });

    console.log(`✅ Failure email sent to ${order.email} (Order: ${order.orderNumber})`);
    return response;
  } catch (error) {
    console.error('❌ Failed to send failure email:', error);
    throw error;
  }
}

/**
 * Send order shipped notification email
 */
export async function sendOrderShippedEmail(
  order: Order & { email: string; firstName: string; lastName: string },
  trackingNumber?: string
) {
  try {
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #d4edda; padding: 20px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #28a745; }
            .section { margin: 20px 0; }
            .tracking { background-color: #ecf0f1; padding: 15px; border-radius: 5px; font-family: monospace; }
            .footer { color: #7f8c8d; font-size: 12px; margin-top: 40px; border-top: 1px solid #ecf0f1; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📦 ¡Tu orden ha sido enviada!</h1>
              <p>Tu paquete está en camino.</p>
            </div>
            
            <div class="section">
              <p>Hola <strong>${order.firstName} ${order.lastName}</strong>,</p>
              <p>Tu orden ha sido empaquetada y enviada. Puedes rastrear tu paquete usando los datos a continuación.</p>
            </div>
            
            ${trackingNumber ? `
              <div class="section">
                <h3>Número de Rastreo:</h3>
                <div class="tracking">${trackingNumber}</div>
              </div>
            ` : ''}
            
            <div class="section">
              <h3>Detalles de tu orden:</h3>
              <div><strong>Número de Orden:</strong> ${order.orderNumber}</div>
              <div><strong>Entrega a:</strong> ${order.address}, ${order.city}, ${order.postalCode}</div>
            </div>
            
            <div class="footer">
              <p>¿Preguntas? Contáctanos en support@ecommerce.local</p>
              <p>Este es un mensaje automático, por favor no responder a este email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const response = await getResend().emails.send({
      from: 'orders@ecommerce.local',
      to: order.email,
      subject: `Tu orden ha sido enviada - #${order.orderNumber}`,
      html,
    });

    console.log(`✅ Shipped email sent to ${order.email} (Order: ${order.orderNumber})`);
    return response;
  } catch (error) {
    console.error('❌ Failed to send shipped email:', error);
    throw error;
  }
}

/**
 * Deduct stock after successful payment
 */
export async function deductOrderStock(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      console.error(`❌ Order not found: ${orderId}`);
      return false;
    }

    // Deduct stock for each item
    let itemsDeducted = 0;
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      console.log(`📦 Stock deducted: Product ${item.productId} (-${item.quantity})`);
      itemsDeducted++;
    }

    console.log(`✅ Stock deducted for order ${order.orderNumber}: ${itemsDeducted} items`);
    return true;
  } catch (error) {
    console.error('❌ Failed to deduct stock:', error);
    return false;
  }
}
