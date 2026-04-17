'use client';

import { usePathname } from 'next/navigation';
import { Bell, UserCircle, Search, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminHeader() {
  const pathname = usePathname();

  // Simple title mapper
  let pageTitle = 'Panel de Control';
  if (pathname.includes('/orders')) pageTitle = 'Gestión Logística';
  if (pathname.includes('/inventory')) pageTitle = 'Control de Existencias';
  if (pathname.includes('/facturacion')) pageTitle = 'Administración Fiscal';
  if (pathname.includes('/promotions')) pageTitle = 'Campañas y Ofertas';

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 h-20 flex items-center justify-between px-10 flex-shrink-0 sticky top-0 z-20">
      
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 w-64 group focus-within:ring-2 focus-within:ring-blue-600 transition-all">
          <Search className="h-4 w-4 text-gray-400" />
          <input 
            placeholder="Comando rápido..." 
            className="bg-transparent border-none text-xs ml-3 outline-none w-full font-medium" 
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-5">
          <button className="text-gray-400 hover:text-blue-600 transition-colors relative group">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 block h-2.5 w-2.5 rounded-full bg-blue-600 ring-2 ring-white animate-pulse" />
          </button>
          <button className="text-gray-400 hover:text-black transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex items-center space-x-3 border-l pl-8 border-gray-100 h-10">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Root Access</p>
            <p className="text-xs font-black text-gray-900 font-outfit uppercase">Admin MaxTech</p>
          </div>
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white ring-4 ring-gray-50">
            <UserCircle className="h-6 w-6" />
          </div>
        </div>
      </div>
    </header>
  );
}
