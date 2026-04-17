'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  PackageSearch, 
  FileText,
  ExternalLink,
  Tag,
  Zap,
  Globe,
  LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import { signOut } from 'next-auth/react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Órdenes', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Inventario', href: '/admin/inventory', icon: PackageSearch },
  { name: 'Facturación', href: '/admin/facturacion', icon: FileText },
  { name: 'Promociones', href: '/admin/promotions', icon: Tag },
];

const catalogNavigation = [
  { name: 'Discovery Hub', href: '/admin/discover', icon: Globe },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-[#0a0a0b] text-white w-72 flex-shrink-0 border-r border-white/5 shadow-2xl relative z-10">
      
      {/* Brand area */}
      <div className="flex h-24 items-center px-8">
        <div className="flex items-center space-x-3 group cursor-default">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
            <Zap className="w-6 h-6 text-white" fill="white" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase font-outfit">
            MAX<span className="text-blue-500">CORP</span>
            <span className="block text-[8px] tracking-[0.3em] text-gray-500 font-bold -mt-1">ADMIN CENTER</span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
        <p className="px-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Principal</p>
        
        {navigation.map((item) => {
          const isActive = pathname === item.href || (pathname !== '/admin' && item.href !== '/admin' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3.5 text-xs font-black uppercase tracking-widest rounded-2xl transition-all group relative overflow-hidden ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/10' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon
                className={`mr-4 h-5 w-5 flex-shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-gray-600 group-hover:text-blue-400'
                }`}
              />
              <span className="relative z-10">{item.name}</span>
              
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-blue-600 -z-1"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Catálogo Section */}
      <div className="px-4 pb-4">
        <p className="px-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Catálogo</p>
        {catalogNavigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3.5 text-xs font-black uppercase tracking-widest rounded-2xl transition-all group relative overflow-hidden ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/10' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon
                className={`mr-4 h-5 w-5 flex-shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-gray-600 group-hover:text-blue-400'
                }`}
              />
              <span className="relative z-10">{item.name}</span>
              {/* Indicador de nuevos productos disponibles */}
              <span className="ml-auto w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            </Link>
          );
        })}
      </div>

      {/* Footer Area */}
      <div className="p-6 border-t border-white/5 mb-4 space-y-3">
        <Link 
          href="/"
          className="flex items-center justify-between px-5 py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-blue-600 transition-all group"
        >
          <div className="flex items-center">
            <ExternalLink className="mr-3 h-4 w-4" />
            <span>Ver Tienda Pública</span>
          </div>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            →
          </motion.div>
        </Link>

        {/* Cierre de Sesión */}
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center px-5 py-4 bg-red-500/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all group border border-red-500/10"
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}
