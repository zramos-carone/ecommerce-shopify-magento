import { prisma } from '@/lib/db';
import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  try {
    console.log('[ADMIN_DASHBOARD_START]: Inicia carga de métricas.');

    const [
      totalOrders,
      totalProducts,
      recentOrders
    ] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          orderNumber: true,
          firstName: true,
          lastName: true,
          status: true,
          total: true,
          createdAt: true,
        }
      })
    ]);

    // Calculate total Sales using efficient aggregation
    const salesAggregate = await prisma.order.aggregate({
      where: {
        status: {
          notIn: ['cancelled', 'failed']
        }
      },
      _sum: {
        total: true
      }
    });
    
    const totalSales = salesAggregate._sum.total || 0;

    console.log('[ADMIN_DASHBOARD_SUCCESS]: Datos cargados correctamente.');

    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Resumen General</h2>
          <p className="text-gray-500 mt-1">Métricas clave de las operaciones de la tienda.</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1 relative">
                  <dt className="text-sm font-medium text-gray-500 truncate">Ventas Totales</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    ${totalSales.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </dd>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm text-blue-600 hover:text-blue-900 cursor-pointer">Ver reporte financiero</div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShoppingCart className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1 relative">
                  <dt className="text-sm font-medium text-gray-500 truncate">Órdenes Totales</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{totalOrders}</dd>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-900">
                Ver todas las órdenes
              </Link>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1 relative">
                  <dt className="text-sm font-medium text-gray-500 truncate">Productos en Catálogo</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{totalProducts}</dd>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <Link href="/admin/inventory" className="text-sm text-blue-600 hover:text-blue-900">
                Gestionar inventario
              </Link>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1 relative">
                  <dt className="text-sm font-medium text-gray-500 truncate">Conversión Estimada</dt>
                  <dd className="text-2xl font-semibold text-gray-900">3.2%</dd>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm text-blue-600 hover:text-blue-900 cursor-pointer">Ver analíticas</div>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <h3 className="text-lg leading-6 font-medium text-gray-900 mt-8 mb-4">Órdenes Recientes</h3>
        <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {recentOrders.length === 0 ? (
              <li className="px-6 py-4 text-center text-gray-500">No hay órdenes registradas aún.</li>
            ) : (
              recentOrders.map((order) => (
                <li key={order.id}>
                  <div className="px-4 py-4 flex items-center sm:px-6 hover:bg-gray-50 transition-colors">
                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                      <div className="truncate">
                        <div className="flex text-sm">
                          <p className="font-medium text-blue-600 truncate">{order.orderNumber}</p>
                          <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                            - {order.firstName} {order.lastName}
                          </p>
                        </div>
                        <div className="mt-2 flex">
                          <div className="flex items-center text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()} a las {new Date(order.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                        <div className="flex space-x-4 items-center">
                          <span className="text-sm font-semibold text-gray-900">
                            ${order.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </span>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${order.status === 'completed' || order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
          {recentOrders.length > 0 && (
            <div className="bg-gray-50 px-4 py-3 text-right sm:px-6 border-t border-gray-200">
              <Link href="/admin/orders" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Ver todas las órdenes &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('[ADMIN_DASHBOARD_ERROR]: Fallo crítico cargando el dashboard.', error);
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 max-w-2xl">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error de Conexión en /admin</h2>
          <p className="text-red-600 text-sm mb-4">
            No se pudo establecer conexión con la base de datos de producción. 
            Esto puede deberse a que la variable <strong>DATABASE_URL</strong> no está configurada en Vercel 
            o la base de datos SQLite no está accesible en este entorno.
          </p>
          <div className="text-left bg-gray-900 p-4 rounded text-xs text-green-400 overflow-auto">
            <p className="mb-2 font-bold text-blue-400">// Detalles del Error:</p>
            <code>{error instanceof Error ? error.message : 'Error desconocido'}</code>
            <p className="mt-4 mb-2 font-bold text-blue-400">// Stack Trace (Logs Vercel):</p>
            <p className="text-gray-400 italic">Revisa los logs de Vercel buscando el tag [ADMIN_DASHBOARD_ERROR]</p>
          </div>
        </div>
      </div>
    );
  }
}
