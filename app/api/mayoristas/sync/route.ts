import { NextResponse } from "next/server";
import {
  syncIngram,
  syncDistribuido,
  syncSynnex,
} from "@/lib/services/mayoristas";
import { prisma } from "@/lib/db";

// Force dynamic rendering for database operations
export const dynamic = "force-dynamic";

/**
 * @swagger
 * /api/mayoristas/sync:
 *   post:
 *     summary: Sincronización Masiva (Admin)
 *     description: Inicia un proceso orquestado para actualizar el inventario local de TECNO desde los tres proveedores mayoristas (Ingram, Distribuido, Synnex).
 *     tags:
 *       - Administración
 *     responses:
 *       200:
 *         description: Sincronización completada exitosamente. Contiene el conteo de productos actualizados por proveedor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: 'boolean' }
 *                 results: { type: 'object' }
 *       500:
 *         description: Error crítico durante el proceso de sincronización.
 */
export async function POST() {
  try {
    console.log("[SYNC] Starting mayorista sync...");

    // Sincronizar en paralelo
    const [ingramCount, distribuidoCount, synnexCount] = await Promise.all([
      syncIngram(),
      syncDistribuido(),
      syncSynnex(),
    ]);

    // Registrar en base de datos
    const syncRecord = await prisma.mayoristaSync.create({
      data: {
        mayorista: "all",
        productCount: ingramCount + distribuidoCount + synnexCount,
        status: "completed",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Sync completed successfully",
        results: {
          ingram: ingramCount,
          distribuido: distribuidoCount,
          synnex: synnexCount,
          total: ingramCount + distribuidoCount + synnexCount,
        },
        syncRecord,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[SYNC_ERROR]", error);

    // Registrar error en base de datos
    await prisma.mayoristaSync.create({
      data: {
        mayorista: "all",
        productCount: 0,
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
    });

    return NextResponse.json(
      {
        error: "Failed to sync mayoristas",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
