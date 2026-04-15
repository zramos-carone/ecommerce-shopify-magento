# Día 10: API Sync Mayoristas + Swagger Docs

**Objetivo:** Implementar endpoint de sincronización de precios/stock desde mayoristas a BD, y completar documentación Swagger.

**Timeline:** ~6-8 horas  
**Deliverables:** `/api/mayoristas/sync` funcional, Swagger docs actualizado

---

## 📋 Checklist del Día 10

- [ ] Crear endpoint `/api/mayoristas/sync` (POST)
- [ ] Implementar lógica de comparación BD vs mayoristas
- [ ] Actualizar precios y stock en productos existentes
- [ ] Implementar manejo de errores y logging
- [ ] Actualizar Swagger docs con nuevo endpoint
- [ ] Type-check y build
- [ ] Jest tests para sync logic
- [ ] Commit y push

---

## 🚀 Paso a Paso

### 1️⃣ Crear endpoint `/api/mayoristas/sync`

**Archivo:** `app/api/mayoristas/sync/route.ts`

Endpoint **POST** que:
- Obtiene productos actuales desde mayoristas (Ingram, Distribuido, Synnex)
- Compara con BD actual
- Actualiza precios si hay cambios
- Actualiza stock si hay cambios
- Retorna resumen de cambios

**Response:**
```json
{
  "success": true,
  "synced": 1500,
  "updated": 150,
  "priceChanges": 120,
  "stockChanges": 80,
  "errors": 0,
  "timestamp": "2026-04-14T10:00:00Z",
  "summary": {
    "ingram": { "synced": 500, "updated": 50 },
    "distribuido": { "synced": 500, "updated": 50 },
    "synnex": { "synced": 500, "updated": 50 }
  }
}
```

---

### 2️⃣ Implementar logica de sincronización

```typescript
// Algorithm:
// 1. Fetch productos de mayoristas
// 2. Para cada producto mayorista:
//    a. Buscar en BD por SKU
//    b. Si existe:
//       - Si precio cambió: actualizar + log
//       - Si stock cambió: actualizar + log
//    c. Si no existe: crear nuevo (fallback)
// 3. Return resumen
```

---

### 3️⃣ Actualizar Swagger docs

Agregar documentación del nuevo endpoint:
- POST `/api/mayoristas/sync`
- Response schema
- Error handling

---

## 📝 Consideraciones

- **Seguridad:** Proteger endpoint con API key o autenticación
- **Performance:** Batch updates en Prisma (no update individual)
- **Logging:** Registrar todos los cambios para auditoría
- **Rate limiting:** Ya implementado (100 req/min)
- **Idempotencia:** Endpoint seguro de llamar múltiples veces

---

## ✅ Aceptancia

- ✅ Endpoint retorna 200 OK
- ✅ BD actualizada correctamente
- ✅ Swagger docs actualizado
- ✅ 0 TypeScript errors
- ✅ Build exitoso
- ✅ Tests pasando
