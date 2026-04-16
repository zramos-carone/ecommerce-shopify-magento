'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  PackageSearch, 
  FileText,
  Settings,
  Tag
} from 'lucide-react';
// import { cn } from '@/lib/utils'; // Assuming this exists based on package.json, otherwise I should use raw template literals/clsx

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Órdenes', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Inventario', href: '/admin/inventory', icon: PackageSearch },
  { name: 'Facturación', href: '/admin/facturacion', icon: FileText },
  { name: 'Promociones', href: '/admin/promotions', icon: Tag },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-gray-900 text-white w-64 flex-shrink-0">
      {/* Brand area */}
      <div className="flex h-16 items-center px-6 border-b border-gray-800">
        <span className="text-xl font-bold tracking-tight">Admin<span className="text-blue-500">Panel</span></span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (pathname !== '/admin' && item.href !== '/admin' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                isActive 
                  ? 'bg-gray-800 text-white shadow-sm' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-300'
                }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer Area */}
      <div className="p-4 border-t border-gray-800">
        <Link 
          href="/"
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-400 hover:text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          <Settings className="mr-3 h-5 w-5" />
          Volver a Tienda
        </Link>
      </div>
    </div>
  );
}
