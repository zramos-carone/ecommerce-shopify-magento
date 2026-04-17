import Link from "next/link";
import { Header } from "@/components/Header";
import { BRAND_CONFIG } from "@/lib/config/branding";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* Header Centralizado - Client Component */}
      <Header />

      {/* Main content */}
      <main className="flex-grow">{children}</main>

      {/* Footer Robust - Dark Theme */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <span className="text-2xl font-black tracking-tighter text-blue-600 font-outfit mb-4 block uppercase">
                {BRAND_CONFIG.shortName}
                <span className="text-gray-900">{BRAND_CONFIG.accentName}</span>
              </span>
              <p className="text-gray-500 text-sm leading-relaxed">
                Tu socio tecnológico de confianza. Ofreciendo los mejores
                componentes y soluciones desde 2026.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Tienda</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <Link
                    href="/catalog"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Hardware
                  </Link>
                </li>
                <li>
                  <Link
                    href="/catalog"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Laptops
                  </Link>
                </li>
                <li>
                  <Link
                    href="/catalog"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Workstations
                  </Link>
                </li>
                <li>
                  <Link
                    href="/catalog"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Novedades
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Soporte</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Envíos
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Garantías
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Seguimiento
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">
                Únete al Newsletter
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                Recibe las últimas ofertas y lanzamientos antes que nadie.
              </p>
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
            <p>
              © 2026 {BRAND_CONFIG.fullName}. Todos los derechos reservados.
              Diseñado para el Futuro.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
