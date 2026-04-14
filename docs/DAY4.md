# Día 4: Swagger + OpenAPI Documentación - Instrucciones Ejecutivas

**Fecha**: Día 4 del Proyecto  
**Timeline**: ~1 día (6-8 horas)  
**Entregable Final**: Swagger UI en `/api-docs` ✅ + Documentación OpenAPI 3.0 ✅ + Endpoints documentados ✅

---

## 📋 Checklist del Día 4

- [ ] Instalar dependencias Swagger (`next-swagger-doc`, `swagger-ui-react`)
- [ ] Crear configuración OpenAPI 3.0
- [ ] Generar documentación de endpoints mayoristas
- [ ] Crear página `/api-docs` con Swagger UI
- [ ] Documentar modelos (Product, SearchQuery, SearchResult)
- [ ] Agregar ejemplos de respuesta para cada endpoint
- [ ] Probar en navegador: `http://localhost:3000/api-docs`
- [ ] Validar que "Try it out" funciona en Swagger UI
- [ ] Deployer a Vercel y verificar en producción

---

## 🚀 Paso a Paso

### 1️⃣ Verificar Dependencias (2 min)

```bash
# Las dependencias ya deberían estar en package.json
# Verificar:
pnpm list next-swagger-doc swagger-ui-react

# Si no están, instalar:
pnpm add next-swagger-doc swagger-ui-react
```

---

### 2️⃣ Crear Configuración OpenAPI (10 min)

**Archivo**: `lib/swagger.ts`

```typescript
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
```

---

### 3️⃣ Documentar Endpoints en Código (15 min)

**Actualizar**: `app/api/mayoristas/search/route.ts`

Agregar comentarios JSDoc al inicio del archivo:

```typescript
/**
 * @swagger
 * /api/mayoristas/search:
 *   get:
 *     tags:
 *       - Mayoristas
 *     summary: Buscar productos en todos los mayoristas
 *     description: Busca productos en Ingram, Distribuido y Synnex. Retorna resultados agregados y ordenados por precio.
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Término de búsqueda (nombre, SKU, marca)
 *         example: laptop
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtrar por categoría
 *         example: Laptop
 *       - in: query
 *         name: priceMin
 *         required: false
 *         schema:
 *           type: number
 *         description: Precio mínimo en USD
 *         example: 100
 *       - in: query
 *         name: priceMax
 *         required: false
 *         schema:
 *           type: number
 *         description: Precio máximo en USD
 *         example: 2000
 *     responses:
 *       200:
 *         description: Búsqueda exitosa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResult'
 *             example:
 *               success: true
 *               query:
 *                 q: laptop
 *               allProducts:
 *                 - id: ingram-001
 *                   sku: DELL-XPS-13-2024
 *                   name: Dell XPS 13 Plus - Intel Core i5
 *                   price: 999.99
 *                   stock: 45
 *                   category: Laptop
 *                   brand: Dell
 *                   mayorista: ingram
 *               total: 5
 *       400:
 *         description: Falta parámetro "q"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 example:
 *                   type: string
 *             example:
 *               error: Query parameter "q" is required
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
```

**Actualizar**: `app/api/mayoristas/sync/route.ts`

```typescript
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
 *             example:
 *               success: true
 *               message: Sync completed successfully
 *               results:
 *                 ingram: 5
 *                 distribuido: 5
 *                 synnex: 5
 *                 total: 15
 *       500:
 *         description: Error al sincronizar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
```

---

### 4️⃣ Crear Ruta para Swagger UI (10 min)

**Archivo**: `app/api-docs/page.tsx`

```typescript
'use client'

import { useEffect, useState } from 'react'
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

export default function ApiDocsPage() {
  const [spec, setSpec] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/swagger')
      .then((res) => res.json())
      .then((data) => {
        setSpec(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load Swagger spec', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Cargando documentación API...</h1>
      </div>
    )
  }

  if (!spec) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Error al cargar Swagger spec</h1>
      </div>
    )
  }

  return (
    <div style={{ padding: '0' }}>
      <SwaggerUI spec={spec} />
    </div>
  )
}
```

