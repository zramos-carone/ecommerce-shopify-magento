"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Trash2,
  Image as ImageIcon,
  Link as LinkIcon,
  Package,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
};

interface EditProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedProduct: Product) => void;
  onDelete: (id: string) => void;
}

export default function EditProductModal({
  product,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}: EditProductModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "image">("details");

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/inventory/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error al actualizar el producto");

      const result = await response.json();
      onUpdate(result.data);
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.",
      )
    )
      return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/inventory/${product.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar el producto");

      onDelete(product.id);
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al eliminar");
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-black font-outfit uppercase tracking-tighter">
                  Editar Producto
                </h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                  ID: {product.id.slice(-8)}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-50/50 p-2 mx-8 mt-6 rounded-2xl">
              <button
                onClick={() => setActiveTab("details")}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "details" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
              >
                <Package className="w-4 h-4" />
                <span>Detalles Generales</span>
              </button>
              <button
                onClick={() => setActiveTab("image")}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "image" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Imagen y Multimedia</span>
              </button>
            </div>

            {/* Scrollable Form */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <form
                id="edit-product-form"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {activeTab === "details" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Nombre del Producto
                      </label>
                      <input
                        name="name"
                        value={formData.name || ""}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        SKU / Modelo
                      </label>
                      <input
                        name="sku"
                        value={formData.sku || ""}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Categoría
                      </label>
                      <input
                        name="category"
                        value={formData.category || ""}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Precio (MXN)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          step="0.01"
                          name="price"
                          value={formData.price || 0}
                          onChange={handleChange}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 pl-10 text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Stock Actual
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock || 0}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none font-bold"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        URL de la Imagen
                      </label>
                      <div className="relative">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          name="image"
                          value={formData.image || ""}
                          onChange={handleChange}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 pl-10 text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none font-medium"
                        />
                      </div>
                      <p className="text-[9px] text-gray-400 font-bold ml-1">
                        Copia la URL de una imagen externa (Unsplash, Drive,
                        CDN).
                      </p>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 text-center">
                        Previsualización
                      </p>
                      <div className="aspect-square w-full max-w-[240px] mx-auto bg-white rounded-3xl overflow-hidden shadow-xl border border-white ring-4 ring-white/50">
                        {formData.image ? (
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                            <ImageIcon className="w-12 h-12 mb-2" />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              Sin Imagen
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-2xl flex items-start space-x-4 border border-blue-100/50">
                      <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-blue-600 font-bold leading-relaxed uppercase tracking-tighter">
                        CONSEJO ESCALABLE: Actualmente usamos URLs externas. En
                        el futuro, este espacio incluirá un botón de "Subir
                        Archivo" para guardar fotos directamente en tu propio
                        storage dedicado.
                      </p>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Footer Actions */}
            <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between gap-4 sticky bottom-0">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-4 bg-white border border-gray-100 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Eliminar</span>
              </button>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-4 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-gray-900 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  form="edit-product-form"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-10 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black shadow-xl shadow-blue-600/10 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Guardando...</span>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Guardar Cambios</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
