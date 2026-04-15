import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateInvoiceHTML } from '@/lib/services/billing/pdf-generator';

/**
 * GET /api/admin/invoices/[id]
 * Get invoice in HTML or PDF format
 *
 * Query params:
 * - format: 'html' (default) or 'pdf'
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'html';

    // Fetch order with items
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Generate HTML invoice
    const htmlContent = generateInvoiceHTML(order);

    if (format === 'pdf') {
      // For PDF, we would need a library like pdfkit or puppeteer
      // For now, return HTML with hint to print as PDF
      return new NextResponse(htmlContent, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Disposition': `attachment; filename="Factura-${order.orderNumber}.html"`,
        },
      });
    }

    // Return HTML for viewing in browser
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('❌ Failed to generate invoice:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}
