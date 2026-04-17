'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Check, 
  ArrowRight, 
  ShoppingBag, 
  Mail, 
  Package, 
  Instagram,
  Linkedin,
  Facebook
} from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('orderNumber') || 'MA-TX-999331'

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-20 px-4">
      <div className="max-w-3xl w-full text-center">
        
        {/* Animated Success Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto mb-10 text-green-600 border border-green-100 shadow-xl shadow-green-500/10"
        >
          <Check className="w-12 h-12" />
        </motion.div>

        {/* Text Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.25em] mb-6">
            Orden Confirmada
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 font-outfit uppercase tracking-tighter leading-tight mb-6">
            ¡GRACIAS POR TU COMPRA!
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
            Tu pedido está siendo procesado por nuestros expertos. Recibirás un correo de confirmación en unos minutos.
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 rounded-[2.5rem] p-10 mb-12 border border-gray-100 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
            <Package className="w-32 h-32" />
          </div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Número de Orden</p>
              <p className="text-xl font-black font-outfit text-blue-600 tracking-tight">{orderNumber}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Estado del Envío</p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <p className="text-sm font-bold text-gray-900">En Preparación</p>
              </div>
            </div>
            <div className="md:col-span-2 pt-6 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="w-5 h-5" />
                <span className="text-sm font-medium">Sigue tu pedido en tu correo</span>
              </div>
              <button className="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-black transition-colors">
                Descargar Ticket PDF
              </button>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link
            href="/catalog"
            className="w-full sm:w-auto px-10 py-5 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-black/10 flex items-center justify-center space-x-2"
          >
            <span>Seguir Comprando</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/admin"
            className="w-full sm:w-auto px-10 py-5 bg-white border border-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Ver Mis Órdenes</span>
          </Link>
        </motion.div>

        {/* Social Sharing */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 pt-10 border-t border-gray-50"
        >
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Preséntanos tu nuevo Setup</p>
          <div className="flex justify-center space-x-8 text-gray-300">
            <a href="#" className="hover:text-blue-600 transition-colors"><Instagram className="w-6 h-6" /></a>
            <a href="#" className="hover:text-blue-600 transition-colors"><Facebook className="w-6 h-6" /></a>
            <a href="#" className="hover:text-blue-600 transition-colors"><Linkedin className="w-6 h-6" /></a>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
