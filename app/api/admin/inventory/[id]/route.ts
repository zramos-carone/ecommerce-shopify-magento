import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/admin/inventory/[id]
 * Obtener detalles de producto específico
 */
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('❌ Product fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/inventory/[id]
 * Actualizar un producto específico
 *
 * Body: { stock?, price?, name? }
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updateData = await req.json();
    const { stock, price, name } = updateData;

    // Validar datos
    if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
      return NextResponse.json(
        { error: 'Invalid stock value' },
        { status: 400 }
      );
    }

    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      return NextResponse.json(
        { error: 'Invalid price value' },
        { status: 400 }
      );
    }

    // Build update object
    const dataToUpdate: any = {};
    if (stock !== undefined) dataToUpdate.stock = Math.max(0, stock);
    if (price !== undefined) dataToUpdate.price = price;
    if (name !== undefined) dataToUpdate.name = name;

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: dataToUpdate,
    });

    console.log(`✅ Product updated: ${updated.name}`);

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('❌ Product update error:', error);
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}
