'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { CheckoutForm, type CheckoutData } from '@/components/CheckoutForm'
import { OrderSummary } from '@/components/OrderSummary'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCart()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Carrito Vacío</h1>
          <p className="text-gray-600 mb-8">Tu carrito no tiene artículos. ¡Regresa al catálogo!</p>
          <Link
            href="/catalog"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver Catálogo
          </Link>
        </div>
      </div>
    )
  }

  const handleCheckout = async (formData: CheckoutData) => {
    setIsLoading(true)
    setError('')

    try {
      // 1. Valida inventario
      const invRes = await fetch('/api/inventory/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
          })),
        }),
      })

      const invData = await invRes.json()

      if (!invData.available) {
        const unavailable = invData.unavailable
          .map((u: any) => `${u.productId}: necesitas ${u.requested} pero hay ${u.available}`)
          .join(', ')
        setError(`Productos no disponibles: ${unavailable}`)
        return
      }

      // 2. Crea orden en BD
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
            price: i.product.price,
          })),
          email: formData.email,
          phone: formData.phone,
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          subtotal: getTotalPrice(),
          tax: getTotalPrice() * 0.16,
        }),
      })

      if (!orderRes.ok) {
        const errData = await orderRes.json()
        throw new Error(errData.error || 'Error creando orden')
      }

      const orderData = await orderRes.json()

      // 3. Guarda orden y limpia carrito
      sessionStorage.setItem(
        'currentOrder',
        JSON.stringify({
          id: orderData.id,
          total: orderData.total,
          email: formData.email,
        })
      )

      clearCart()

      // 4. Redirige a pago
      router.push('/payment')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en checkout')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Completa tu pedido</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">⚠ {error}</p>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <CheckoutForm onSubmit={handleCheckout} isLoading={isLoading} />

            {/* Continue Shopping Link */}
            <div className="mt-6">
              <Link href="/catalog" className="text-blue-600 hover:text-blue-800 font-medium">
                ← Volver al Catálogo
              </Link>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummary items={items} />
          </div>
        </div>
      </div>
    </div>
  )
}
