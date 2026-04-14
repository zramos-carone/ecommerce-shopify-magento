'use client'

import { useState, useEffect } from 'react'
import { MayoristaProduct, SearchResult } from '@/lib/types/mayorista'
import Image from 'next/image'
import { useParams } from 'next/navigation'

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const [product, setProduct] = useState<MayoristaProduct | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch products and find the one with matching ID
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/mayoristas/search?page=1&limit=100`)
        const data: SearchResult = await response.json()
        const found = data.products.find((p: MayoristaProduct) => p.id === productId)
        setProduct(found || null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Producto no encontrado</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Link */}
        <a href="/catalog" className="text-blue-600 hover:text-blue-800 font-medium mb-6 block">
          ← Volver al catálogo
        </a>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="bg-white rounded-lg p-6">
            <div className="relative aspect-square overflow-hidden rounded">
              <Image
                src={
                  product.imageUrl ||
                  'https://via.placeholder.com/600?text=' + encodeURIComponent(product.name)
                }
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-blue-600">{product.category}</p>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
              <p className="text-gray-600 mt-2">{product.description}</p>
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {'★'.repeat(Math.floor(product.rating))}
                  {'☆'.repeat(5 - Math.floor(product.rating))}
                </div>
                <span className="text-gray-600">({product.rating.toFixed(1)})</span>
              </div>
            )}

            {/* Price */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Precio</p>
              <p className="text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-2">De: {product.mayorista}</p>
            </div>

            {/* Stock */}
            <div>
              <p className="text-gray-600 text-sm">Disponibilidad</p>
              <p className={`text-lg font-semibold ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {product.inStock ? `${product.stock} en stock` : 'Sin stock'}
              </p>
            </div>

            {/* Add to Cart */}
            <button
              disabled={!product.inStock}
              className={`w-full py-3 rounded-lg font-semibold text-lg transition-colors ${
                product.inStock
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {product.inStock ? 'Agregar al Carrito' : 'Sin Stock'}
            </button>

            {/* Specs */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información</h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-600">SKU</dt>
                  <dd className="font-mono text-gray-900">{product.sku}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Marca</dt>
                  <dd className="text-gray-900">{product.brand || 'N/A'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Mayorista</dt>
                  <dd className="uppercase text-gray-900">{product.mayorista}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
