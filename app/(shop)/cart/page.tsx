'use client'

import React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, ArrowLeft, Trash2, Zap } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { CartItemComponent } from '@/components/CartItem'
import { CartSummary } from '@/components/CartSummary'

export default function CartPage() {
  const { cart, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart()

  const handleCheckout = async () => {
    if (cart.length === 0) return

    // Store cart total in sessionStorage for checkout page
    sessionStorage.setItem(
      'checkout-total',
      JSON.stringify({
        items: totalItems,
        subtotal: totalPrice,
        tax: totalPrice * 0.16,
        total: totalPrice * 1.16,
      })
    )

    // Redirect to checkout
    window.location.href = '/checkout'
  }

  return (
    <div className="min-h-screen bg-white py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Tu Selección</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-gray-900 font-outfit leading-none mb-4">
              MI CARRITO
            </h1>
            <p className="text-gray-500 font-medium">
              {totalItems === 0 
                ? 'Explora el catálogo y encuentra tu próximo setup.' 
                : `Tienes ${totalItems} artículo${totalItems !== 1 ? 's' : ''} en tu bolsa de compras.`}
            </p>
          </div>
          
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="flex items-center space-x-2 text-xs font-black text-red-500 hover:text-red-700 uppercase tracking-widest transition-colors mb-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Vaciar Carrito</span>
            </button>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Items Column */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="popLayout">
              {cart.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100 p-16 text-center"
                >
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6 text-gray-200">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 mb-2 font-outfit">TU CARRITO ESTÁ VACÍO</h2>
                  <p className="text-gray-500 mb-8 max-w-xs mx-auto text-sm leading-relaxed">
                    Parece que aún no has agregado nada. La potencia de MaxTech te espera.
                  </p>
                  <Link
                    href="/catalog"
                    className="inline-flex items-center space-x-3 bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-black transition-all font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95"
                  >
                    <span>Explorar Catálogo</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50"
                >
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <CartItemComponent
                        item={item}
                        onRemove={removeFromCart}
                        onQuantityChange={updateQuantity}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Support Box */}
            <div className="mt-8 p-8 rounded-[2rem] bg-gray-900 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                <Zap className="w-32 h-32" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-black font-outfit mb-2">¿Necesitas ayuda con tu pedido?</h3>
                  <p className="text-sm text-gray-400">Nuestros expertos están listos para asesorarte en tu configuración.</p>
                </div>
                <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase tracking-widest transition-colors backdrop-blur-sm border border-white/10">
                  Contactar Soporte
                </button>
              </div>
            </div>
          </div>

          {/* Summary Column */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 lg:sticky lg:top-28"
          >
            <CartSummary items={cart} onCheckout={handleCheckout} />
          </motion.div>
        </div>

      </div>
    </div>
  )
}
