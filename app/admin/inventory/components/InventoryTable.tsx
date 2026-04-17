'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Edit3, 
  Package, 
  Tag, 
  Image as ImageIcon,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EditProductModal from './EditProductModal';

type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
};

export default function InventoryTable({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdate = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDelete = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleQuickStockAdjustment = async (e: React.MouseEvent, productId: string, adjustment: number) => {
    e.stopPropagation();
    setUpdatingId(productId);
    try {
      // Usamos el nuevo endpoint individual para consistencia o el bulk actual
      // Para velocidad aquí, usamos el ajuste rápido
      const response = await fetch(`/api/admin/inventory`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([{ productId, stockAdjustment: adjustment }]),
      });

      if (!response.ok) throw new Error('Error al actualizar stock');
      const result = await response.json();
      
      if (result.success && result.results[0]?.success) {
        setProducts(prev => 
          prev.map(p => p.id === productId ? { ...p, stock: result.results[0].newStock } : p)
        );
      }
    } catch (error) {
      alert('Error al ajustar stock');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="w-full">
      {/* Search Header */}
      <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-600 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-3">
           <button className="flex items-center space-x-2 px-6 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-black/5 active:scale-95">
             <Plus className="w-4 h-4" />
             <span>Nuevo Producto</span>
           </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Producto</th>
              <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Categoría</th>
              <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Precio</th>
              <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Inventario</th>
              <th className="px-10 py-6 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-10 py-20 text-center text-gray-300">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="text-xs font-black uppercase tracking-[0.2em]">Sin coincidencias</p>
                </td>
              </tr>
            ) : (
              filteredProducts.map((product, idx) => (
                <motion.tr 
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedProduct(product)}
                  className="group hover:bg-gray-50/80 transition-all cursor-pointer"
                >
                  <td className="px-10 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 line-clamp-1">{product.name}</span>
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{product.sku}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center space-x-2">
                       <Tag className="w-3 h-3 text-gray-300" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">{product.category || 'General'}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-sm font-black font-outfit text-gray-900 tracking-tighter">
                      ${product.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center space-x-3">
                       <button 
                        onClick={(e) => handleQuickStockAdjustment(e, product.id, -1)}
                        disabled={product.stock <= 0 || updatingId === product.id}
                        className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-30"
                      >
                         <Minus className="w-3 h-3" />
                       </button>
                       <span className="w-10 text-center text-sm font-black font-outfit">
                         {updatingId === product.id ? '...' : product.stock}
                       </span>
                       <button 
                        onClick={(e) => handleQuickStockAdjustment(e, product.id, 1)}
                        disabled={updatingId === product.id}
                        className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
                      >
                         <Plus className="w-3 h-3" />
                       </button>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Editor Modal */}
      {selectedProduct && (
        <EditProductModal 
          isOpen={!!selectedProduct}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
