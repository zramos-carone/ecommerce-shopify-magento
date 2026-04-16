'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Order {
  id: string
  orderNumber: string
  email: string
  firstName: string
  lastName: string
  subtotal: number
  tax: number
  total: number
  status: string
  paymentStatus: string
  createdAt: string
  items: Array<{
    productId: string
    quantity: number
    price: number
    product: {
      name: string
    }
  }>
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!orderId) {
      setError('No hay orden para mostrar')
      setIsLoading(false)
      return
    }

    // Fetch orden
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`)

        if (!res.ok) {
          throw new Error('No se pudo cargar la orden')
        }

        const data: Order = await res.json()
        setOrder(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido'
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <p className="text-gray-600">Cargando confirmación...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-red-600 font-semibold mb-6">⚠ {error || 'Orden no encontrada'}</p>
          <Link
            href="/catalog"
            className="inline-block bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Catálogo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <span className="text-5xl">✓</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">¡Pago Confirmado!</h1>
          <p className="text-gray-600">Tu pedido ha sido procesado exitosamente</p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          {/* Header */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Número de Orden</p>
                <p className="text-lg font-bold text-gray-900">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Estado</p>
                <p className="text-lg font-bold text-green-600">Procesando</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="text-gray-900">{order.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Cliente</p>
                <p className="text-gray-900">
                  {order.firstName} {order.lastName}
                </p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Artículos Comprados</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.productId} className="flex justify-between pb-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{item.product.name}</p>
                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 pt-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">IVA (16%)</span>
              <span className="text-gray-900">${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
              <span className="text-gray-900">Total Pagado</span>
              <span className="text-blue-600">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-3">Próximos pasos:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✓ Recibirás un email de confirmación en {order.email}</li>
            <li>✓ Tu pedido será empacado y enviado en 1-2 días hábiles</li>
            <li>✓ Podrás rastrear tu envío desde tu cuenta</li>
          </ul>
        </div>

        {/* CTAs */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/catalog"
            className="block text-center bg-gray-200 text-gray-900 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            Seguir Comprando
          </Link>
          <Link
            href="/"
            className="block text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Ir a Inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <p className="text-gray-600">Cargando...</p>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  )
}
