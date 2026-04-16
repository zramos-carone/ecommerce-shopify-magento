import { prisma } from '@/lib/db';
import OrderTable from './components/OrderTable';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  // Fetch orders from database
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      orderNumber: true,
      firstName: true,
      lastName: true,
      email: true,
      status: true,
      paymentStatus: true,
      total: true,
      createdAt: true,
    }
  });

  return (
    <div className="space-y-6">
      <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Órdenes</h2>
          <p className="text-gray-500 mt-1">
            Revisa, actualiza el estado y gestiona los pedidos de los clientes.
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200">
        {/* Usamos un Client Component para manejar la interactividad de la tabla (cambios de status) */}
        <OrderTable initialOrders={orders as any[]} />
      </div>
    </div>
  );
}
