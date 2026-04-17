"use client";

import type { CartItem } from "@/hooks/useCart";

interface OrderSummaryProps {
  items: CartItem[];
}

export function OrderSummary({ items }: OrderSummaryProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.16;
  const shipping = 0;
  const total = subtotal + tax + shipping;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-20">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen de Orden</h2>

      {/* Items List */}
      <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <div className="flex-1">
              <p className="text-gray-900 font-medium">{item.name}</p>
              <p className="text-gray-600 text-xs">Cantidad: {item.quantity}</p>
            </div>
            <span className="text-gray-900 font-medium">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">IVA (16%)</span>
          <span className="text-gray-900">${tax.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Envío</span>
          <span className="text-gray-900">${shipping.toFixed(2)}</span>
        </div>

        <div className="flex justify-between border-t border-gray-200 pt-2 mt-2 text-lg font-bold">
          <span className="text-gray-900">Total</span>
          <span className="text-blue-600">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Info Badge */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-900">
          ✓ Envío gratis a todo México en órdenes mayores a $500
        </p>
      </div>
    </div>
  );
}
