'use client'

import React from 'react'
import Link from 'next/link'
import { ShieldCheck, Truck, ArrowRight } from 'lucide-react'
import { CartItem } from '@/context/CartContext'

interface CartSummaryProps {
  items: CartItem[]
  onCheckout: () => void
}

export function CartSummary({ items, onCheckout }: CartSummaryProps) {
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const tax = subtotal * 0.16 // IVA 16% Mexico
  const total = subtotal + tax
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
      <h2 className="text-xl font-black text-gray-900 mb-6 font-outfit uppercase tracking-tighter">Resumen de Compra</h2>

      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 font-medium">Subtotal ({itemCount} productos)</span>
          <span className="text-gray-900 font-black font-outfit">
            ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm border-t border-gray-50 pt-4">
          <span className="text-gray-500 font-medium">IVA Estimado (16%)</span>
          <span className="text-gray-900 font-black font-outfit">
            ${tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex justify-between items-center border-t border-gray-100 pt-6">
          <span className="text-base font-black text-gray-900 uppercase tracking-tighter font-outfit">Total Final</span>
          <span className="text-3xl font-black text-blue-600 font-outfit">
            ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-8">
        <div className="flex items-center space-x-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 p-3 rounded-xl border border-gray-100">
          <Truck className="w-4 h-4 text-blue-600" />
          <span>Envío Local Incluido</span>
        </div>
        <div className="flex items-center space-x-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 p-3 rounded-xl border border-gray-100">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <span>Compra Protegida MaxTech</span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={items.length === 0}
        className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center space-x-2
          ${items.length > 0 
            ? 'bg-blue-600 text-white hover:bg-black shadow-xl shadow-blue-500/20 active:scale-95' 
            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          }`}
      >
        <span>Proceder al Checkout</span>
        <ArrowRight className="w-5 h-5" />
      </button>

      <div className="mt-6 text-center">
        <Link
          href="/catalog"
          className="text-xs font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-colors"
        >
          ← Seguir Comprando
        </Link>
      </div>
    </div>
  )
}
