import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * PATCH /api/admin/inventory/[id]
 * Actualiza un producto específico (Nombre, precio, stock, imagen, etc.)
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await req.json();

    const {
      name,
      price,
      stock,
      image,
      category,
      sku
    } = body;

    // Validate product existence
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        price: price !== undefined ? Number(price) : undefined,
        stock: stock !== undefined ? Number(stock) : undefined,
        image: image !== undefined ? image : undefined,
        category: category !== undefined ? category : undefined,
        sku: sku !== undefined ? sku : undefined,
      }
    });

    console.log(`✅ [PRODUCT_UPDATE] Producto ${id} actualizado:`, { 
      name: updatedProduct.name,
      price: updatedProduct.price,
      stock: updatedProduct.stock
    });

    return NextResponse.json({
      success: true,
      data: updatedProduct
    });

  } catch (error) {
    console.error('❌ [PRODUCT_UPDATE_ERROR]:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al actualizar el producto' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/inventory/[id]
 * Elimina un producto.
 */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    await prisma.product.delete({
      where: { id }
    });

    console.log(`🗑️ [PRODUCT_DELETE] Producto ${id} eliminado.`);

    return NextResponse.json({ success: true, message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('❌ [PRODUCT_DELETE_ERROR]:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el producto' },
      { status: 500 }
    );
  }
}
