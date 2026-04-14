import { createSwaggerSpec } from 'next-swagger-doc'

export const getSwaggerSpec = () => {
  return createSwaggerSpec({
    apiFolder: 'app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Ecommerce MVP API',
        version: '1.0.0',
        description:
          'API REST para plataforma ecommerce con integración de mayoristas (Ingram, Distribuido, Synnex)',
        contact: {
          name: 'Ecommerce MVP Team',
          email: 'support@ecommerce-mvp.com',
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT',
        },
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development Server',
        },
        {
          url: 'https://ecommerce-mvp.vercel.app',
          description: 'Production Server',
        },
      ],
      tags: [
        {
          name: 'Mayoristas',
          description: 'Integración con proveedores mayoristas (Ingram, Distribuido, Synnex)',
        },
      ],
      components: {
        schemas: {
          Product: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'Producto ID único' },
              sku: { type: 'string', description: 'SKU del producto' },
              name: { type: 'string', description: 'Nombre del producto' },
              description: { type: 'string', description: 'Descripción del producto' },
              price: { type: 'number', format: 'float', description: 'Precio en USD' },
              stock: { type: 'integer', description: 'Stock disponible' },
              category: { type: 'string', description: 'Categoría (Laptop, GPU, CPU, etc)' },
              brand: { type: 'string', description: 'Marca del producto' },
              mayorista: {
                type: 'string',
                enum: ['ingram', 'distribuido', 'synnex'],
                description: 'Proveedor mayorista',
              },
              mayoristSku: { type: 'string', description: 'SKU del mayorista' },
              mayoristPrice: { type: 'number', format: 'float', description: 'Precio mayorista' },
            },
            required: ['id', 'sku', 'name', 'price', 'stock', 'mayorista'],
          },
          SearchQuery: {
            type: 'object',
            properties: {
              q: { type: 'string', description: 'Término de búsqueda (obligatorio)' },
              category: {
                type: 'string',
                description: 'Filtro por categoría (opcional)',
              },
              priceMin: { type: 'number', description: 'Precio mínimo en USD (opcional)' },
              priceMax: { type: 'number', description: 'Precio máximo en USD (opcional)' },
            },
            required: ['q'],
          },
          SearchResult: {
            type: 'object',
            properties: {
              success: { type: 'boolean', description: 'Indicador de éxito' },
              query: { $ref: '#/components/schemas/SearchQuery' },
              results: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    products: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Product' },
                    },
                    total: { type: 'integer' },
                    mayorista: { type: 'string' },
                  },
                },
              },
              allProducts: {
                type: 'array',
                items: { $ref: '#/components/schemas/Product' },
                description: 'Todos los productos ordenados por precio',
              },
              total: { type: 'integer', description: 'Total de productos encontrados' },
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
          SyncResult: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              results: {
                type: 'object',
                properties: {
                  ingram: { type: 'integer' },
                  distribuido: { type: 'integer' },
                  synnex: { type: 'integer' },
                  total: { type: 'integer' },
                },
              },
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
          ErrorResponse: {
            type: 'object',
            properties: {
              error: { type: 'string', description: 'Tipo de error' },
              message: { type: 'string', description: 'Detalles del error' },
            },
          },
        },
      },
    },
  })
}
