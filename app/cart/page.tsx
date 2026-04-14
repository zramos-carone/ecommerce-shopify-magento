'use client'

import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { CartItemComponent } from '@/components/CartItem'
import { CartSummary } from '@/components/CartSummary'

export default function CartPage() {
  const { items, isLoaded, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart()

  const handleCheckout = async () => {
    if (items.length === 0) return

    // Store cart total in sessionStorage for checkout page
    sessionStorage.setItem(
      'checkout-total',
      JSON.stringify({
        items: items.length,
        subtotal: getTotalPrice(),
        tax: getTotalPrice() * 0.16,
        total: getTotalPrice() * 1.16,
      })
    )

    // Redirect to checkout (will build in Day 8)
    window.location.href = '/checkout'
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-gray-600">Cargando carrito...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mi carrito</h1>
          <p className="text-gray-600">
            {items.length === 0 ? 'Tu carrito está vacío' : `${items.length} artículo${items.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2">
            {items.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-gray-600 text-lg mb-6">No hay artículos en tu carrito</p>
                <Link
                  href="/catalog"
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Ver catálogo
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                {items.map((item) => (
                  <CartItemComponent
                    key={item.product.id}
                    item={item}
                    onRemove={removeFromCart}
                    onQuantityChange={updateQuantity}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              <CartSummary items={items} onCheckout={handleCheckout} />

              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="w-full text-red-600 hover:text-red-800 hover:bg-red-50 py-2 rounded-lg transition-colors font-medium text-sm"
                >
                  Vaciar carrito
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link href="/catalog" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Volver al catálogo
          </Link>
        </div>
      </div>
    </div>
  )
}
