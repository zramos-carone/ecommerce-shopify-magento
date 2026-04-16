# Día 14: Dashboard Administrativo, Analytics y Refactorización Estructural

**Objetivo:** Construir el esqueleto completo de la interfaz administrativa (`/admin`) delineando un panel de analíticas, interfaces interactivas para gestión de órdenes e inventario, además de entregar el módulo inerte de facturación CFDI. Todo esto requiriendo una refactorización previa usando *Route Groups* en Next.js para evitar el empalme visual con el diseño público de la tienda.

**Timeline:** ~4-6 horas  
**Deliverables:** 
- Refactor estructural `app/(shop)` para el frente de clientes.
- `app/admin/layout.tsx` (Esqueleto con Sidebar).
- `app/admin/page.tsx` (Dashboard con sumatorias de SQL-lite via Prisma).
- `app/admin/orders/page.tsx` (Gestor visual de status).
- `app/admin/inventory/page.tsx` (Buscador y alterador de stock iterativo).
- `app/admin/facturacion/page.tsx` (Mockup CFDI para v2.0).

---

## 📋 Checklist del Día 14

- [x] Restructuración a **Route Groups** aislando `<nav>` público.
- [x] Limpieza del `RootLayout` base.
- [x] Esqueleto maestro de `AdminLayout` y `AdminSidebar`.
- [x] Ejecución de Queries Prisma (Métricas) en `Server Components`.
- [x] Componente `OrderTable.tsx` para listar e invocar PATCH a `/api/orders/[id]`.
- [x] Componente `InventoryTable.tsx` para búsquedas e-inputs de actualización +/- de stock en batch al API.
- [x] Despliegue del "Dummy Module" con formularios deshabilitados para facturación CFDI futura.
- [x] Validaciones de responsividad en escritorio y móviles.

---

## 🚀 Paso a Paso

### 1️⃣ Refactorización Arquitectónica (`Route Groups`)

Para asegurar de que la navegación de la interfaz administrativa no heredara el encaje de *"Ecommerce MVP"* de la tienda, se re-ordenó el App Router:
- Todas las rutas orientadas al cliente migraron a `app/(shop)/...`.
- El layout principal público se independizó en `app/(shop)/layout.tsx`.
- El verdadero archivo `app/layout.tsx` se purgó de diseño, volviéndose puramente estructural (cargas condicionales básicas e inyección HTML global).

### 2️⃣ Dashboard Principal de Analíticas

**Ruta**: `app/admin/page.tsx`
Se implementó un Server Component que ejecuta 4 tareas pesadas de base de datos de manera simultánea en el servidor usando `Promise.all` para no perjudicar la velocidad de recarga, obteniendo:
- Conteo íntegro de **órdenes totales**.
- Acumulador de **Ventas Brutas** evadiendo órdenes en estado "Canceladas" o "Fallidas".
- Volumen total de SKUs registrados.
- Lista rápida `SELECT` de las últimas 5 intervenciones u órdenes.

### 3️⃣ Gestor de Estado de Órdenes

**Ruta**: `app/admin/orders/components/OrderTable.tsx`
Se construyó una tabla híbrida combinando la velocidad del servidor y el estado de la UI (Client Component) que incluye:
- Una barra de búsqueda por nombre, email o ticket `OrderNumber`.
- Identificadores visuales colorizados para el estatus del pago (`paymentStatus`).
- Un `<select>` funcional habilitado con el evento *onChange*. Al accionarse, detona la actualización `PATCH` y paraliza la fila con css *opacity-50* mientras persiste en la base de datos de SQLite real.

### 4️⃣ Administrador Ágil de Stock (Inventario)

**Ruta**: `app/admin/inventory/components/InventoryTable.tsx`
Cumpliendo el propósito de operar la paquetería de forma eficiente, se agregó un gestor iterativo donde los usuarios pueden modificar sumas y restas atómicas de mercancía.
El envío de peticiones explota el Payload Array del backend: `[{ productId, stockAdjustment }]`, impactando asíncronamente las unidades dispuestas para la venta pública.

### 5️⃣ Módulo Dummy de Facturación

**Ruta**: `app/admin/facturacion/page.tsx`
Para respetar la entrega del *Día 14* marcada en `PLAN.md` que indica explícitamente *"Dummy module visible en admin"*.
- Se utilizaron *Tailwind classes* para mostrar una alerta azul resaltando su estado para la *"Próxima Integración V2.0"*.
- Se diseñó el esqueleto visual de cómo lucirse con iconos de `lucide-react`, agrupando datos como el RFC, el selector de Uso CFDI y botones formales (deshabilitados) para fines únicamente de demostración.

---

## ✅ Acceptance Criteria

- [x] Ningún layout de la tienda se encabalga visualmente en el admin.
- [x] El Layout del Admin abarca un diseño limpio en Full Screen Width.
- [x] Los contadores de las tarjetas en el Dashboard reflejan matemáticas reales extraídas desde SQLite.
- [x] Cambiar un estado de "Pending" a "Shipped" se graba correctmente y reinicia la vista.
- [x] Agregar o restar stock en el inventario admin impacta inmediatamente las visitas sobre la tienda `/catalog`.
- [x] Ningún error severo de tipado TypeScript empaña la compilación de la rama en el proceso de buildeo.
- [x] 100% de navegación completada.
