import Image from 'next/image'
import { MayoristaProduct } from '@/lib/types/mayorista'

interface ProductCardProps {
  product: MayoristaProduct
  onAddToCart?: (product: MayoristaProduct) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow duration-200">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={
            product.imageUrl || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800'
          }
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />

        {/* Stock Badge */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-semibold">Sin Stock</span>
          </div>
        )}

        {/* Sale Badge */}
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
          {product.mayorista.toUpperCase().charAt(0)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Brand */}
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {product.brand || 'Generic'}
        </p>

        {/* Product Name */}
        <h3 className="mt-2 text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="mt-2 flex items-center gap-1">
            <div className="flex text-yellow-400">
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span className="text-xs text-gray-600">({product.rating.toFixed(1)})</span>
          </div>
        )}

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <span className="text-xs text-gray-500">{product.mayorista}</span>
        </div>

        {/* Stock Info */}
        <p className="mt-2 text-xs text-gray-600">
          {product.stock > 0 ? `${product.stock} en stock` : 'Sin stock'}
        </p>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart?.(product)}
          disabled={!product.inStock}
          className={`mt-4 w-full py-2 px-3 rounded-md font-medium text-sm transition-colors ${
            product.inStock ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {product.inStock ? 'Agregar al Carrito' : 'Sin Stock'}
        </button>
      </div>
    </div>
  )
}
