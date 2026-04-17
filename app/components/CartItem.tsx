'use client'

import React from 'react'
import Image from 'next/image'
import { Trash2, Plus, Minus } from 'lucide-react'
import { CartItem } from '@/context/CartContext'

interface CartItemComponentProps {
  item: CartItem
  onRemove: (productId: string) => void
  onQuantityChange: (productId: string, quantity: number) => void
}

export function CartItemComponent({ item, onRemove, onQuantityChange }: CartItemComponentProps) {
  const subtotal = item.price * item.quantity

  return (
    <div className="flex flex-col sm:flex-row gap-6 p-6 items-start sm:items-center">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-inner">
          <Image
            src={item.imageUrl || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800'}
            alt={item.name}
            fill
            className="object-contain p-2 transition-transform hover:scale-110"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{item.brand || 'Personalizado'}</p>
            <h3 className="text-base font-bold text-gray-900 line-clamp-1 font-outfit">{item.name}</h3>
            <p className="text-[10px] text-gray-400 font-medium uppercase mt-1">Suministrado por {item.mayorista}</p>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="text-gray-300 hover:text-red-500 transition-colors p-2"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing & Control */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
            <button
              onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-white rounded-lg transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center text-sm font-black font-outfit text-gray-900">{item.quantity}</span>
            <button
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-white rounded-lg transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter leading-none mb-1">Subtotal</span>
            <span className="text-lg font-black text-gray-900 font-outfit">
              ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
