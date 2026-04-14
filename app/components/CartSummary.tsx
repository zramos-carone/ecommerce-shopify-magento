'use client'

import Link from 'next/link'
import type { CartItem } from '@/hooks/useCart'

interface CartSummaryProps {
  items: CartItem[]
  onCheckout: () => void
}

export function CartSummary({ items, onCheckout }: CartSummaryProps) {
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  const tax = subtotal * 0.16 // IVA 16% Mexico
  const total = subtotal + tax
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <p className="text-gray-600 mb-4">Tu carrito está vacío</p>
        <Link
          href="/catalog"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continuar comprando
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen del carrito</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{itemCount} artículos</span>
          <span className="text-gray-900 font-semibold">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm border-t border-gray-200 pt-3">
          <span className="text-gray-600">IVA (16%)</span>
          <span className="text-gray-900 font-semibold">${tax.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
          <span className="text-gray-900">Total</span>
          <span className="text-blue-600">${total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold mb-3"
      >
        Proceder al pago
      </button>

      <Link
        href="/catalog"
        className="block text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        Continuar comprando
      </Link>
    </div>
  )
}
