import { NextResponse } from 'next/server'
import { getSwaggerSpec } from '@/lib/swagger'

/**
 * GET /api/swagger
 * Retorna la especificación OpenAPI 3.0 en formato JSON
 * Utilizada por Swagger UI en /api-docs
 */
export async function GET() {
  try {
    const spec = await getSwaggerSpec()
    return NextResponse.json(spec)
  } catch (error) {
    console.error('[SWAGGER_ERROR]', error)
    return NextResponse.json(
      {
        error: 'Failed to generate Swagger spec',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
