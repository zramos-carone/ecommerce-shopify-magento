'use client'

import { useState, useEffect } from 'react'
import { MayoristaProduct, SearchResult } from '@/lib/types/mayorista'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCart, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  Zap, 
  CheckCircle2,
  Package
} from 'lucide-react'
import { useCart } from '@/hooks/useCart'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const productId = params.id as string
  const [product, setProduct] = useState<MayoristaProduct | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // En un escenario real, tendríamos un endpoint GET /api/products/:id
        // Para este MVP, buscamos en el catálogo masivo
        const response = await fetch(`/api/mayoristas/search?page=1&limit=100`)
        const data: SearchResult = await response.json()
        const found = data.products.find((p: MayoristaProduct) => p.id === productId)
        setProduct(found || null)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium animate-pulse">Cargando experiencia MaxTech...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 text-center">
        <Package className="w-16 h-16 text-gray-200 mb-4" />
        <h1 className="text-2xl font-black text-gray-900 mb-2">Producto no encontrado</h1>
        <p className="text-gray-500 mb-6">Lo sentimos, el producto que buscas no está disponible actualmente.</p>
        <button 
          onClick={() => router.push('/catalog')}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
        >
          Volver al Catálogo
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => router.back()}
            className="group flex items-center text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            VOLVER AL CATÁLOGO
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left: Image Gallery (Simplified for MVP) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="sticky top-28 bg-gray-50 rounded-[2.5rem] p-8 lg:p-12 overflow-hidden aspect-square flex items-center justify-center border border-gray-100 shadow-inner">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative w-full h-full"
              >
                <Image
                  src={
                    product.imageUrl ||
                    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800'
                  }
                  alt={product.name}
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </motion.div>
              
              {/* Badge Dinámico */}
              <div className="absolute top-8 left-8">
                <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                  {product.mayorista} Exclusive
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right: Info Area */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col"
          >
            {/* Header info */}
            <div className="mb-8">
              <span className="inline-block px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black tracking-widest uppercase mb-4">
                {product.category || 'Tecnología'}
              </span>
              <h1 className="text-3xl lg:text-5xl font-black text-gray-900 font-outfit leading-[1.1] mb-4">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4">
                {product.rating && (
                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                    <div className="flex text-yellow-500 mr-2 text-xs">
                      {'★'.repeat(Math.round(product.rating))}
                    </div>
                    <span className="text-xs font-bold text-yellow-700">{product.rating.toFixed(1)}</span>
                  </div>
                )}
                <span className="text-xs font-medium text-gray-400">SKU: {product.sku}</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 mb-10">
              <div className="flex items-baseline space-x-3 mb-2">
                <span className="text-4xl lg:text-5xl font-black text-gray-900 font-outfit">
                  ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-sm font-bold text-gray-400 uppercase tracking-tighter">MXN</span>
              </div>
              <p className="text-xs font-medium text-gray-500 mb-6">IVA incluido • Envío calculado al checkout</p>

              {/* Stock status */}
              <div className="flex items-center space-x-2 mb-8">
                {product.inStock ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold text-green-600 uppercase tracking-tight">En stock - {product.stock} unidades</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-bold text-red-600 uppercase tracking-tight">Agotado temporalmente</span>
                  </>
                )}
              </div>

              {/* Action */}
              <button
                onClick={() => product.inStock && addToCart(product)}
                disabled={!product.inStock}
                className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.1em] transition-all flex items-center justify-center space-x-3
                  ${product.inStock 
                    ? 'bg-blue-600 text-white hover:bg-black hover:scale-[1.02] shadow-xl shadow-blue-500/20 active:scale-95' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{product.inStock ? 'Agregar al Carrito' : 'Sin Stock'}</span>
              </button>
            </div>

            {/* Perks Grid */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="p-4 rounded-2xl border border-gray-100 bg-white flex items-center space-x-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-900 uppercase leading-none mb-1">Envío Exprés</p>
                  <p className="text-[10px] text-gray-500 leading-none">A todo México</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl border border-gray-100 bg-white flex items-center space-x-3">
                <div className="p-2 bg-green-50 text-green-600 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-900 uppercase leading-none mb-1">Garantía Directa</p>
                  <p className="text-[10px] text-gray-500 leading-none">De mayorista</p>
                </div>
              </div>
            </div>

            {/* Detailed Info */}
            <div className="border-t border-gray-100 pt-10">
              <h3 className="text-lg font-black text-gray-900 font-outfit uppercase tracking-tighter mb-6">Especificaciones y Datos</h3>
              <div className="space-y-4">
                {[
                  { label: 'Marca', value: product.brand || 'N/A' },
                  { label: 'Mayorista', value: product.mayorista.toUpperCase() },
                  { label: 'Categoría', value: product.category || 'Hardware' },
                  { label: 'Garantía', value: '1 Año con fabricante' },
                ].map((spec, i) => (
                  <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-50">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{spec.label}</span>
                    <span className="text-xs font-black text-gray-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Promo Card */}
            <div className="mt-10 p-6 rounded-[2rem] bg-gradient-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                <Zap className="w-24 h-24" />
              </div>
              <p className="text-sm font-black uppercase tracking-widest mb-2 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                MaxTech Assurance
              </p>
              <h4 className="text-xl font-black font-outfit mb-2">Soporte Técnico Especializado</h4>
              <p className="text-sm text-blue-100 leading-relaxed">
                Todos nuestros productos cuentan con soporte directo. ¿Tienes dudas? Nuestros expertos te acompañan en la configuración.
              </p>
            </div>

          </motion.div>
        </div>
      </main>
    </div>
  )
}
