import { prisma } from '@/lib/db';
import InventoryTable from './components/InventoryTable';

export const dynamic = 'force-dynamic';

export default async function AdminInventoryPage() {
  // Fetch initial products
  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' },
    take: 100, // Load first 100 initially to optimize the render
    select: {
      id: true,
      name: true,
      sku: true,
      price: true,
      stock: true,
      category: true,
    }
  });

  return (
    <div className="space-y-6">
      <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestor de Inventario</h2>
          <p className="text-gray-500 mt-1">
            Visualiza y ajusta el stock de tus productos.
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200">
        <InventoryTable initialProducts={products as any[]} />
      </div>
    </div>
  );
}
