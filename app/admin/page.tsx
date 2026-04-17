'use client';

import React, { useEffect, useState } from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  ArrowRight,
  Zap,
  Clock,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/admin/stats');
        if (!response.ok) throw new Error('Error al cargar estadísticas');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fallo de conexión');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-8 rounded-[2rem] text-center max-w-xl mx-auto my-20">
        <h2 className="text-xl font-black font-outfit uppercase mb-4">Error de Conexión</h2>
        <p className="text-sm opacity-80 mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest">Reintentar</button>
      </div>
    );
  }

  const { totalOrders, totalProducts, totalSales, recentOrders } = data;

  return (
    <div className="space-y-10 pb-20">
      
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between items-start gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Sistema Operativo MaxTech</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 font-outfit uppercase tracking-tighter leading-none">
            CENTRO DE <span className="text-blue-600">COMANDO</span>
          </h1>
          <p className="text-gray-400 font-medium mt-2">Bienvenido, Admin. Todo el sistema está operando al 100%.</p>
        </div>
        <div className="flex bg-white rounded-2xl p-2 border border-gray-100 shadow-sm sm:w-auto w-full">
          <div className="px-6 py-2 border-r border-gray-50 text-center">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Status</p>
            <p className="text-[11px] font-black text-green-600 uppercase tracking-tighter">Online</p>
          </div>
          <div className="px-6 py-2 text-center">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Uptime</p>
            <p className="text-[11px] font-black text-gray-900 uppercase tracking-tighter">99.9%</p>
          </div>
        </div>
      </section>

      {/* Metrics Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric Card 1 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm group hover:shadow-xl hover:shadow-blue-500/5 transition-all"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors rotate-3 group-hover:rotate-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Ventas Totales</p>
          <h3 className="text-3xl font-black text-gray-900 font-outfit tracking-tighter leading-none">
            ${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h3>
          <div className="mt-6 flex items-center text-[10px] font-bold text-blue-600 uppercase tracking-widest group-hover:translate-x-1 transition-transform cursor-pointer">
            <span>Ver Reporte</span>
            <ChevronRight className="w-3 h-3 ml-1" />
          </div>
        </motion.div>

        {/* Metric Card 2 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm group hover:shadow-xl hover:shadow-black/5 transition-all"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 group-hover:bg-black group-hover:text-white transition-colors -rotate-3 group-hover:rotate-0">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <span className="bg-gray-100 text-[10px] font-black px-2 py-1 rounded-lg">New +2</span>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Órdenes Activas</p>
          <h3 className="text-3xl font-black text-gray-900 font-outfit tracking-tighter leading-none">{totalOrders}</h3>
          <Link href="/admin/orders" className="mt-6 flex items-center text-[10px] font-bold text-gray-900 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
            <span>Gestionar</span>
            <ChevronRight className="w-3 h-3 ml-1" />
          </Link>
        </motion.div>

        {/* Metric Card 3 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm group"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Package className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Stock de Catálogo</p>
          <h3 className="text-3xl font-black text-gray-900 font-outfit tracking-tighter leading-none">{totalProducts}</h3>
          <p className="mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sincronización OK</p>
        </motion.div>

        {/* Metric Card 4 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-blue-600 rounded-[2.5rem] p-8 shadow-xl shadow-blue-600/20 text-white group"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" fill="white" />
            </div>
          </div>
          <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-1">Promedio de Orden</p>
          <h3 className="text-3xl font-black font-outfit tracking-tighter leading-none">
            ${(totalSales / (totalOrders || 1)).toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </h3>
          <p className="mt-6 text-[10px] font-bold text-blue-200 uppercase tracking-widest">Optimización de Precio</p>
        </motion.div>
      </section>

      {/* Recent Orders Section */}
      <section>
        <div className="flex items-center justify-between mb-8 px-4">
          <div className="flex items-center space-x-3">
             <Clock className="w-5 h-5 text-gray-400" />
            <h3 className="text-xl font-black font-outfit uppercase tracking-tighter">Órdenes de Hoy</h3>
          </div>
          <Link href="/admin/orders" className="text-xs font-black uppercase text-blue-600 hover:text-black tracking-widest flex items-center transition-colors">
            <span>Panel Completo</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">ID Orden</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Cliente</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-10 py-6 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-12 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">No hay actividad reciente detectada</td>
                  </tr>
                ) : (
                  recentOrders.map((order: any, idx: number) => (
                    <motion.tr 
                      key={order.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="group hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-10 py-6">
                        <span className="text-sm font-black font-outfit text-blue-600 group-hover:underline cursor-pointer">{order.orderNumber}</span>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">{order.firstName} {order.lastName}</span>
                          <span className="text-[10px] text-gray-400 font-medium">Hace 2 horas</span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className="text-sm font-black font-outfit text-gray-900">${order.total.toLocaleString()}</span>
                      </td>
                      <td className="px-10 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border
                          ${order.status === 'pending' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' : 
                            order.status === 'delivered' ? 'bg-green-50 text-green-600 border-green-100' : 
                            'bg-blue-50 text-blue-600 border-blue-100'}
                        `}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 hover:bg-blue-600 hover:text-white transition-all">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
}
