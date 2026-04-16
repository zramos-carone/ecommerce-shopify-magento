'use client';

import { usePathname } from 'next/navigation';
import { Bell, UserCircle } from 'lucide-react';

export default function AdminHeader() {
  const pathname = usePathname();

  // Simple title mapper
  let pageTitle = 'Dashboard';
  if (pathname.includes('/orders')) pageTitle = 'Gestión de Órdenes';
  if (pathname.includes('/inventory')) pageTitle = 'Inventario';
  if (pathname.includes('/facturacion')) pageTitle = 'Facturación';

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 flex-shrink-0">
      <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>
      
      <div className="flex items-center space-x-4">
        <button className="text-gray-500 hover:text-gray-700 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        <div className="flex items-center space-x-2 border-l pl-4 border-gray-200">
          <UserCircle className="h-6 w-6 text-gray-400" />
          <span className="text-sm font-medium text-gray-700 hidden sm:block">Admin User</span>
        </div>
      </div>
    </header>
  );
}
