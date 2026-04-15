import { Order } from '@prisma/client';

/**
 * Generate HTML invoice for printing/PDF export
 */
export function generateInvoiceHTML(
  order: Order & { items?: any[] }
): string {
  const invoiceDate = new Date(order.createdAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const items = order.items || [];

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Factura ${order.orderNumber}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: white;
            color: #333;
            line-height: 1.6;
          }

          .invoice-container {
            width: 21cm;
            height: 29.7cm;
            padding: 2cm;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
          }

          .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            border-bottom: 3px solid #2c3e50;
            padding-bottom: 20px;
          }

          .company-info h1 {
            font-size: 24px;
            color: #2c3e50;
            margin-bottom: 5px;
          }

          .company-info p {
            font-size: 12px;
            color: #666;
          }

          .invoice-details {
            text-align: right;
          }

          .invoice-details .label {
            font-weight: bold;
            color: #2c3e50;
            font-size: 14px;
          }

          .invoice-details .value {
            font-size: 13px;
            color: #333;
          }

          .section-title {
            font-size: 12px;
            font-weight: bold;
            color: #2c3e50;
            text-transform: uppercase;
            margin-top: 20px;
            margin-bottom: 10px;
          }

          .customer-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            font-size: 12px;
          }

          .customer-info div {
            flex: 1;
          }

          .customer-info .label {
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 3px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }

          table thead {
            background: #f5f5f5;
            border-top: 1px solid #ddd;
            border-bottom: 2px solid #ddd;
          }

          table th {
            padding: 10px;
            text-align: left;
            font-weight: bold;
            color: #2c3e50;
          }

          table td {
            padding: 8px 10px;
            border-bottom: 1px solid #eee;
          }

          table tbody tr:last-child td {
            border-bottom: 2px solid #ddd;
          }

          .text-right {
            text-align: right;
          }

          .amounts-section {
            margin-top: 20px;
            display: flex;
            justify-content: flex-end;
          }

          .amounts-table {
            width: 250px;
            font-size: 12px;
          }

          .amounts-table .row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px solid #eee;
          }

          .amounts-table .total-row {
            font-weight: bold;
            font-size: 14px;
            color: #2c3e50;
            border-top: 2px solid #2c3e50;
            border-bottom: 2px solid #2c3e50;
            padding: 10px 0;
            margin-top: 5px;
          }

          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 10px;
            color: #999;
          }

          .payment-status {
            font-weight: bold;
            padding: 10px;
            margin: 15px 0;
            border-radius: 4px;
            text-align: center;
          }

          .payment-status.completed {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
          }

          .payment-status.pending {
            background: #fff3cd;
            color: #856404;
            border: 1px solid #ffeeba;
          }

          .payment-status.failed {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
          }

          @media print {
            body {
              background: white;
              margin: 0;
              padding: 0;
            }
            .invoice-container {
              box-shadow: none;
              width: auto;
              height: auto;
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <!-- Header -->
          <div class="invoice-header">
            <div class="company-info">
              <h1>ECOMMERCE MVP</h1>
              <p>Empresa Demo S.A. de C.V.</p>
              <p>RFC: EMP000000XXX</p>
              <p>Email: facturas@ecommerce-mvp.local</p>
            </div>
            <div class="invoice-details">
              <div class="label">FACTURA / INVOICE</div>
              <div class="value">#${order.orderNumber}</div>
              <div style="margin-top: 10px;">
                <div class="label">Fecha</div>
                <div class="value">${invoiceDate}</div>
              </div>
            </div>
          </div>

          <!-- Customer Info -->
          <div class="section-title">Datos del Cliente</div>
          <div class="customer-info">
            <div>
              <div class="label">Nombre</div>
              <div>${order.firstName} ${order.lastName}</div>
            </div>
            <div>
              <div class="label">Email</div>
              <div>${order.email}</div>
            </div>
            <div>
              <div class="label">Teléfono</div>
              <div>${order.phone}</div>
            </div>
          </div>

          <div class="customer-info" style="margin-top: 10px;">
            <div>
              <div class="label">Dirección de Entrega</div>
              <div>${order.address}</div>
              <div>${order.city}, ${order.postalCode} ${order.country}</div>
            </div>
          </div>

          <!-- Items Table -->
          <div class="section-title">Conceptos de Facturación</div>
          <table>
            <thead>
              <tr>
                <th>Descripción</th>
                <th class="text-right">Cantidad</th>
                <th class="text-right">Precio Unit.</th>
                <th class="text-right">Importe</th>
              </tr>
            </thead>
            <tbody>
              ${items.length > 0 ? items.map((item) => `
                <tr>
                  <td>${item.productName || 'Producto'}</td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">$${(item.price || 0).toFixed(2)}</td>
                  <td class="text-right">$${((item.quantity || 1) * (item.price || 0)).toFixed(2)}</td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="4">No hay items en esta factura</td>
                </tr>
              `}
            </tbody>
          </table>

          <!-- Amounts -->
          <div class="amounts-section">
            <div class="amounts-table">
              <div class="row">
                <span>Subtotal:</span>
                <span>$${order.subtotal.toFixed(2)}</span>
              </div>
              <div class="row">
                <span>IVA (16%):</span>
                <span>$${order.tax.toFixed(2)}</span>
              </div>
              ${order.shipping > 0 ? `
                <div class="row">
                  <span>Envío:</span>
                  <span>$${order.shipping.toFixed(2)}</span>
                </div>
              ` : ''}
              <div class="row total-row">
                <span>TOTAL A PAGAR:</span>
                <span>$${order.total.toFixed(2)} MXN</span>
              </div>
            </div>
          </div>

          <!-- Payment Status -->
          <div class="payment-status ${order.paymentStatus}">
            Estado de Pago: ${order.paymentStatus === 'completed' ? '✅ PAGADO' :
                              order.paymentStatus === 'pending' ? '⏳ PENDIENTE' :
                              order.paymentStatus === 'failed' ? '❌ RECHAZADO' : order.paymentStatus.toUpperCase()}
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>Esta es una factura de demostración de la plataforma de eCommerce MVP.</p>
            <p>Próxima versión incluirá facturación oficial CFDI integrada con el SAT.</p>
            <p>Documento generado el ${new Date().toLocaleString('es-ES')}</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Generate downloadable invoice URL endpoint path
 */
export function getInvoiceUrl(orderId: string): string {
  return `/api/admin/invoices/${orderId}`;
}
