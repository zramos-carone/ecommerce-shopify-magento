import Link from 'next/link'

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md text-center bg-white rounded-lg border border-gray-200 p-12">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
            <span className="text-2xl">🔄</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema de Pagos</h1>
        <p className="text-gray-600 mb-2">Integración de Stripe + PayPal</p>
        <p className="text-sm text-gray-500 mb-8">Está disponible en Día 9</p>

        {/* Order Summary from SessionStorage */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">Estado de tu pedido:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ Pedido creado exitosamente</li>
            <li>⏳ Esperando pago (Verifica sessionStorage)</li>
            <li>📧 Confirmación será enviada a tu email</li>
          </ul>
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <p className="text-xs text-gray-500 mb-4">
            Estamos configurando los gateways de pago. Regresa en unas horas.
          </p>

          <Link href="/catalog" className="block w-full bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium">
            Volver al Catálogo
          </Link>

          <Link href="/cart" className="block w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Ver Carrito
          </Link>
        </div>

        {/* Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Próximas mejoras: Sistema de pagos con Stripe, soporte multi-moneda, facturación digital CFDI
          </p>
        </div>
      </div>
    </div>
  )
}
