import { prisma } from "@/lib/db";
import OrderTable from "./components/OrderTable";
import { BRAND_CONFIG } from "@/lib/config/branding";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  // Fetch orders from database with items included
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  });

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between items-start gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">
              {BRAND_CONFIG.shortName}
              {BRAND_CONFIG.accentName} Logistics
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 font-outfit uppercase tracking-tighter leading-none">
            GESTIÓN DE <span className="text-blue-600">ÓRDENES</span>
          </h1>
          <p className="text-gray-400 font-medium mt-2">
            Supervisa, actualiza y despacha los pedidos de tus clientes.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        {/* Componente Cliente para la interactividad de la tabla */}
        <OrderTable initialOrders={orders as any[]} />
      </div>
    </div>
  );
}
