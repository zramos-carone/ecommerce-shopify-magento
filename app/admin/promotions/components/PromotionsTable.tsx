'use client';

import { useState } from 'react';
import { Trash2, CheckCircle, XCircle } from 'lucide-react';

type Promotion = {
  id: string;
  code: string;
  discountPercent: number;
  active: boolean;
  createdAt: string;
};

export default function PromotionsTable({ initialPromotions }: { initialPromotions: Promotion[] }) {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  
  // States para el formulario de creación
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || newDiscount === '' || newDiscount <= 0 || newDiscount > 100) {
      alert("Introduce un código válido y un descuento entre 1% y 100%");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCode,
          discountPercent: Number(newDiscount),
        })
      });
      const json = await res.json();
      
      if (json.success) {
        setPromotions([json.data, ...promotions]);
        setNewCode('');
        setNewDiscount('');
      } else {
        alert(json.error || 'Error creando promoción');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/promotions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentStatus })
      });
      const json = await res.json();
      if (json.success) {
        setPromotions(proms => proms.map(p => p.id === id ? { ...p, active: !currentStatus } : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este código promocional?')) return;
    try {
      const res = await fetch(`/api/admin/promotions/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setPromotions(proms => proms.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* Formulario rápido superior */}
      <div className="p-6 border-b border-gray-200 bg-gray-50/50">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Nuevo Descuento</h3>
        <form onSubmit={handleCreate} className="flex gap-4 items-end flex-wrap">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Código Promocional</label>
            <input 
              type="text" 
              placeholder="VERANO20" 
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase"
              value={newCode}
              onChange={e => setNewCode(e.target.value.toUpperCase())}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Descuento (%)</label>
            <input 
              type="number" 
              min="1" 
              max="100" 
              placeholder="20" 
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-24"
              value={newDiscount}
              onChange={e => setNewDiscount(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando...' : 'Crear Código'}
          </button>
        </form>
      </div>

      {/* Tabla Listado */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descuento</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Creación</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {promotions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                  No hay cupones registrados.
                </td>
              </tr>
            ) : (
              promotions.map((promo) => (
                <tr key={promo.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 font-mono">
                    {promo.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    -{promo.discountPercent}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => toggleActive(promo.id, promo.active)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        promo.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {promo.active ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                      {promo.active ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(promo.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleDelete(promo.id)}
                      className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-md transition"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
