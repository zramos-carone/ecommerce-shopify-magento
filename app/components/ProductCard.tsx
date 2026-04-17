'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check, ShoppingCart } from 'lucide-react'
import { MayoristaProduct } from '@/lib/types/mayorista'
import { motion, AnimatePresence } from 'framer-motion'

interface ProductCardProps {
  product: MayoristaProduct
  onAddToCart?: (product: MayoristaProduct) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Call the external handler
    onAddToCart?.(product)
    
    // Provide visual feedback
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow duration-200">
      <Link href={`/catalog/${product.id}`} className="block">
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

          {/* Mayorista Badge */}
          <div className="absolute top-2 right-2 bg-blue-600/90 backdrop-blur-sm text-white px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter">
            {product.mayorista}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-outfit">
            {product.brand || 'Generic'}
          </p>

          <h3 className="mt-2 text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors font-outfit leading-tight h-10">
            {product.name}
          </h3>

          {product.rating && (
            <div className="mt-2 flex items-center gap-1">
              <div className="flex text-yellow-400 text-xs">
                {'★'.repeat(Math.floor(product.rating))}
                {'☆'.repeat(5 - Math.floor(product.rating))}
              </div>
              <span className="text-[10px] text-gray-500 font-medium">({product.rating.toFixed(1)})</span>
            </div>
          )}

          <div className="mt-4 flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter leading-none mb-1">Precio Final</span>
              <span className="text-xl font-black text-gray-900 font-outfit leading-none">
                ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdded}
          className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all relative overflow-hidden flex items-center justify-center space-x-2 ${
            product.inStock 
              ? isAdded
                ? 'bg-green-600 text-white' 
                : 'bg-gray-900 text-white hover:bg-blue-600 active:scale-95 shadow-sm' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <AnimatePresence mode="wait">
            {isAdded ? (
              <motion.div
                key="added"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="flex items-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>¡Añadido!</span>
              </motion.div>
            ) : (
              <motion.div
                key="add"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="flex items-center space-x-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Agregar al Carrito</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  )
}
