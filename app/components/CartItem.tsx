'use client'

import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import type { CartItem } from '@/hooks/useCart'

interface CartItemComponentProps {
  item: CartItem
  onRemove: (productId: string) => void
  onQuantityChange: (productId: string, quantity: number) => void
}

export function CartItemComponent({ item, onRemove, onQuantityChange }: CartItemComponentProps) {
  const { product, quantity } = item
  const subtotal = product.price * quantity

  return (
    <div className="flex gap-4 border-b border-gray-200 py-4">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={product.imageUrl || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{product.brand}</p>

        {/* Price and Quantity */}
        <div className="mt-3 flex items-center gap-4">
          <div>
            <p className="text-sm text-gray-600">Cantidad</p>
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => onQuantityChange(product.id, quantity - 1)}
                className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => onQuantityChange(product.id, quantity + 1)}
                className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600">Precio unitario</p>
            <p className="font-semibold text-gray-900 mt-1">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Subtotal</p>
            <p className="font-semibold text-gray-900 mt-1">
              ${subtotal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(product.id)}
        className="flex-shrink-0 text-red-600 hover:text-red-800 transition-colors p-2"
        title="Eliminar del carrito"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  )
}
