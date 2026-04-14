'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { StripePaymentForm } from '@/components/StripePaymentForm'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CurrentOrder {
  id: string
  total: number
  email: string
  subtotal: number
  tax: number
}

export default function PaymentPage() {
  const router = useRouter()
  const [clientSecret, setClientSecret] = useState<string>('')
  const [order, setOrder] = useState<CurrentOrder | null>(null)
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Recuperar orden de sessionStorage
    const storedOrder = sessionStorage.getItem('currentOrder')

    if (!storedOrder) {
      setError('No hay orden activa. Por favor completa el checkout primero.')
      setIsLoading(false)
      return
    }

    const currentOrder: CurrentOrder = JSON.parse(storedOrder)
    setOrder(currentOrder)

    // Crear Payment Intent
    const createPaymentIntent = async () => {
      try {
        const res = await fetch('/api/payments/create-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: currentOrder.id,
            amount: currentOrder.total,
            email: currentOrder.email,
          }),
        })

        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.error || 'No se pudo crear Payment Intent')
        }

        const data = await res.json()
        setClientSecret(data.clientSecret)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido'
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    createPaymentIntent()
  }, [])

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    if (!order) return

    try {
      // Actualizar orden con status pagada
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: paymentIntentId,
          paymentStatus: 'completed',
          status: 'processing',
        }),
      })

      if (!res.ok) {
        throw new Error('No se pudo actualizar la orden')
      }

      // Limpiar sessionStorage
      sessionStorage.removeItem('currentOrder')
      sessionStorage.removeItem('checkout-total')

      // Redirigir a confirmación
      router.push(`/order-confirmation?orderId=${order.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al confirmar pago')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600">Preparando formulario de pago...</p>
        </div>
      </div>
    )
  }

  if (error && !clientSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md text-center bg-white rounded-lg border border-gray-200 p-8">
          <p className="text-red-600 font-semibold mb-6">⚠ {error}</p>
          <Link
            href="/checkout"
            className="inline-block bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a Checkout
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Confirmar Pago</h1>
          <p className="text-gray-600">Completa tu pago con tarjeta de crédito</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            {clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <div className="bg-white rounded-lg border border-gray-200 p-8">
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  )}

                  <StripePaymentForm
                    clientSecret={clientSecret}
                    onSuccess={handlePaymentSuccess}
                  />
                </div>
              </Elements>
            )}
          </div>

          {/* Order Summary */}
          {order && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-20">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IVA (16%)</span>
                    <span className="text-gray-900">${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">${order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-900">
                    <strong>Tarjeta de prueba:</strong> 4242 4242 4242 4242
                  </p>
                  <p className="text-xs text-blue-900 mt-1">CVV: 123, Fecha: 12/25</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link href="/checkout" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Volver a Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}
