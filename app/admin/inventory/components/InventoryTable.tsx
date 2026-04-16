'use client';

import { useState, useEffect } from 'react';

type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
};

export default function InventoryTable({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Implement debounced search against /api/admin/inventory if desired
  // For a localized quick-filter MVP, we just filter the loaded items.
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStockAdjustment = async (productId: string, adjustment: number) => {
    setUpdatingId(productId);
    try {
      const response = await fetch(`/api/admin/inventory`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ productId, stockAdjustment: adjustment }]),
      });

      if (!response.ok) {
        throw new Error('Failed to update stock');
      }

      const result = await response.json();
      
      if (result.success && result.results[0]?.success) {
        setProducts(currentProducts => 
          currentProducts.map(prod => 
            prod.id === productId ? { ...prod, stock: result.results[0].newStock } : prod
          )
        );
      } else {
        alert(result.results[0]?.error || 'Error al actualizar inventario');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Hubo un error de conexión al actualizar el stock.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Buscar por nombre o SKU..."
          className="w-full sm:max-w-xs px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                  No se encontraron productos coincidentes.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-sm truncate" title={product.name}>
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${product.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => handleStockAdjustment(product.id, -1)}
                        disabled={product.stock <= 0 || updatingId === product.id}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                       -
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {updatingId === product.id ? '...' : product.stock}
                      </span>
                      <button 
                        onClick={() => handleStockAdjustment(product.id, 1)}
                        disabled={updatingId === product.id}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 disabled:opacity-50 transition-colors"
                      >
                       +
                      </button>
                    </div>
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
