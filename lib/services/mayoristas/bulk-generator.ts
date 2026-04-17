import { MayoristaProduct } from '@/lib/types/mayorista'

// Categorías y marcas para generar variedad
const CATEGORIES = [
  'Laptop',
  'Desktop',
  'GPU',
  'Storage',
  'Memory',
  'Monitor',
  'Accesorios',
  'Procesadores',
  'Motherboards',
]

// Mapeo de imágenes locales y remotas de alta calidad
const CATEGORY_IMAGES: Record<string, string> = {
  Laptop: '/images/cat-laptop.png',
  Desktop: '/images/cat-desktop.png',
  GPU: '/images/cat-gpu.png',
  Monitor: '/images/cat-monitor.png',
  Procesadores: '/images/cat-processor.png',
  Memory: '/images/cat-ram.png',
  // Fallbacks de Unsplash (Alta Resolución) para las categorías sin imagen local
  Storage: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?q=80&w=800&auto=format&fit=crop', // SSD
  Motherboards: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop', // Circuit board
  Accesorios: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop', // Peripherals
}

const BRANDS_BY_CATEGORY: Record<string, string[]> = {
  Laptop: ['Dell', 'Lenovo', 'Apple', 'HP', 'ASUS', 'Acer', 'MSI'],
  Desktop: ['Dell', 'HP', 'Lenovo', 'ASUS', 'Corsair'],
  GPU: ['NVIDIA', 'AMD', 'Intel'],
  Storage: ['Samsung', 'Western Digital', 'Kingston', 'Seagate', 'SanDisk'],
  Memory: ['Corsair', 'Kingston', 'G.Skill', 'SK Hynix'],
  Monitor: ['Dell', 'LG', 'ASUS', 'Samsung', 'BenQ'],
  Accesorios: ['Logitech', 'Razer', 'SteelSeries', 'Corsair'],
  Procesadores: ['Intel', 'AMD'],
  Motherboards: ['ASUS', 'MSI', 'Gigabyte', 'ASRock'],
}

const LAPTOP_MODELS = [
  'XPS 13 Plus',
  'ThinkPad X1 Carbon Gen 12',
  'MacBook Pro 14"',
  'Pavilion 15',
  'VivoBook 14',
  'Swift 3',
  'GE66 Raider',
  'ZenBook 14',
]

const DESCRIPTIONS = [
  'High-performance computing device',
  'Premium build quality',
  'Professional grade equipment',
  'Ideal for creators and developers',
  'Optimized for gaming and streaming',
  'Enterprise-ready solution',
  'Ultrafast performance',
  'Engineered for excellence',
]

/**
 * Genera 1,500 productos ficticios (500 por mayorista)
 * para testing y desarrollo de búsqueda en BD
 */
export function generateBulkProducts(): {
  ingram: MayoristaProduct[]
  distribuido: MayoristaProduct[]
  synnex: MayoristaProduct[]
} {
  const ingram: MayoristaProduct[] = []
  const distribuido: MayoristaProduct[] = []
  const synnex: MayoristaProduct[] = []

  let ingramId = 1
  let distribuidoId = 1
  let synnexId = 1

  // Generar 500 productos por mayorista
  for (let i = 0; i < 500; i++) {
    // INGRAM
    ingram.push(generateProduct(i, 'ingram', ingramId++))

    // DISTRIBUIDO
    distribuido.push(generateProduct(i, 'distribuido', distribuidoId++))

    // SYNNEX
    synnex.push(generateProduct(i, 'synnex', synnexId++))
  }

  return { ingram, distribuido, synnex }
}

function generateProduct(
  index: number,
  mayorista: 'ingram' | 'distribuido' | 'synnex',
  id: number
): MayoristaProduct {
  const category = CATEGORIES[index % CATEGORIES.length]
  const brands = BRANDS_BY_CATEGORY[category] || ['Generic']
  const brand = brands[index % brands.length]
  const description = DESCRIPTIONS[index % DESCRIPTIONS.length]

  // Generar SKU único
  const sku = `${mayorista.substring(0, 3).toUpperCase()}-${category.substring(0, 3).toUpperCase()}-${String(id).padStart(5, '0')}`

  // Generar nombre del producto
  const model =
    index < LAPTOP_MODELS.length ? LAPTOP_MODELS[index] : `${brand} ${category} Model ${id}`
  const name = `${brand} ${model}`

  // Pricing realista por categoría
  const basePrice = getBasePriceForCategory(category)
  const variance = (index % 100) / 100 // 0 to 0.99
  const price = Math.round((basePrice + basePrice * variance) * 100) / 100

  // Mayorista SKU y precio (10-15% descuento mayorista)
  const mayoristDiscount = 0.85 + Math.random() * 0.05
  const mayoristPrice = Math.round(price * mayoristDiscount * 100) / 100

  // Stock realista
  const stock = Math.floor(10 + Math.random() * 200)
  const inStock = stock > 0

  // Rating (4.0 a 5.0)
  const rating = 4.0 + Math.random() * 1.0

  return {
    id: `${mayorista}-${String(id).padStart(4, '0')}`,
    sku,
    name,
    description,
    price,
    stock,
    inStock,
    category,
    brand,
    rating: Math.round(rating * 10) / 10,
    imageUrl: CATEGORY_IMAGES[category] || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800',
    mayorista,
    mayoristSku: `${mayorista.toUpperCase()}-${sku}`,
    mayoristPrice,
  }
}

/**
 * Retorna precio base aproximado por categoría
 */
function getBasePriceForCategory(category: string): number {
  const basePrices: Record<string, number> = {
    Laptop: 800,
    Desktop: 1200,
    GPU: 400,
    Storage: 150,
    Memory: 80,
    Monitor: 300,
    Accesorios: 50,
    Procesadores: 300,
    Motherboards: 200,
  }
  return basePrices[category] || 100
}
