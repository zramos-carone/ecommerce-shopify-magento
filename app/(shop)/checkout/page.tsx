'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2,
  Lock,
  Wallet
} from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, totalPrice, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'credit_card'
  })

  // IVA fixed at 16%
  const tax = totalPrice * 0.16
  const finalTotal = totalPrice + tax

  useEffect(() => {
    // If cart is empty and not submitting, redirect to catalog
    if (cart.length === 0 && !isSubmitting) {
      const timer = setTimeout(() => router.push('/catalog'), 3000)
      return () => clearTimeout(timer)
    }
  }, [cart, router, isSubmitting])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: cart.map(item => ({
            productId: item.id,
            sku: item.sku,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
            category: item.category,
            brand: item.brand
          })),
          subtotal: totalPrice,
          tax: tax
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al procesar la orden')
      }

      const order = await response.json()
      
      // Clear cart and redirect to success
      clearCart()
      router.push(`/checkout/success?orderNumber=${order.orderNumber}`)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error desconocido')
      setIsSubmitting(false)
    }
  }

  if (cart.length === 0 && !isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-2xl font-black font-outfit uppercase tracking-tighter mb-2">Tu carrito está vacío</h1>
          <p className="text-gray-500 mb-8">Redirigiéndote al catálogo...</p>
          <Link href="/catalog" className="text-blue-600 font-bold uppercase text-xs tracking-widest hover:underline">
            Volver ahora
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header simple */}
        <div className="mb-12 flex items-center justify-between">
          <Link href="/cart" className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Carrito</span>
          </Link>
          <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            <Lock className="w-3 h-3" />
            <span>Checkout Seguro</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Form Side */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit}>
              
              {/* Shipping Info */}
              <section className="bg-white rounded-[2.5rem] border border-gray-100 p-8 sm:p-12 shadow-sm mb-8">
                <div className="flex items-center space-x-4 mb-10">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl">1</div>
                  <div>
                    <h2 className="text-2xl font-black font-outfit uppercase tracking-tighter">Información de Envío</h2>
                    <p className="text-gray-400 text-sm">¿A dónde enviamos tu equipo MaxTech?</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre</label>
                    <input 
                      required name="firstName" value={formData.firstName} onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none" 
                      placeholder="Ej: Juan" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Apellido</label>
                    <input 
                      required name="lastName" value={formData.lastName} onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none" 
                      placeholder="Ej: Pérez" 
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email de Contacto</label>
                    <input 
                      required type="email" name="email" value={formData.email} onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none" 
                      placeholder="juan@ejemplo.com" 
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Dirección Completa</label>
                    <input 
                      required name="address" value={formData.address} onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none" 
                      placeholder="Calle, número, colonia..." 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ciudad</label>
                    <input 
                      required name="city" value={formData.city} onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Código Postal</label>
                    <input 
                      required name="postalCode" value={formData.postalCode} onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none" 
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Teléfono</label>
                    <input 
                      required name="phone" value={formData.phone} onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none" 
                      placeholder="+52 ..." 
                    />
                  </div>
                </div>
              </section>

              {/* Payment Info */}
              <section className="bg-white rounded-[2.5rem] border border-gray-100 p-8 sm:p-12 shadow-sm">
                <div className="flex items-center space-x-4 mb-10">
                  <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white font-black text-xl">2</div>
                  <div>
                    <h2 className="text-2xl font-black font-outfit uppercase tracking-tighter">Método de Pago</h2>
                    <p className="text-gray-400 text-sm">Transacción cifrada y segura</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => setFormData(p => ({...p, paymentMethod: 'credit_card'}))}
                    className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all ${
                      formData.paymentMethod === 'credit_card' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-50 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <CreditCard className={`w-6 h-6 ${formData.paymentMethod === 'credit_card' ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className="font-bold text-sm">Tarjeta de Crédito</span>
                    </div>
                    {formData.paymentMethod === 'credit_card' && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                  </button>

                  <button 
                    type="button"
                    onClick={() => setFormData(p => ({...p, paymentMethod: 'paypal'}))}
                    className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all ${
                      formData.paymentMethod === 'paypal' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-50 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <Wallet className={`w-6 h-6 ${formData.paymentMethod === 'paypal' ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className="font-bold text-sm">PayPal</span>
                    </div>
                    {formData.paymentMethod === 'paypal' && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                  </button>
                </div>

                <div className="mt-12 bg-gray-50 rounded-3xl p-6 flex items-start space-x-4">
                  <ShieldCheck className="w-6 h-6 text-green-600 shrink-0" />
                  <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                    Tu pago será procesado de forma segura. MaxTech no almacena los datos de tu tarjeta. Al confirmar, aceptas nuestros términos de servicio y políticas de privacidad.
                  </p>
                </div>
              </section>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`mt-8 w-full py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-3
                  ${isSubmitting ? 'bg-gray-100 text-gray-400' : 'bg-blue-600 text-white hover:bg-black shadow-xl shadow-blue-500/20 active:scale-95'}
                `}
              >
                {isSubmitting ? (
                  <span>Procesando...</span>
                ) : (
                  <>
                    <span>Confirmar Pedido de ${finalTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    <CheckCircle2 className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm overflow-hidden">
              <h3 className="text-xl font-black font-outfit uppercase tracking-tighter mb-8 pb-4 border-b border-gray-50">Tu Pedido</h3>
              
              <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">QTY: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-black text-gray-900 font-outfit">
                      ${(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-50">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                  <span className="font-black">${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">IVA (16%)</span>
                  <span className="font-black">${tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Envío</span>
                  <span className="text-green-600 font-black uppercase tracking-widest text-[10px]">Gratis</span>
                </div>
                <div className="flex justify-between items-end pt-4 mt-2">
                  <span className="text-base font-black font-outfit uppercase tracking-tighter">Total Final</span>
                  <span className="text-3xl font-black text-blue-600 font-outfit leading-none">${finalTotal.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.15em] text-blue-600">
                <Truck className="w-4 h-4" />
                <span>Entrega estimada: 3-5 días hábiles</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
