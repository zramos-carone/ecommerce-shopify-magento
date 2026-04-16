'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { CPU, Zap, Shield, Truck, ArrowRight } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import AnimatedButton from '../components/ui/AnimatedButton';

export default function Home() {
  return (
    <div className="relative isolate">
      {/* Background Decorative Blur */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#60a5fa] to-[#2563eb] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 overflow-hidden lg:pt-20 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6 transition-transform hover:scale-105">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Novedades Semana 3</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-gray-900 leading-[0.95] mb-8 font-outfit">
                LA POTENCIA <br />
                <span className="text-blue-600">DEL FUTURO</span><br />
                A TU ALCANCE.
              </h1>
              
              <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-lg">
                Explora el catálogo más grande de hardware premium en México. 
                Más de 1,500 productos listos para potenciar tu workstation o setup gaming.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <AnimatedButton href="/catalog" variant="primary">
                  Explorar Catálogo <ArrowRight className="ml-2 w-4 h-4" />
                </AnimatedButton>
                <AnimatedButton href="/api-docs" variant="glass">
                  Developer Hub
                </AnimatedButton>
              </div>

              <div className="mt-12 flex items-center space-x-4">
                <div className="flex -space-x-2 overflow-hidden">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-200" />
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  <span className="font-bold text-gray-900">1,500+</span> Productos de Mayoristas Elite
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative lg:ml-auto"
            >
              <div className="absolute -inset-4 bg-blue-500/10 rounded-full blur-3xl" />
              <div className="relative">
                <Image 
                  src="/images/hero-laptop.png" 
                  alt="Premium Tech" 
                  width={600} 
                  height={500}
                  priority
                  className="rounded-3xl drop-shadow-2xl floating-animation"
                />
                
                {/* Floating Specs Card */}
                <GlassCard className="absolute -bottom-6 -left-6 p-4 max-w-[200px] hidden sm:block">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-600 rounded-lg text-white">
                      <CPU className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">Procesador</p>
                      <p className="text-sm font-bold text-gray-900 leading-none">Ultra Core 9</p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Markers Section */}
      <section className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center space-y-3">
              <Truck className="w-8 h-8 text-blue-600" />
              <h3 className="text-sm font-bold text-gray-900">Envío Nacional Express</h3>
              <p className="text-xs text-gray-500">Logística optimizada en todo México</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <h3 className="text-sm font-bold text-gray-900">Garantía Extendida</h3>
              <p className="text-xs text-gray-500">Protección total en cada compra</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <Zap className="w-8 h-8 text-blue-600" />
              <h3 className="text-sm font-bold text-gray-900">Hardware de Elite</h3>
              <p className="text-xs text-gray-500">Selección curada de mayoristas</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <User className="w-8 h-8 text-blue-600" />
              <h3 className="text-sm font-bold text-gray-900">Soporte Experto</h3>
              <p className="text-xs text-gray-500">Atención técnica personalizada</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-black text-gray-900 font-outfit uppercase tracking-tighter">Categorías Destacadas</h2>
            <p className="text-gray-500 text-sm mt-2">Los componentes más buscados de la temporada.</p>
          </div>
          <AnimatedButton href="/catalog" variant="glass" className="hidden sm:inline-flex">
            Ver Todo
          </AnimatedButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlassCard className="group h-[450px]">
            <div className="p-8 h-full flex flex-col">
              <span className="text-xs font-black text-blue-600 mb-2 uppercase tracking-widest">Gráficos de Nueva Era</span>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-outfit">GPUs & <br />Procesamiento</h3>
              <div className="mt-auto relative">
                <Image src="/images/cat-gpu.png" alt="GPU" width={300} height={200} className="rounded-xl transition-transform group-hover:scale-110" />
                <div className="absolute -inset-2 bg-blue-400/20 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="group h-[450px]" delay={0.1}>
            <div className="p-8 h-full flex flex-col">
              <span className="text-xs font-black text-blue-600 mb-2 uppercase tracking-widest">Inmersión Pura</span>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-outfit">Displays & <br />Workspace</h3>
              <div className="mt-auto relative">
                <Image src="/images/cat-monitor.png" alt="Monitor" width={300} height={200} className="rounded-xl transition-transform group-hover:scale-110" />
              </div>
            </div>
          </GlassCard>

          <div className="flex flex-col gap-6">
            <GlassCard className="flex-1 p-8 flex flex-col justify-center" delay={0.2}>
              <h4 className="text-xl font-bold text-gray-900 mb-2 font-outfit">Laptops</h4>
              <p className="text-sm text-gray-500 mb-4">Potencia portátil para creadores.</p>
              <AnimatedButton href="/catalog?category=laptops" className="!px-4 !py-2 self-start">Ver Mas</AnimatedButton>
            </GlassCard>
            <GlassCard className="flex-1 p-8 flex flex-col justify-center bg-gray-900/90 text-white" delay={0.3}>
              <h4 className="text-xl font-bold text-white mb-2 font-outfit">Ofertas Especiales</h4>
              <p className="text-sm text-gray-300 mb-4 italic">Usa el cupón SEMANA3 para 15% OFF</p>
              <AnimatedButton href="/catalog" variant="secondary" className="!px-4 !py-2 self-start !bg-white !text-black">Ir a Tienda</AnimatedButton>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Project Milestone Badge (Floating) */}
      <div className="fixed bottom-8 left-8 z-40 hidden xl:block">
        <GlassCard className="p-3 !rounded-full !bg-white/90">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-[10px]">v1.5</div>
            <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest leading-none">Deployment <br />Successful</p>
          </div>
        </GlassCard>
      </div>
      
      <style jsx global>{`
        @keyframes drift {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(1deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .floating-animation {
          animation: drift 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

