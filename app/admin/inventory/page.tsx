import { prisma } from '@/lib/db';
import InventoryTable from './components/InventoryTable';

export const dynamic = 'force-dynamic';

export default async function AdminInventoryPage() {
  // Fetch initial products with all necessary fields
  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' },
    take: 100, 
    select: {
      id: true,
      name: true,
      sku: true,
      price: true,
      stock: true,
      category: true,
      image: true
    }
  });

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between items-start gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Gestión de Activos</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 font-outfit uppercase tracking-tighter leading-none">
            CONTROL DE <span className="text-blue-600">INVENTARIO</span>
          </h1>
          <p className="text-gray-400 font-medium mt-2">Monitorea niveles de stock, actualiza precios y gestiona la visualización de tus productos.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <InventoryTable initialProducts={products as any[]} />
      </div>
    </div>
  );
}
