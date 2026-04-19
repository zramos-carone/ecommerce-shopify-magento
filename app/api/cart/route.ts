import { NextResponse } from "next/server";
import type { CartItem } from "@/hooks/useCart";

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Resumen del Carrito
 *     description: Calcula totales, impuestos y cargos finales basados en una lista de items serializada en la URL.
 *     tags:
 *       - Transacción
 *     parameters:
 *       - in: query
 *         name: cart
 *         schema:
 *           type: string
 *         description: JSON serializado del array de items del carrito.
 *     responses:
 *       200:
 *         description: Resumen calculado del carrito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items: { type: 'array', items: { $ref: '#/components/schemas/CartItem' } }
 *                 total: { type: 'number' }
 *                 itemCount: { type: 'integer' }
 *                 tax: { type: 'number' }
 *                 grandTotal: { type: 'number' }
 *   post:
 *     summary: Proceso Inicial de Carrito
 *     description: Valida el contenido del carrito y genera un desglose preliminar antes del checkout.
 *     tags:
 *       - Transacción
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items: { type: 'array', items: { $ref: '#/components/schemas/CartItem' } }
 *               email: { type: 'string' }
 *               phone: { type: 'string' }
 *     responses:
 *       200:
 *         description: Carrito procesado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: 'boolean' }
 *                 subtotal: { type: 'number' }
 *                 total: { type: 'number' }
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cartJson = searchParams.get("cart");

    if (!cartJson) {
      return NextResponse.json(
        { items: [], total: 0, itemCount: 0 },
        { status: 200 },
      );
    }

    const items: CartItem[] = JSON.parse(cartJson);

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const itemCount = items.reduce((count, item) => count + item.quantity, 0);

    return NextResponse.json(
      {
        items,
        total,
        itemCount,
        tax: total * 0.16,
        grandTotal: total * 1.16,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Cart API error:", error);
    return NextResponse.json(
      { error: "Failed to process cart" },
      { status: 400 },
    );
  }
}

/**
 * POST /api/cart
 * Validate and process cart checkout
 *
 * Expected body:
 * {
 *   items: CartItem[],
 *   email: string,
 *   phone: string
 * }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, email, phone } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!email || !phone) {
      return NextResponse.json(
        { error: "Email and phone are required" },
        { status: 400 },
      );
    }

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const tax = total * 0.16;
    const grandTotal = total + tax;

    // Return checkout summary (payment integration happens in checkout page)
    return NextResponse.json(
      {
        success: true,
        cartId: `cart_${Date.now()}`,
        itemCount: items.reduce((count, item) => count + item.quantity, 0),
        subtotal: total,
        tax,
        total: grandTotal,
        email,
        phone,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Cart checkout error:", error);
    return NextResponse.json(
      { error: "Failed to process checkout" },
      { status: 500 },
    );
  }
}
