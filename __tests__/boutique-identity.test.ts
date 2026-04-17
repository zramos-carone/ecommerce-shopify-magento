import { GET } from "@/app/api/mayoristas/search/route";
import { NextRequest } from "next/server";
import { searchAllMayoristas } from "@/lib/services/mayoristas";
import { prisma } from "@/lib/db";

// Mock de las dependencias
jest.mock("@/lib/services/mayoristas");
jest.mock("@/lib/db", () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
    },
  },
}));
jest.mock("@/lib/services/rateLimit", () => ({
  rateLimiter: {
    isAllowed: () => true,
    getRemaining: () => 100,
  },
}));

describe("API Search - Boutique Transformation logic", () => {
  const mockProduct = {
    id: "prod_123",
    sku: "SKU-RTX-4090",
    name: "Generic RTX 4090",
    brand: "NVIDIA",
    price: 1500,
    stock: 10,
    mayorista: "ingram",
    imageUrl: "http://ingram.com/ugly-photo.jpg",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should transform mayorista identity to MAXTECH and apply local overrides", async () => {
    // 1. Mock de respuesta del mayorista
    (searchAllMayoristas as jest.Mock).mockResolvedValue({
      products: [mockProduct],
      total: 1,
    });

    // 2. Mock de override local (El admin cambió el nombre y el precio)
    (prisma.product.findMany as jest.Mock).mockResolvedValue([
      {
        sku: "SKU-RTX-4090",
        name: "MaxTech Extreme Edition RTX 4090",
        price: 1800,
        image: "http://maxtech.com/pro-photo.jpg",
      },
    ]);

    const req = new NextRequest("http://localhost/api/mayoristas/search?q=rtx");
    const response = await GET(req);
    const data = await response.json();

    // 3. Verificaciones de la "Boutique"
    expect(data.products[0].mayorista).toBe("MAXTECH"); // Identidad protegida
    expect(data.products[0].name).toBe("MaxTech Extreme Edition RTX 4090"); // Override de nombre exitoso
    expect(data.products[0].price).toBe(1800); // Precio premium aplicado
    expect(data.products[0].imageUrl).toBe("http://maxtech.com/pro-photo.jpg"); // Foto curada
  });

  it("should remove image if no local override is present (Anti-Ugly-Photo Policy)", async () => {
    (searchAllMayoristas as jest.Mock).mockResolvedValue({
      products: [mockProduct],
      total: 1,
    });

    // No hay datos locales para este SKU
    (prisma.product.findMany as jest.Mock).mockResolvedValue([]);

    const req = new NextRequest("http://localhost/api/mayoristas/search?q=rtx");
    const response = await GET(req);
    const data = await response.json();

    expect(data.products[0].imageUrl).toBe(""); // La imagen debe ser vacía para que la UI use placeholder
  });
});
