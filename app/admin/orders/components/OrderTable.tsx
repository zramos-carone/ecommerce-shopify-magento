'use client';

import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Package, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type OrderItem = {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
};

type Order = {
  id: string;
  orderNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
};

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente', color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
  { value: 'processing', label: 'Procesando', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { value: 'shipped', label: 'Enviado', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  { value: 'delivered', label: 'Entregado', color: 'bg-green-50 text-green-600 border-green-100' },
  { value: 'cancelled', label: 'Cancelado', color: 'bg-red-50 text-red-600 border-red-100' },
];

export default function OrderTable({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');
      const updatedOrder = await response.json();
      
      setOrders(currentOrders => 
        currentOrders.map(order => 
          order.id === orderId ? { ...order, status: updatedOrder.status } : order
        )
      );
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Hubo un error al actualizar el estado.');
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleRow = (orderId: string) => {
    setExpandedRow(expandedRow === orderId ? null : orderId);
  };

  return (
    <div className="w-full">
      {/* Search Header */}
      <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por ID, nombre o email..."
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-600 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
          <Clock className="w-3 h-3" />
          <span>Última actualización: hace 1 min</span>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Orden</th>
              <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Cliente</th>
              <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Fecha</th>
              <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total</th>
              <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Estado</th>
              <th className="px-10 py-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-10 py-20 text-center">
                  <Package className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                  <p className="text-sm font-black text-gray-400 uppercase tracking-widest leading-none">Cero Resultados</p>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <motion.tr 
                    layout
                    className={`group hover:bg-gray-50/80 transition-all cursor-pointer ${expandedRow === order.id ? 'bg-blue-50/20' : ''}`}
                    onClick={() => toggleRow(order.id)}
                  >
                    <td className="px-10 py-7">
                      <div className="flex flex-col">
                        <span className="text-sm font-black font-outfit text-blue-600 group-hover:underline">{order.orderNumber}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">ID: {order.id.slice(-8)}</span>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-black text-xs uppercase">
                          {order.firstName[0]}{order.lastName[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900 leading-tight">{order.firstName} {order.lastName}</span>
                          <span className="text-[10px] text-gray-400 font-medium">{order.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 leading-tight">{new Date(order.createdAt).toLocaleDateString()}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{new Date(order.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <span className="text-base font-black font-outfit text-gray-900 tracking-tighter">
                        ${order.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-10 py-7">
                      <select
                        onClick={(e) => e.stopPropagation()}
                        className={`block w-full px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border-none focus:ring-2 focus:ring-blue-600 cursor-pointer shadow-sm
                          ${STATUS_OPTIONS.find(o => o.value === order.status)?.color}
                          ${updatingId === order.id ? 'opacity-30' : ''}`}
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-10 py-7 text-right">
                      {expandedRow === order.id ? <ChevronUp className="w-5 h-5 text-gray-300" /> : <ChevronDown className="w-5 h-5 text-gray-300" />}
                    </td>
                  </motion.tr>
                  
                  {/* Expanded Content */}
                  <AnimatePresence>
                    {expandedRow === order.id && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50/50"
                      >
                        <td colSpan={6} className="px-10 py-10">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {/* Column 1: Items */}
                            <div className="md:col-span-2 space-y-4">
                              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Contenido del Pedido</h4>
                              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
                                {order.items.map((item) => (
                                  <div key={item.id} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center"><Package className="w-5 h-5 text-gray-300" /></div>
                                      <div>
                                        <p className="text-xs font-bold text-gray-900">{item.productName}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Qty: {item.quantity} × ${item.price.toLocaleString()}</p>
                                      </div>
                                    </div>
                                    <div className="text-sm font-black font-outfit text-gray-900">${item.subtotal.toLocaleString()}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Column 2: Logistics Info */}
                            <div className="space-y-6">
                              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Datos de Entrega</h4>
                              <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                  <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                                  <div className="text-xs font-bold text-gray-600 leading-relaxed uppercase tracking-tighter">
                                    {order.address}<br />
                                    {order.city}, CP {order.postalCode}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Phone className="w-4 h-4 text-blue-600" />
                                  <div className="text-xs font-bold text-gray-600">{order.phone}</div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Mail className="w-4 h-4 text-blue-600" />
                                  <div className="text-xs font-bold text-gray-600">{order.email}</div>
                                </div>
                              </div>
                              <button className="w-full mt-4 py-3 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center space-x-2">
                                <ExternalLink className="w-3 h-3" />
                                <span>Ver Recibo Digital</span>
                              </button>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
