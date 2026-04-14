'use client'

import { MayoristaProduct } from '@/lib/types/mayorista'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: MayoristaProduct[]
  isLoading?: boolean
}

export function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 aspect-square rounded-lg" />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">No hay productos</h3>
          <p className="text-gray-600 mt-2">Intenta cambiar los filtros</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={(p) => console.log('Add to cart:', p.name)}
        />
      ))}
    </div>
  )
}
