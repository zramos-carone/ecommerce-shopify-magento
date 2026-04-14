'use client'

import { useState } from 'react'
import { SearchQuery } from '@/lib/types/mayorista'

interface FilterSidebarProps {
  onFilterChange: (filters: Partial<SearchQuery>) => void
  isLoading?: boolean
}

const CATEGORIES = [
  'Laptop',
  'GPU',
  'Storage',
  'CPU',
  'RAM',
  'Power Supply',
  'Peripherals',
  'Display',
  'Audio',
  'Accessories',
]
const BRANDS = ['Dell', 'Lenovo', 'Apple', 'HP', 'ASUS', 'Intel', 'NVIDIA', 'Samsung', 'Corsair', 'Kingston']

export function FilterSidebar({ onFilterChange, isLoading = false }: FilterSidebarProps) {
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(3000)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)

  const handlePriceChange = (min: number, max: number) => {
    setMinPrice(min)
    setMaxPrice(max)
    onFilterChange({ minPrice: min, maxPrice: max })
  }

  const handleCategoryChange = (category: string) => {
    const newCategory = selectedCategory === category ? null : category
    setSelectedCategory(newCategory)
    onFilterChange({ category: newCategory || undefined })
  }

  const handleBrandChange = (brand: string) => {
    const newBrand = selectedBrand === brand ? null : brand
    setSelectedBrand(newBrand)
    onFilterChange({ brand: newBrand || undefined })
  }

  return (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rango de Precio</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">Mínimo: ${minPrice}</label>
            <input
              type="range"
              min="0"
              max="3000"
              step="100"
              value={minPrice}
              onChange={(e) => handlePriceChange(Number(e.target.value), maxPrice)}
              disabled={isLoading}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Máximo: ${maxPrice}</label>
            <input
              type="range"
              min="0"
              max="3000"
              step="100"
              value={maxPrice}
              onChange={(e) => handlePriceChange(minPrice, Number(e.target.value))}
              disabled={isLoading}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categoría</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {CATEGORIES.map((category) => (
            <label key={category} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategory === category}
                onChange={() => handleCategoryChange(category)}
                disabled={isLoading}
                className="rounded"
              />
              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Marca</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {BRANDS.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBrand === brand}
                onChange={() => handleBrandChange(brand)}
                disabled={isLoading}
                className="rounded"
              />
              <span className="text-sm text-gray-700">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Stock Filter */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            onChange={(e) => onFilterChange({ minStock: e.target.checked ? 1 : undefined })}
            disabled={isLoading}
            className="rounded"
          />
          <span className="text-sm text-gray-700">En stock</span>
        </label>
      </div>
    </div>
  )
}
