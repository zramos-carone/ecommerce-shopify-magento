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
        {children}
      </body>
    </html>
  )
}