---

### 5️⃣ Crear Endpoint para Swagger Spec (5 min)

**Archivo**: `app/api/swagger/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { getSwaggerSpec } from '@/lib/swagger'

export async function GET() {
  const spec = await getSwaggerSpec()
  return NextResponse.json(spec)
}
```

---

### 6️⃣ Actualizar Navigation Bar (5 min)

**Actualizar**: `app/layout.tsx`

Agregar enlace a API Docs en la navegación:

```typescript
// En la sección de navegación, agregar:
<a href="/api-docs" className="text-blue-600 hover:underline">
  API Docs
</a>
```

---

### 7️⃣ Probar Localmente (5 min)

```bash
# Dev server ya debe estar corriendo
# Abre en navegador:
http://localhost:3000/api-docs

# Deberías ver:
# ✅ Interfaz Swagger UI interactiva
# ✅ 2 endpoints documentados (search, sync)
# ✅ Schemas de Product, SearchResult, etc
# ✅ Botón "Try it out" para probar endpoints
```

**Prueba en Swagger UI:**
1. Click en `GET /api/mayoristas/search`
2. Click en "Try it out"
3. Ingresa `q=laptop` en el campo
4. Click "Execute"
5. Deberías ver respuesta JSON con 15 productos

---

### 8️⃣ Validar Errores en TypeScript (2 min)

```bash
pnpm type-check
# Debería pasar sin errores
```

---

### 9️⃣ Probar en Producción (Esperar por deploy)

Una vez que Vercel complete el deploy (~2-3 min):

```
https://ecommerce-mvp-[hash].vercel.app/api-docs
```

---

## 📊 Resultado Esperado

### Swagger UI Page
```
URL: http://localhost:3000/api-docs

Visualiza:
✅ Titulo: "Ecommerce MVP API v1.0"
✅ Descripción del proyecto
✅ 2 servidores (desarrollo y producción)
✅ Sección "Mayoristas" con 2 endpoints
✅ Schemas documentados
✅ Ejemplos de requests/responses
✅ Botón "Try it out" funcional
```

### Endpoints Documentados
```
GET /api/mayoristas/search
  ├─ Parámetros: q, category, priceMin, priceMax
  ├─ Response: SearchResult (15 productos)
  └─ Ejemplos: /api/mayoristas/search?q=laptop

POST /api/mayoristas/sync
  ├─ Sin parámetros
  ├─ Response: SyncResult (productos sincronizados)
  └─ Logs: [SYNC] Starting mayorista sync...
```

---

## 🎯 Checklist Final Día 4

- [ ] Archivo `lib/swagger.ts` creado con configuración OpenAPI
- [ ] Endpoints documentados con comentarios JSDoc `@swagger`
- [ ] Página `/api-docs` creada con Swagger UI
- [ ] Endpoint `/api/swagger` retorna spec JSON
- [ ] Link a API Docs en navigation bar
- [ ] `pnpm type-check` pasa sin errores
- [ ] Swagger UI carga en `http://localhost:3000/api-docs`
- [ ] "Try it out" funciona para search endpoint
- [ ] Deploy en Vercel completado y API docs públicas

---

## 📌 Troubleshooting

### Error: "Module not found: swagger-ui-react"
**Solución**: Ya debería estar en `package.json`, pero si no:
```bash
pnpm add swagger-ui-react swagger-ui
```

### Swagger UI en blanco
**Solución**: Verificar que `/api/swagger` retorna JSON válido:
```bash
curl http://localhost:3000/api/swagger
```

### JSDoc comments no se leen
**Solución**: Asegurate que comentarios están al inicio del archivo (antes de imports)

---

## 🚀 Próximos Pasos (Días 5-6)

**Día 5**: 
- Performance tuning (caché, índices)
- Agregar más filtros avanzados
- Rate limiting

**Día 6**:
- Validación de inputs
- Error handling mejorado
- Pruebas E2E con Playwright

---

**Estado**: ⏳ Día 4 En Progreso  
**Timestamp**: 14 Abril 2026  
**Próximo**: Día 5 (Performance + Filtros Avanzados)
