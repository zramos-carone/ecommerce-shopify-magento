import { NextResponse } from 'next/server'
import { syncIngram, syncDistribuido, syncSynnex } from '@/lib/services/mayoristas'
import { prisma } from '@/lib/db'

/**
 * @swagger
 * /api/mayoristas/sync:
 *   post:
 *     tags:
 *       - Mayoristas
 *     summary: Sincronizar productos de todos los mayoristas
 *     description: Inicia un proceso de sincronización de productos desde los 3 mayoristas hacia la base de datos local
 *     responses:
 *       200:
 *         description: Sincronización completada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SyncResult'
 *       500:
 *         description: Error al sincronizar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function POST() {
  try {
    console.log('[SYNC] Starting mayorista sync...')

    // Sincronizar en paralelo
    const [ingramCount, distribuidoCount, synnexCount] = await Promise.all([
      syncIngram(),
      syncDistribuido(),
      syncSynnex(),
    ])

    // Registrar en base de datos
    const syncRecord = await prisma.mayoristaSync.create({
      data: {
        mayorista: 'all',
        productCount: ingramCount + distribuidoCount + synnexCount,
        status: 'completed',
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Sync completed successfully',
        results: {
          ingram: ingramCount,
          distribuido: distribuidoCount,
          synnex: synnexCount,
          total: ingramCount + distribuidoCount + synnexCount,
        },
        syncRecord,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[SYNC_ERROR]', error)

    // Registrar error en base de datos
    await prisma.mayoristaSync.create({
      data: {
        mayorista: 'all',
        productCount: 0,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    })

    return NextResponse.json(
      {
        error: 'Failed to sync mayoristas',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
