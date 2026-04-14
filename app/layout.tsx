import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ecommerce MVP - Venta de Productos Tecnológicos',
  description: 'Plataforma ecommerce moderna para venta de laptops, hardware, software y accesorios tecnológicos en México',
  keywords: 'ecommerce, tecnología, laptops, hardware, software, México',
  authors: [{ name: 'Ecommerce MVP Team' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div className="min-h-screen bg-white">
          {/* Navigation */}
          <nav className="border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">🛍️ Ecommerce MVP</h1>
                </div>
                <div className="flex items-center space-x-4">
                  <a href="/" className="text-gray-700 hover:text-gray-900">Inicio</a>
                  <a href="/api-docs" className="text-gray-700 hover:text-gray-900">API Docs</a>
                  <a href="/catalog" className="text-gray-700 hover:text-gray-900">Catálogo</a>
                </div>
              </div>
            </div>
          </nav>

          {/* Main content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-gray-200 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
              <p>© 2026 Ecommerce MVP. Todos los derechos reservados.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
