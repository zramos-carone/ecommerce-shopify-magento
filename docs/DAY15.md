# Día 15: Promociones CRUD y Notificaciones

**Objetivo:** Finalizar la consolidación de las herramientas requeridas para habilitar estrategias de venta a corto plazo (códigos promocionales), asegurar que el esqueleto de facturación cumpla parámetros de V2.0 y comprobar el sistema de notificaciones. Representa el salto definitivo antes de las pruebas de estrés métrico y de seguridad general.

**Timeline:** ~4 horas  
**Deliverables:** 
- `app/api/admin/promotions/route.ts` (API Listado y Creación).
- `app/api/admin/promotions/[id]/route.ts` (API Edición y Borrado).
- `app/admin/promotions/page.tsx` (Dashboard GUI interactivo de cupones).
- Módulo Dummy de Facturación (Finalizado por adelantado).
- Integración de API SendGrid/Resend (Finalizado por adelantado en Día 11).

---

## 📋 Checklist del Día 15

- [x] Migración del modelo `Promotion` integrado dentro del ecosistema central unificado (`schema.prisma`).
- [x] Construcción iterativa del Gestor Táctico CRUD (`PromotionsTable`) dentro de `/admin/promotions` con activación de `lucide-react`.
- [x] Modificación estructural en la ruta asíncrona principal `POST /api/checkout/route.ts` para descontabilidad (Aplicación de reglas de descuento dinámicas).
- [x] Verificación retroactiva de la existencia de Notificaciones E-mail.
- [x] Maqueta de "Dummy CFDI Module" en `/admin/facturacion`.
- [ ] *Tirada de estrés masiva*: Generar 50 órdenes de test de inicio a fin (*Se pausa y transfiere tácticamente en espera de la inyección base de los 1,500 productos mayoristas DB*).

---

## 🚀 Paso a Paso

### 1️⃣ Generación Arquitectónica del Módulo 'Promotion'
Iniciamos afectando directamente nuestra base de datos local SQLite utilizando `prisma db push`. Introduciendo un identificador de string numérico protegido como *@unique* para denegar colisiones artificiales y habilitando una variable booleana `active: true` la cual gobierna instantáneamente la validez global del descuento.

### 2️⃣ Desarrollo Administrativo de Borde (`Promotions CRUD`)
Instauramos un ecosistema híbrido en dos partes:
- **Backend**: Los routers `api/admin/promotions` capturan solicitudes POST seguras normalizándolas asertivamente con `upperCode.toUpperCase().trim()`.
- **Frontend**: El archivo `PromotionsTable.tsx` funge como Client Component donde una recepcionista o manager del comercio puede tipear *"DESCUENTO2026"* en un mini formulario adherido, presionar Enter, y verlo agregado a la línea temporal sin refrescar la página.

### 3️⃣ Inserción Directa al Checkout-Core
La validación ocurre matemáticamente incrustada en el Checkout:
Se instruyó al orquestador principal que admita un campo opcional temporal llamado `couponCode`. Apenas se lanza la compra, revisa instantáneamente si dicho string existe y si su llave *active* está habilitada en Prisma. Solo si es verdad, deyecta de subtotal porcentual total en una nueva variable temporal (`discountAmount`) antes de inyectarlo oficialmente a la pasarela Stripe y antes de emitir la factura abstracta.

---

## ✅ Acceptance Criteria

- [x] Se permite en base de datos la creación de cupones promocionales con un % fijo de descuento.
- [x] Existe un módulo Administrativo en /admin (Dashboard) en donde observar los cupones.
- [x] Cuentan con un *"toggle"* de apagar/encender.
- [x] El Checkout reconfigurado procesa matemáticas con éxito sin frenar pagos ordinarios (sin descuento).
- [ ] (Aplastado) 50 Entregas satisfactorias con pasarela.
