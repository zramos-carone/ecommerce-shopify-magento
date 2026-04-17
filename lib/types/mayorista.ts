// Tipos compartidos para mayoristas
export interface MayoristaProduct {
  id: string;
  sku: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  inStock: boolean;
  category?: string;
  brand?: string;
  rating?: number;
  imageUrl?: string;
  mayorista: "ingram" | "distribuido" | "synnex" | "MAXTECH";
  mayoristSku: string;
  mayoristPrice: number;
}

export interface SearchQuery {
  q?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  minRating?: number;
  page?: number;
  limit?: number;
}

export interface SearchResult {
  products: MayoristaProduct[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  mayoristas: {
    ingram: number;
    distribuido: number;
    synnex: number;
  };
  timestamp: string;
}
