import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { searchAllMayoristas } from "@/lib/services/mayoristas";
import { MayoristaProduct, SearchResult } from "@/lib/types/mayorista";
import { rateLimiter } from "@/lib/services/rateLimit";
import { BRAND_CONFIG } from "@/lib/config/branding";

export const dynamic = "force-dynamic";

/**
 * GET /api/mayoristas/search (HYBRID BOUTIQUE EDITION)
 *
 * El catálogo muestra productos de mayoristas EN TIEMPO REAL,
 * pero aplica filtros premium:
 * - ❌ Nunca muestra la foto genérica del mayorista → usa imagen local O placeholder
 * - ❌ Nunca muestra el stock numérico → la UI usa etiquetas ("En Stock", "Últimas unidades")
 * - ❌ Nunca menciona al mayorista al cliente → toda la identidad es dinámica
 * - ✅ Si el admin asignó una foto o nombre local → se usa con prioridad total
 */
export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!rateLimiter.isAllowed(ip)) {
      const remaining = rateLimiter.getRemaining(ip);
      return NextResponse.json(
        { error: "Too many requests", remaining },
        { status: 429 },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category");
    const page = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : 1;
    const limit = searchParams.get("limit")
      ? Number(searchParams.get("limit"))
      : 12;

    const query = {
      q: q || undefined,
      category: category || undefined,
      brand: searchParams.get("brand") || undefined,
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined,
      page,
      limit,
    };

    // 1. Buscar en mayoristas (tiempo real)
    const mayoristaResults = await searchAllMayoristas(query);

    // 2. Obtener todos los overrides locales por SKU
    const skus = mayoristaResults.products.map((p) => p.sku);
    const localOverrides =
      skus.length > 0
        ? await prisma.product.findMany({
            where: { sku: { in: skus } },
            select: {
              sku: true,
              name: true,
              image: true,
              price: true,
              brand: true,
            },
          })
        : [];

    const overridesMap = new Map(localOverrides.map((o) => [o.sku, o]));

    // 3. Aplicar FILTROS PREMIUM antes de enviar al cliente
    const products: MayoristaProduct[] = mayoristaResults.products.map(
      (product) => {
        const local = overridesMap.get(product.sku);

        // Imagen: Si el modo híbrido está activo, usar la del mayorista como fallback
        // Si no, solo usar si el admin la aprobó localmente.
        const approvedImage =
          local?.image ||
          (BRAND_CONFIG.allowMayoristaImages ? product.imageUrl : "");

        return {
          ...product,
          // Contenido: priorizar datos locales
          name: local?.name || product.name,
          brand: local?.brand || product.brand,
          price: local?.price || product.price,
          // Imagen controlada por el modo de la tienda
          imageUrl: approvedImage,
          // Identidad unificada de la tienda
          mayorista: BRAND_CONFIG.identityName,
        };
      },
    );

    console.log(
      `💎 [BOUTIQUE_HYBRID] Query: "${q}". Total: ${products.length}. Con imagen: ${products.filter((p) => p.imageUrl).length}`,
    );

    const result: SearchResult = {
      ...mayoristaResults,
      products,
    };

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "X-RateLimit-Remaining": String(rateLimiter.getRemaining(ip)),
      },
    });
  } catch (error) {
    console.error("[BOUTIQUE_HYBRID_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 },
    );
  }
}
