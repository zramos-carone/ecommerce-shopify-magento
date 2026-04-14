'use client'

import { useState } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'

interface StripePaymentFormProps {
  clientSecret: string
  onSuccess: (paymentIntentId: string) => Promise<void>
  isLoading?: boolean
}

export function StripePaymentForm({ clientSecret, onSuccess, isLoading }: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string>('')
  const [processing, setProcessing] = useState(false)
  const [succeeded, setSucceeded] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      setError('Stripe no se cargó correctamente')
      return
    }

    setProcessing(true)
    setError('')

    try {
      // Obtener el CardElement
      const cardElement = elements.getElement(CardElement)

      if (!cardElement) {
        throw new Error('Card element not found')
      }

      // Confirmar el pago con el clientSecret
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: 'customer@example.com', // Idealmente esto viene del formulario
          },
        },
      })

      if (stripeError) {
        setError(stripeError.message || 'Error al procesar el pago')
        setProcessing(false)
        return
      }

      if (paymentIntent?.status === 'succeeded') {
        setSucceeded(true)
        // Llamar el callback de éxito
        await onSuccess(paymentIntent.id)
      } else {
        setError(`Estado de pago: ${paymentIntent?.status}`)
        setProcessing(false)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      setProcessing(false)
    }
  }

  if (succeeded) {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
        <p className="text-lg font-semibold text-green-900">✓ Pago Confirmado</p>
        <p className="text-green-700 mt-2">Tu orden ha sido procesada exitosamente.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Card Element */}
      <div className="p-4 border border-gray-300 rounded-lg bg-white">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#fa755a',
              },
            },
            hidePostalCode: false,
          }}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm font-medium">⚠ {error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={processing || isLoading || !stripe}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
      >
        {processing ? 'Procesando pago...' : 'Pagar ahora'}
      </button>

      {/* Info */}
      <p className="text-xs text-gray-500 text-center">
        Usa la tarjeta de prueba 4242 4242 4242 4242, CVV 123, fecha futura
      </p>
    </form>
  )
}
