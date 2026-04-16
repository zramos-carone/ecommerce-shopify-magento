import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    // Filtrar campos para evitar sobreescribir el ID o similares
    const { code, discountPercent, active } = body;
    const dataToUpdate: any = {};

    if (code !== undefined) dataToUpdate.code = code.toUpperCase().trim();
    if (discountPercent !== undefined) dataToUpdate.discountPercent = discountPercent;
    if (active !== undefined) dataToUpdate.active = active;

    const promotion = await prisma.promotion.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({
      success: true,
      data: promotion,
    });
  } catch (error) {
    console.error('❌ PATCH Promotion error:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la promoción' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.promotion.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Promoción eliminada exitosamente'
    });
  } catch (error) {
    console.error('❌ DELETE Promotion error:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la promoción' },
      { status: 500 }
    );
  }
}
