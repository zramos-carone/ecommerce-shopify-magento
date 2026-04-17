'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check, ShoppingCart, Package, Truck, Info } from 'lucide-react'
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
    onAddToCart?.(product)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  // Lógica de Ofuscación de Stock para el modelo Boutique
  const getStockLabel = () => {
    if (!product.inStock || product.stock <= 0) {
      return { text: 'Agotado', color: 'bg-red-50 text-red-600 border-red-100', dot: 'bg-red-600' }
    }
    if (product.stock <= 10) {
      return { text: 'Últimas unidades', color: 'bg-yellow-50 text-yellow-700 border-yellow-100', dot: 'bg-yellow-500' }
    }
    return { text: 'En Stock - Entrega Inmediata', color: 'bg-green-50 text-green-700 border-green-100', dot: 'bg-green-600' }
  }

  const stockInfo = getStockLabel()

  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
      <Link href={`/catalog/${product.id}`} className="block">
        
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 m-2 rounded-[2rem]">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            /* Placeholder elegante cuando no hay imagen aprobada */
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-3">
                <Package className="w-8 h-8 text-gray-300" />
              </div>
              <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Imagen próximamente</span>
            </div>
          )}

          {/* Premium Availability Badge */}
          <div className={`absolute top-4 left-4 flex items-center space-x-2 px-3 py-1.5 rounded-full border backdrop-blur-md shadow-sm ${stockInfo.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${stockInfo.dot} ${product.stock > 0 ? 'animate-pulse' : ''}`}></span>
            <span className="text-[10px] font-black uppercase tracking-widest">{stockInfo.text}</span>
          </div>
          
          {/* Logo MaxTech discreto */}
          <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] text-white border border-white/10">
            MaxTech Elite
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 pt-2">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{product.brand || 'Original'}</span>
          </div>

          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 h-10 group-hover:text-blue-600 transition-colors font-outfit leading-tight mb-4">
            {product.name}
          </h3>

          <div className="flex flex-col mb-6">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter leading-none mb-2 underline decoration-blue-200 decoration-2 underline-offset-4">Precio Total</span>
            <span className="text-2xl font-black text-gray-900 font-outfit tracking-tighter leading-none">
              ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              <span className="text-xs text-gray-400 ml-1 font-medium font-sans underline-none">MXN</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-4 mb-6 pt-4 border-t border-gray-50">
             <div className="flex items-center space-x-1 text-gray-400">
               <Truck className="w-3.5 h-3.5" />
               <span className="text-[9px] font-bold uppercase">Envío Gratis</span>
             </div>
             <div className="flex items-center space-x-1 text-gray-400">
               <Info className="w-3.5 h-3.5" />
               <span className="text-[9px] font-bold uppercase">Garantía Local</span>
             </div>
          </div>
        </div>
      </Link>

      <div className="px-6 pb-6">
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdded}
          className={`group/btn w-full py-4 px-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all relative overflow-hidden flex items-center justify-center space-x-2 shadow-lg ${
            product.inStock 
              ? isAdded
                ? 'bg-green-600 text-white shadow-green-500/20' 
                : 'bg-black text-white hover:bg-blue-600 active:scale-95 shadow-black/10' 
              : 'bg-gray-50 text-gray-300 cursor-not-allowed shadow-none'
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
                <span>¡Agregado!</span>
              </motion.div>
            ) : (
              <motion.div
                key="add"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="flex items-center space-x-2"
              >
                <ShoppingCart className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                <span>Agregar al Carrito</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  )
}
