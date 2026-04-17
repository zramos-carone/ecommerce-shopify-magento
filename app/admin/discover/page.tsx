'use client';

import React, { useState } from 'react';
import { Search, Plus, Filter, Globe, Package, Check, Loader2, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type MayoristaProduct = {
  id: string;
  sku: string;
  name: string;
  price: number;
  imageUrl: string;
  brand?: string;
  category?: string;
  stock: number;
  mayorista: string;
};

export default function DiscoveryHub() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<MayoristaProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [importingId, setImportingId] = useState<string | null>(null);
  const [importedSkus, setImportedSkus] = useState<Set<string>>(new Set());

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(`/api/mayoristas/search?q=${encodeURIComponent(searchTerm)}&limit=20`);
      const data = await response.json();
      setResults(data.products || []);
    } catch (error) {
      console.error('Error searching mayoristas:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleImport = async (product: MayoristaProduct) => {
    setImportingId(product.sku);
    try {
      const response = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: product.sku,
          name: product.name,
          price: product.price,
          stock: product.stock,
          category: product.category,
          image: product.imageUrl,
          brand: product.brand,
          description: `Importado de ${product.mayorista}`
        }),
      });

      if (response.ok) {
        setImportedSkus(prev => new Set(prev).add(product.sku));
      } else {
        throw new Error('Explosión al importar');
      }
    } catch (error) {
      alert('Error al importar el producto.');
    } finally {
      setImportingId(null);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between items-start gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></span>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Red Global de Mayoristas</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 font-outfit uppercase tracking-tighter leading-none">
            HUB DE <span className="text-blue-600">DESCUBRIMIENTO</span>
          </h1>
          <p className="text-gray-400 font-medium mt-2 max-w-2xl">
            Explora millones de productos en stock real. Selecciona los que quieras para tu catálogo local y personalízalos.
          </p>
        </div>
      </div>

      {/* Search Bar Bar */}
      <div className="sticky top-2 z-20">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-x-0 -bottom-2 bg-blue-600/10 blur-xl h-20 rounded-[3rem] group-focus-within:bg-blue-600/20 transition-all opacity-0 group-focus-within:opacity-100"></div>
          <div className="relative bg-white border border-gray-100 shadow-2xl rounded-[2.5rem] p-4 flex items-center">
            <Globe className="w-6 h-6 text-blue-600 ml-4 animate-spin-slow" />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ej: RTX 4090, Intel i9, Monitor Gaming..." 
              className="flex-1 bg-transparent border-none outline-none px-6 text-lg font-bold text-gray-800 placeholder:text-gray-300"
            />
            <button 
              type="submit"
              disabled={isSearching}
              className="bg-black text-white px-10 py-5 rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-black/10 flex items-center space-x-2 active:scale-95 disabled:opacity-50"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{isSearching ? 'Rastreando...' : 'Buscar Global'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {results.map((product, idx) => (
            <motion.div
              key={product.sku}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-white rounded-[2.5rem] border border-gray-100 p-6 hover:shadow-2xl hover:border-blue-100 transition-all duration-500 relative flex flex-col h-full"
            >
              <div className="absolute top-4 right-4 bg-gray-50 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 z-10">
                {product.mayorista}
              </div>

              <div className="aspect-square bg-gray-50 rounded-[2rem] overflow-hidden mb-6 relative">
                 {product.imageUrl ? (
                   <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-gray-200"><ImageIcon className="w-12 h-12" /></div>
                 )}
              </div>

              <div className="flex-1 flex flex-col">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">{product.brand || 'Varios'}</span>
                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight h-10">{product.name}</h3>
                <div className="mt-4 flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Precio Costo</span>
                      <span className="text-lg font-black font-outfit text-gray-900">${product.price.toLocaleString()}</span>
                   </div>
                   <div className="flex flex-col text-right">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Stock Global</span>
                      <span className="text-sm font-bold text-gray-700">{product.stock} un.</span>
                   </div>
                </div>
              </div>

              <div className="mt-8">
                {importedSkus.has(product.sku) ? (
                   <div className="w-full py-4 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center space-x-2 border border-green-100 animate-pulse">
                      <Check className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">En tu Tienda</span>
                   </div>
                ) : (
                  <button 
                    onClick={() => handleImport(product)}
                    disabled={importingId === product.sku}
                    className="w-full py-5 bg-gray-50 text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
                  >
                    {importingId === product.sku ? (
                       <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    <span>{importingId === product.sku ? 'Importando...' : 'Importar a Catálogo'}</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {results.length === 0 && !isSearching && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-[3rem]">
             <Globe className="w-16 h-16 text-gray-100 mx-auto mb-6" />
             <p className="text-lg font-black text-gray-300 uppercase tracking-widest">Inicia una búsqueda global</p>
             <p className="text-sm text-gray-400 font-medium">Conecta con todos los mayoristas de MaxTech</p>
          </div>
        )}
      </div>
    </div>
  );
}
