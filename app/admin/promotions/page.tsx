import { prisma } from '@/lib/db';
import PromotionsTable from './components/PromotionsTable';

export const dynamic = 'force-dynamic';

export default async function AdminPromotionsPage() {
  const promotions = await prisma.promotion.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="mb-6 flex justify-between items-center sm:flex-row flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestor de Promociones</h2>
          <p className="text-gray-500 mt-1">
            Crea códigos de descuento aplicables al carrito de compras.
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200">
        <PromotionsTable initialPromotions={promotions as any[]} />
      </div>
    </div>
  );
}
