import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/admin/promotions
 * Obtiene el listado de promociones (cupones).
 */
export async function GET() {
  try {
    const promotions = await prisma.promotion.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: promotions,
    });
  } catch (error) {
    console.error('❌ GET Promotions error:', error);
    return NextResponse.json(
      { error: 'Error al obtener las promociones' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/promotions
 * Crea una nueva promoción/cupón.
 * 
 * Body esperado: { code: string, discountPercent: number, active?: boolean }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, discountPercent, active } = body;

    // Validaciones básicas
    if (!code || typeof discountPercent !== 'number') {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: code, discountPercent' },
        { status: 400 }
      );
    }

    if (discountPercent <= 0 || discountPercent > 100) {
      return NextResponse.json(
        { error: 'El porcentaje de descuento debe estar entre 0.01 y 100' },
        { status: 400 }
      );
    }

    // Normalizar código
    const upperCode = code.toUpperCase().trim();

    // Comprobar colisión
    const existing = await prisma.promotion.findUnique({
      where: { code: upperCode }
    });

    if (existing) {
      return NextResponse.json(
        { error: `El código ${upperCode} ya existe` },
        { status: 400 }
      );
    }

    // Insertar
    const promotion = await prisma.promotion.create({
      data: {
        code: upperCode,
        discountPercent,
        active: active !== undefined ? active : true,
      }
    });

    return NextResponse.json({
      success: true,
      data: promotion,
    }, { status: 201 });
  } catch (error) {
    console.error('❌ POST Promotions error:', error);
    return NextResponse.json(
      { error: 'Error al crear la promoción' },
      { status: 500 }
    );
  }
}
