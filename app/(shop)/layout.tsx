import Link from 'next/link';
import { ShoppingBag, Search, User } from 'lucide-react';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* Navigation - Glassmorphism Sticky */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-3xl font-black tracking-tighter text-blue-600 font-outfit">
                  TEC<span className="text-gray-900">NO</span>
                </span>
              </Link>
            </div>

            {/* Links Centrales */}
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
              <Link href="/catalog" className="hover:text-blue-600 transition-colors">Productos</Link>
              <Link href="/catalog?category=laptops" className="hover:text-blue-600 transition-colors">Laptops</Link>
              <Link href="/catalog?category=gaming" className="hover:text-blue-600 transition-colors">Gaming</Link>
              <Link href="/api-docs" className="hover:text-blue-600 transition-colors">API Docs</Link>
            </div>

            <div className="flex items-center space-x-5">
              <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <Link href="/cart" className="p-2 text-gray-400 hover:text-gray-900 transition-colors relative">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
              </Link>
              <Link href="/admin" className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                <User className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer Robust - Dark Theme */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <span className="text-2xl font-black tracking-tighter text-blue-600 font-outfit mb-4 block">
                TEC<span className="text-gray-900">NO</span>
              </span>
              <p className="text-gray-500 text-sm leading-relaxed">
                Tu socio tecnológico de confianza. Ofreciendo los mejores componentes y soluciones desde 2026.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Tienda</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/catalog" className="hover:text-blue-600 transition-colors">Hardware</Link></li>
                <li><Link href="/catalog" className="hover:text-blue-600 transition-colors">Laptops</Link></li>
                <li><Link href="/catalog" className="hover:text-blue-600 transition-colors">Workstations</Link></li>
                <li><Link href="/catalog" className="hover:text-blue-600 transition-colors">Novedades</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Soporte</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Envíos</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Garantías</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Seguimiento</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Únete al Newsletter</h4>
              <p className="text-sm text-gray-500 mb-4">Recibe las últimas ofertas y lanzamientos antes que nadie.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Tu email" 
                  className="bg-gray-50 border border-gray-200 rounded-l-lg px-4 py-2 w-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <button className="bg-blue-600 text-white rounded-r-lg px-4 py-2 text-sm hover:bg-blue-700 transition-colors">
                  OK
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-8 text-center text-gray-400 text-xs">
            <p>© 2026 TECNO Ecommerce. Todos los derechos reservados. Diseñado para el Futuro.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
