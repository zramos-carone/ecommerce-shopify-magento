# Plan: Proyecto Ecommerce MVP (6 Semanas / 1.5 Meses) - Continuous Delivery

**TL;DR:**  
**1 Senior Full Stack + Agentes IA bajo demanda** ejecutan MVP en **6 semanas** con **delivery continuo de avances diarios**. No esperar a fin de fase: cada día produce features testables (commits públicos). **Sistema de pagos (Stripe/PayPal)** prioritario. **Facturación como módulo dummy** (placeholder visual). **Next.js fullstack + SQLite + Vercel**. **Post-MVP priorities** (facturación funcional, IA, más mayoristas, Amazon) evaluadas post-lanzamiento sin decidir hoy. **Timeline realista con buffer** para debugging mayoristas, testing pagos, y branding profesional.

---

## Semana 1: Setup & Infra (Daily Deliverables)

| Día | Entregable Diario | Owner | Agentes IA Soporte |
|-----|------------------|-------|-------------------|
| **Día 1** | Repo Git + estructura Next.js fullstack (app router), SQLite setup local, Swagger/OpenAPI inicializado | Senior | Code architect agent |
| **Día 2** | Vercel project conectado a GitHub, deploy automático en cada push, dominio custom DNS activo | Senior | DevOps agent |
| **Día 3** | Mayoristas APIs mapeadas (Ingram, Distribuido, Synnex): endpoints, auth, formatos datos documentados | Senior | API research agent |
| **Día 4** | Prisma ORM configurado para SQLite, migraciones base (productos, órdenes, pagos, usuarios), seed data dummy | Senior | DB schema agent |
| **Día 5** | Test conexión mayoristas (llamadas exitosas a APIs, datos parseados), Swagger docs v1.0 activa | Senior + Backend agent | API testing agent |

**Deliverables públicos**: GitHub repo público, Vercel URL vivo, Swagger API docs en `/api-docs`, SQLite local.db inicializado

---

## Semana 2: Backend Mayoristas + Frontend Catálogo (Daily Deliverables)

| Día | Backend Trabajo | Frontend Trabajo | Modo Daily |
|-----|------------------|------------------|-----------|
| **Día 6** | Servicio Ingram API (read products, search, price check) via axios + TypeScript types, Jest tests | Product listing page (React, grid, basic filters) |  ✅ Commit diario, deploy Vercel |
| **Día 7** | Servicio Distribuido API integrado + Prisma queries para sincronización | Product listing con pagination + sorting | ✅ PR review, Swagger updated |
| **Día 8** | Servicio Synnex API integrada, todas 3 mayoristas service layer mocked/real test | Search componente (SQL query via Prisma) | ✅ Demo branch, staging Vercel |
| **Día 9** | Bulk import script vía seed.ts (1,500 products mayoristas → SQLite local.db) | Product detail page + "add to cart" funcional | ✅ Staging deploy automático |
| **Día 10** | API route sync mayoristas (`/api/sync-mayoristas`) + alert emails, Swagger docs completos | Cart persistence (localStorage + API `/api/cart`) | ✅ Vercel staging URL público |

**Deliverables públicos**: Vercel staging URL con catálogo vivo, 1,500+ productos visibles, búsqueda funcional, Swagger docs interactivo

---

## Semana 3: Payments + Admin + Billing Dummy (Daily Deliverables)

| Día | Pagos | Admin | Facturación Dummy | Daily Output |
|-----|-------|-------|------------------|-------------|
| **Día 11** | Stripe SDK + webhooks (`/api/payments/intent`), test mode setup | Admin dashboard skeleton (React component) | UI mockup CFDI form (Shadcn/ui) | ✅ Stripe tests |
| **Día 12** | PayPal fallback integrado (`/api/payments/paypal-webhook`) + fraud detection básica | Order management page (list, status change via Prisma) | PDF mockup design (html2pdf lib) | ✅ 5 test payments |
| **Día 13** | Checkout flujo E2E via `/api/checkout` (carrito → shipping → pago → confirmación) | Inventory manager CRUD (`/api/admin/inventory`) | "Próximamente en v2.0" placeholder | ✅ 20 test orders |
| **Día 14** | PCI-DSS compliance check, test cards validated, Stripe webhook logs | Analytics dashboard (basic reportes con SQL-lite agregaciones) | Dummy module visible en admin | ✅ Payments stable <2s |
| **Día 15** | Email notificaciones via Resend/SendGrid SDK (`/api/emails/order-confirmation`) | Promociones CRUD (`/api/admin/promotions`) | Facturación dummy module live | ✅ 50 test orders end-to-end |

**Deliverables públicos**: 50+ órdenes completadas exitosamente en Vercel staging, pagos 99.5% success rate, rastreo órdenes funcional. Swagger docs + Vercel URL mostrando flujo completo.

---

## Semana 4: QA Intenso + Bug Fixes (Daily Deliverables)

