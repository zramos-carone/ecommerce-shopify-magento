import { MayoristaProduct, SearchQuery } from "@/lib/types/mayorista";

const DISTRIBUIDO_PRODUCTS: MayoristaProduct[] = [
  {
    id: "dist-001",
    sku: "HP-PAVILION-15",
    name: "HP Pavilion 15 - Ryzen 5 7520U",
    description: "Laptop balanceada para estudiantes",
    price: 599.99,
    stock: 67,
    inStock: true,
    category: "Laptop",
    brand: "HP",
    rating: 4.3,
    mayorista: "distribuido",
    mayoristSku: "DIST-HP-PAV15",
    mayoristPrice: 549.99,
    imageUrl:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "dist-002",
    sku: "ASUS-ROG-STRIX",
    name: "ASUS ROG Strix G16 - RTX 4070",
    description: "Gaming laptop de alto rendimiento",
    price: 1799.99,
    stock: 23,
    inStock: true,
    category: "Laptop",
    brand: "ASUS",
    rating: 4.7,
    mayorista: "distribuido",
    mayoristSku: "DIST-ASUS-ROG",
    mayoristPrice: 1699.99,
    imageUrl:
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "dist-003",
    sku: "INTEL-CORE-I9",
    name: "Intel Core i9-13900K - LGA1700",
    description: "Procesador flagship para gaming/workstation",
    price: 599.99,
    stock: 41,
    inStock: true,
    category: "CPU",
    brand: "Intel",
    rating: 4.6,
    mayorista: "distribuido",
    mayoristSku: "DIST-INTEL-I9",
    mayoristPrice: 549.99,
    imageUrl:
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "dist-004",
    sku: "KINGSTON-DDR5",
    name: "Kingston DDR5 32GB (2x16) 6000MHz",
    description: "Memoria RAM DDR5 de alto rendimiento",
    price: 149.99,
    stock: 156,
    inStock: true,
    category: "RAM",
    brand: "Kingston",
    rating: 4.4,
    mayorista: "distribuido",
    mayoristSku: "DIST-KING-DDR5",
    mayoristPrice: 129.99,
    imageUrl:
      "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "dist-005",
    sku: "CORSAIR-RM850X",
    name: "Corsair RM850x 850W 80+ Gold",
    description: "Fuente modular para gaming/workstation",
    price: 119.99,
    stock: 87,
    inStock: true,
    category: "Power Supply",
    brand: "Corsair",
    rating: 4.5,
    mayorista: "distribuido",
    mayoristSku: "DIST-CORS-RM850",
    mayoristPrice: 99.99,
    imageUrl:
      "https://images.unsplash.com/photo-1587202371725-5758210fc286?auto=format&fit=crop&q=80&w=800",
  },
];

function applyFilters(
  products: MayoristaProduct[],
  query: SearchQuery,
): MayoristaProduct[] {
  return products.filter((product) => {
    // Text search
    if (query.q) {
      const q = query.q.toLowerCase();
      const matchesText =
        product.name.toLowerCase().includes(q) ||
        product.description?.toLowerCase().includes(q) ||
        product.brand?.toLowerCase().includes(q);
      if (!matchesText) return false;
    }

    // Category filter
    if (
      query.category &&
      !product.category?.toLowerCase().includes(query.category.toLowerCase())
    ) {
      return false;
    }

    // Brand filter
    if (
      query.brand &&
      product.brand?.toLowerCase() !== query.brand.toLowerCase()
    ) {
      return false;
    }

    // Price range
    if (query.minPrice !== undefined && product.price < query.minPrice) {
      return false;
    }
    if (query.maxPrice !== undefined && product.price > query.maxPrice) {
      return false;
    }

    // Stock filter
    const minStockRequired = query.minStock ?? 1;
    if (product.stock < minStockRequired) {
      return false;
    }

    // Rating filter
    if (
      query.minRating &&
      (!product.rating || product.rating < query.minRating)
    ) {
      return false;
    }

    return true;
  });
}

export async function searchDistribuido(
  query: SearchQuery,
): Promise<MayoristaProduct[]> {
  return applyFilters(DISTRIBUIDO_PRODUCTS, query);
}

export async function syncDistribuido(): Promise<number> {
  console.log(`[DISTRIBUIDO] Synced ${DISTRIBUIDO_PRODUCTS.length} products`);
  return DISTRIBUIDO_PRODUCTS.length;
}

export function getDistribuidoProducts(): MayoristaProduct[] {
  return DISTRIBUIDO_PRODUCTS;
}
