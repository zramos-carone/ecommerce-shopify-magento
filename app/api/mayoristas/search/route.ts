import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { searchAllMayoristas } from '@/lib/services/mayoristas'
import { SearchQuery, MayoristaProduct, SearchResult } from '@/lib/types/mayorista'
import { rateLimiter } from '@/lib/services/rateLimit'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    if (!rateLimiter.isAllowed(ip)) {
      const remaining = rateLimiter.getRemaining(ip)
      return NextResponse.json({ error: 'Too many requests', remaining }, { status: 429 })
    }

    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get('q') || ''
    const category = searchParams.get('category')
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 12

    const query: SearchQuery = {
      q: q || undefined,
      category: category || undefined,
      brand: searchParams.get('brand') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      minStock: searchParams.get('minStock') ? Number(searchParams.get('minStock')) : undefined,
      page,
      limit,
    }

    // --- BÚSQUEDA HÍBRIDA MAXTECH ---
    
    // 1. Ejecutar búsquedas en paralelo (Local + Mayoristas)
    const [localProductsRaw, mayoristaResults] = await Promise.all([
      prisma.product.findMany({
        where: q || category ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { sku: { contains: q, mode: 'insensitive' } },
            category ? { category: { equals: category, mode: 'insensitive' } } : {},
          ]
        } : {},
        take: 20 // Priorizamos los primeros 20 locales
      }),
      searchAllMayoristas(query)
    ]);

    // 2. Convertir productos locales al formato de catálogo
    const localProducts: MayoristaProduct[] = localProductsRaw.map(p => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      price: p.price,
      imageUrl: p.image || '',
      brand: p.brand || 'MaxTech',
      category: p.category || '',
      stock: p.stock,
      inStock: p.stock > 0,
      mayorista: 'MAXTECH', // Identificador de inventario propio
      rating: 5.0,
      description: p.description || ''
    }));

    // 3. Fusión y Deduplicación inteligente
    // Unimos ambos resultados, colocando los locales primero
    let combinedProducts = [...localProducts, ...mayoristaResults.products];
    const seenSkus = new Set<string>();
    const finalProducts: MayoristaProduct[] = [];

    for (const product of combinedProducts) {
      if (!seenSkus.has(product.sku)) {
        seenSkus.add(product.sku);
        
        // Si el producto es de un mayorista pero lo tenemos en DB local (Override),
        // aplicamos los datos locales pero mantenemos el badge de mayorista si queremos
        const localVersion = localProducts.find(lp => lp.sku === product.sku);
        if (localVersion && product.mayorista !== 'MAXTECH') {
          finalProducts.push({
            ...product,
            imageUrl: localVersion.imageUrl || product.imageUrl,
            name: localVersion.name || product.name,
            price: localVersion.price || product.price, // Opcional: Priorizar precio local
          });
        } else {
          finalProducts.push(product);
        }
      }
    }

    // 4. Resultado Final con Metadatos
    const result: SearchResult = {
      ...mayoristaResults,
      products: finalProducts,
      total: Math.max(mayoristaResults.total, finalProducts.length),
      page,
      limit
    };

    console.log(`🔍 [HYBRID_SEARCH] Query: "${q}". Local: ${localProducts.length}, Ext: ${mayoristaResults.products.length}, Final: ${finalProducts.length}`);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'X-RateLimit-Remaining': String(rateLimiter.getRemaining(ip)),
      },
    })
  } catch (error) {
    console.error('[HYBRID_SEARCH_ERROR]', error)
    return NextResponse.json({ error: 'Failed to search products' }, { status: 500 })
  }
}
