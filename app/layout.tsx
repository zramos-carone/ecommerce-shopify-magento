import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

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
      <body className={`${inter.variable} ${outfit.variable} font-inter antialiased`}>
        {children}
      </body>
    </html>
  )
}
