import { MayoristaProduct, SearchQuery } from "@/lib/types/mayorista";

const SYNNEX_PRODUCTS: MayoristaProduct[] = [
  {
    id: "syn-001",
    sku: "RAZER-BLADE-15",
    name: "Razer Blade 15 - RTX 4080",
    description: "Gaming laptop ultrafino con RTX 4080",
    price: 2999.99,
    stock: 12,
    inStock: true,
    category: "Laptop",
    brand: "Razer",
    rating: 4.8,
    mayorista: "synnex",
    mayoristSku: "SYN-RAZR-BLADE15",
    mayoristPrice: 2899.99,
    imageUrl:
      "https://images.unsplash.com/photo-1593642634315-48f541e24a64?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "syn-002",
    sku: "LOGITECH-MX-MASTER",
    name: "Logitech MX Master 3S",
    description: "Ratón profesional multi-dispositivo",
    price: 99.99,
    stock: 234,
    inStock: true,
    category: "Peripherals",
    brand: "Logitech",
    rating: 4.6,
    mayorista: "synnex",
    mayoristSku: "SYN-LOG-MXM3S",
    mayoristPrice: 79.99,
    imageUrl:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "syn-003",
    sku: "SAMSUNG-OLED-55",
    name: 'Samsung 55" OLED 4K TV',
    description: "Monitor/TV OLED 4K para profesionales",
    price: 1299.99,
    stock: 18,
    inStock: true,
    category: "Display",
    brand: "Samsung",
    rating: 4.7,
    mayorista: "synnex",
    mayoristSku: "SYN-SAM-OLED55",
    mayoristPrice: 1199.99,
    imageUrl:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "syn-004",
    sku: "SONOS-ARC",
    name: "Sonos Arc - Soundbar WiFi",
    description: "Soundbar WiFi con Dolby Atmos",
    price: 799.99,
    stock: 45,
    inStock: true,
    category: "Audio",
    brand: "Sonos",
    rating: 4.5,
    mayorista: "synnex",
    mayoristSku: "SYN-SON-ARC",
    mayoristPrice: 699.99,
    imageUrl:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "syn-005",
    sku: "BELKIN-USB-HUB",
    name: "Belkin 7-in-1 USB-C Hub",
    description: "Hub USB-C con múltiples puertos",
    price: 149.99,
    stock: 178,
    inStock: true,
    category: "Accessories",
    brand: "Belkin",
    rating: 4.4,
    mayorista: "synnex",
    mayoristSku: "SYN-BLK-HUB7",
    mayoristPrice: 119.99,
    imageUrl:
      "https://images.unsplash.com/photo-1625842268584-8f3bf9ff16a0?auto=format&fit=crop&q=80&w=800",
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

export async function searchSynnex(
  query: SearchQuery,
): Promise<MayoristaProduct[]> {
  return applyFilters(SYNNEX_PRODUCTS, query);
}

export async function syncSynnex(): Promise<number> {
  console.log(`[SYNNEX] Synced ${SYNNEX_PRODUCTS.length} products`);
  return SYNNEX_PRODUCTS.length;
}

export function getSynnexProducts(): MayoristaProduct[] {
  return SYNNEX_PRODUCTS;
}
