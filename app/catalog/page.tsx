'use client'

import { useState, useEffect } from 'react'
import { MayoristaProduct, SearchResult } from '@/lib/types/mayorista'
import { FilterSidebar } from '@/components/FilterSidebar'
import { ProductGrid } from '@/components/ProductGrid'
import { SearchBar } from '@/components/SearchBar'

export default function CatalogPage() {
  const [products, setProducts] = useState<MayoristaProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Fetch products when search or filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams({
          ...(searchQuery && { q: searchQuery }),
          ...filters,
          page: String(page),
          limit: '12',
        })

        const response = await fetch(`/api/mayoristas/search?${params}`)
        const data: SearchResult = await response.json()

        if (!response.ok) {
          throw new Error((data as any).error || 'Search failed')
        }

        setProducts(data.products)
        setTotalPages(Math.ceil(data.total / 12))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    // Debounce search to avoid too many requests
    const timer = setTimeout(fetchProducts, 500)
    return () => clearTimeout(timer)
  }, [searchQuery, filters, page])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPage(1)
  }

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Catálogo de Productos</h1>
              <p className="text-gray-600 mt-1">Explora nuestros productos de mayoristas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white p-6 rounded-lg border border-gray-200">
              <FilterSidebar onFilterChange={handleFilterChange} isLoading={isLoading} />
            </div>
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <ProductGrid products={products} isLoading={isLoading} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1 || isLoading}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Anterior
                </button>
                <div className="flex gap-1">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = i + 1
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-2 rounded-lg ${
                          page === pageNum ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages || isLoading}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