| Día | Testing | Polish Técnico | Performance | Daily Output |
|-----|---------|-----------------|-------------|-------------|
| **Día 16** | Agente-QA corre 100 test cases automáticos (Jest suite completo) | Refactor código, cleanup temp fixes | Lighthouse >85, TTL <2s | ✅ All tests green |
| **Día 17** | Mobile testing exhaustivo (Playwright E2E + real devices) | Error handling mejorado, edge cases | Optimizar imágenes, CSS minify | ✅ Mobile responsive 100% |
| **Día 18** | Integración mayoristas bajo carga (simular 100 sync simultáneamente) | Logging completado (Sentry setup inicial) | Cache Redis optimization | ✅ 100 mayorista syncs OK |
| **Día 19** | Webhook testing (Stripe + PayPal simulado bajo presión) | Database backup automation | Query optimization (Prisma) | ✅ Webhooks 100% reliable |
| **Día 20** | Security audit (no secrets in Vercel logs, env vars secured) | API docs Swagger finales | Rate limiting aplicado `/api/*` | ✅ Security checklist pass |

**Deliverables públicos**: Vercel staging >90% Lighthouse score, todos tests verdes, documentación técnica completa.

---

## Semana 5: Branding Profesional + UAT Ampliado (Daily Deliverables)

| Día | Branding | UAT Real | Refinamiento | Daily Output |
|-----|----------|----------|-------------|-------------|
| **Día 21** | Diseño visual final (logo SVG, paleta completa, guidelines) | 5 usuarios reales testeando flujo completo | Feedback loop de UX | ✅ Branding kit completo |
| **Día 22** | Integración branding a sitio (Navbar, Footer, tema colores CSS variables) | 5 usuarios adicionales (testing pagos) | UI polish basado en feedback | ✅ Branding visualizado |
| **Día 23** | WhatsApp widget + redes sociales (links, Instagram feed embed) | Testing casos edge (producto sin stock, pago rechazado) | Bug fixes menores | ✅ 10 usuarios UAT |
| **Día 24** | SEO avanzado (meta descriptions, og:tags, schema.org markup) | Stress test: 50 usuarios concurrentes | Performance bajo carga | ✅ SEO optimizado, stress test OK |
| **Día 25** | A/B testing setup (Vercel Analytics + custom events) | 15 usuarios totales, 0 críticos reportados | Final polish, QA cleanup | ✅ 15 usuarios UAT sin críticos |

**Deliverables públicos**: Vercel staging 100% branded, documentación SEO completa, 15 usuarios reales completaron compras sin criticidad.

---

## Semana 6: Go-Live + Monitoreo (Daily Deliverables)

| Día | Pre-Launch | Launch | Post-Launch | Daily Output |
|-----|-----------|--------|-------------|-------------|
| **Día 26** | Rollback plan documentado, DNS prepped, SSL cert ready | Copy final review (terms, privacy, contact) | Sentry/Vercel monitoring live | ✅ Launch plan signed off |
| **Día 27** | Final smoke tests en producción (clone de main) | Anuncio redes sociales (Instagram, WhatsApp) | Monitor primeras transacciones | ✅ Prod parity verified |
| **Día 28** | 🚀 **SWITCH DNS A VERCEL PRODUCTION** | Hora 0: Monitor Sentry, Stripe webhooks | Handle primeros users reales | ✅ **LAUNCH OFICIAL** |
| **Día 29** | 24h post-launch monitoring (logs, errors, performance) | Hotfixes si es necesario (1h SLA) | Feedback stakeholders recopilado | ✅ 24h sin críticos |
| **Día 30** | Análisis primeros datos (conversión, avg order value, traffic) | Documentación post-launch (postmortem si bugs) | Planning Fase 2 | ✅ MVPestable, metrics recopilados |

**Deliverables públicos**: Vercel production URL vivo, 10+ órdenes reales completadas, Swagger docs públicos, repositorio público con README y documentación completa, monitoreo activo 24/7.

---

## Paralelo (Semanas 1-6): Identidad Visual & Estudio Mercado

**No bloquea MVP, ejecutable en paralelo:**

- **Semanas 1-2**: Branding research (competencia, color psychology, market trends)
- **Semanas 3-4**: Diseño visual (3 propuestas nombre + logo opciones)
- **Semanas 5-6**: Refinamiento final y aplicación (integración a Vercel antes de go-live)
- **Estudio Mercado**: Análisis competitivo quick (Benchmark vs Amazon/Mercado Libre), 1-pager posicionamiento, redes sociales strategy

---

## Stack Técnico Resumido

- **Framework**: Next.js 14+ (App Router, fullstack)
- **Backend**: Next.js API Routes (serverless functions en Vercel)
- **Frontend**: React 18+ con TypeScript, Shadcn/UI
- **Database**: SQLite + Prisma ORM (embebido)
- **API Docs**: Swagger/OpenAPI en `/api-docs`
- **Hosting**: Vercel (deploy automático)
- **Pagos**: Stripe + PayPal SDKs
- **Testing**: Jest + Playwright
- **Package Manager**: pnpm

---

## Decisiones Clave

- **Next.js fullstack**: 1 repo, 1 lenguaje (TypeScript), perfecto para 1 dev
- **SQLite**: MVP ultra ágil, 0 costo, migración fácil post-MVP
- **Vercel**: Deploy en <60s, preview URLs, Swagger docs vivos
- **6 semanas**: Timeline realista con buffer
- **Continuous delivery**: Cada día = artifact testeable + URL vivo
- **1 Senior + Agentes IA**: Escalable, agentes generan código en paralelo

---

Para más detalles, ver [README.md](./README.md), [CHANGELOG.md](./CHANGELOG.md) y [DAY1.md](./DAY1.md)
