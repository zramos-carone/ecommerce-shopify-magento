# Plan: Proyecto Ecommerce MVP (6 Semanas / 1.5 Meses) - Continuous Delivery

**TL;DR:**  
**1 Senior Full Stack + Agentes IA bajo demanda** ejecutan MVP en **6 semanas** con **delivery continuo de avances diarios**. No esperar a fin de fase: cada día produce features testables (commits públicos). **Sistema de pagos (Stripe/PayPal)** prioritario. **Facturación como módulo dummy** (placeholder visual). WooCommerce MVP. **Post-MVP priorities** (facturación funcional, IA, más mayoristas, Amazon) evaluadas post-lanzamiento sin decidir hoy. **Timeline realista con buffer** para debugging mayoristas, testing pagos, y branding profesional.

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

## Continuous Delivery Setup

**GitHub + Vercel workflow** (automático, no manual):

```
├── main (producción, deploy automático vercel.com con Día 28)
├── staging (preview deployment desde branches)
└── develop (feature branches, PR preview)

CI/CD: 
  ✅ Tests automáticos en cada push (Jest en GitHub Actions)
  ✅ Deploy staging en cada pull request (Vercel preview)
  ✅ Deploy production en Día 28 switch de DNS
  ✅ Swagger docs actualizados automáticamente
  ✅ Backups SQLite automáticos (Vercel)
```

**Daily Standup** (15 min):
- "Qué desplegué hoy?" → Vercel URL + Swagger docs
- "Qué viene?" → Next priority tasks
- "Blockers?" → Help needed
- Weekly stakeholder demo (viernes): Vercel staging URL + Swagger interactive

**Key Dates**:
- **Día 10**: First public demo (catálogo funcional)
- **Día 15**: Payments demo (50 órdenes completadas)
- **Día 20**: QA sign-off (todos tests verdes)
- **Día 25**: Pre-launch demo (branding + 15 usuarios UAT OK)
- **Día 28**: 🚀 Go-live production
- **Día 30+**: Post-launch monitoring + metrics

---

## Relevant Files 

```
├── app/
│   ├── (pages)/
│   │   ├── page.tsx (home)
│   │   ├── catalog/
│   │   │   ├── page.tsx (product list)
│   │   │   └── [id]/page.tsx (product detail)
│   │   ├── checkout/page.tsx
│   │   ├── order-tracking/[id]/page.tsx
│   │   └── admin/
│   │       ├── layout.tsx
│   │       ├── dashboard/page.tsx
│   │       ├── inventory/page.tsx
│   │       └── billing-dummy/page.tsx
│   ├── api/
│   │   ├── products/
│   │   │   ├── route.ts (GET /api/products)
│   │   │   └── [id]/route.ts
│   │   ├── mayoristas/
│   │   │   ├── ingram.ts (service)
│   │   │   ├── distribuido.ts (service)
│   │   │   ├── synnex.ts (service)
│   │   │   └── sync/route.ts (POST /api/mayoristas/sync)
│   │   ├── orders/
│   │   │   ├── route.ts (POST crear orden)
│   │   │   └── [id]/route.ts (GET orden)
│   │   ├── payments/
│   │   │   ├── intent/route.ts (Stripe intent)
│   │   │   ├── paypal-webhook/route.ts
│   │   │   └── stripe-webhook/route.ts
│   │   ├── checkout/route.ts
│   │   ├── cart/route.ts
│   │   ├── admin/
│   │   │   ├── inventory/route.ts
│   │   │   └── promotions/route.ts
│   │   ├── emails/
│   │   │   └── order-confirmation/route.ts
│   │   └── docs/swagger.ts (OpenAPI spec)
│   ├── layout.tsx (root)
│   └── globals.css
├── lib/
│   ├── db.ts (Prisma client)
│   ├── types.ts (shared types)
│   ├── stripe.ts (Stripe utils)
│   └── validators.ts (Zod schemas)
├── components/
│   ├── ProductCard.tsx
│   ├── Cart.tsx
│   ├── Navbar.tsx
│   └── Admin/
├── public/
│   ├── branding/
│   │   ├── logo.svg
│   │   └── colors.json
│   └── images/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── __tests__/
│   ├── api.test.ts (Jest + Supertest)
│   └── e2e/ (Playwright)
├── docs/
│   ├── README.md
│   ├── API.md
│   └── DEPLOYMENT.md
├── .env.local (local, ignored)
├── .env.example
├── next.config.ts
├── tsconfig.json
├── jest.config.js
├── vercel.json (Vercel config)
└── package.json
```

---

## Verification (Daily Checkpoints)

| Checkpoint | Criterio | Status | Impacto |
|-----------|----------|--------|---------|
| **Fin Día 5** | Mayoristas APIs conectadas, SQLite schema listo, GitHub repo + Vercel connected | ✅ Go-live? NO | Infra lista |
| **Fin Día 10** | 1,500 productos visibles en Vercel, búsqueda funciona, Swagger docs completo | ✅ Stakeholders ven catálogo | Core product lista |
| **Fin Día 15** | 50 órdenes reales completadas, pagos 99.5% success rate, admin funcional | ✅ Business logic complete | Payments robusto |
| **Fin Día 20** | All tests verdes (Jest 100+ cases), no security issues, performance >90 Lighthouse | ✅ QA profunda complete | Technical debt 0 |
| **Fin Día 25** | 15 usuarios reales completaron compras, 0 + bugs críticos, branding aplicado | ✅ UAT OK, ready to prod | Business ready |
| **Fin Día 30** | Vercel production URL vivo, 10+ órdenes reales post-launch, monitoreo activo 24h | ✅ 🚀 MVP VIVO | Lanzamiento exitoso |

---

## Decisions

- **Next.js fullstack**: Un repo, un lenguaje, API routes en Vercel serverless. Perfecto para solo 1 dev.

- **SQLite**: Demo ultra ágil, 0 costo, sin servidor DB externo. Migración trivial a PostgreSQL post-MVP via Prisma.

- **Vercel**: Deploy automático en cada push, preview URLs para PRs, Swagger docs vivos sin infraestructura adicional.

- **Swagger/OpenAPI**: API documentada, testeable, bonita. Cliente puede explorar sin código.

- **6 semanas en lugar de 4**: Timeline realista. Reduce riesgo de bugs en producción. Buffer suficiente para:
  - Debugging APIs mayoristas (2-3 días impredecibles)
  - Testing pagos exhaustivo (50+ órdenes)
  - Branding profesional (3-4 días)
  - UAT real con 15 usuarios
  - Monitoreo post-launch sin estrés

- **Continuous delivery > Phases**: Cada día = artifact testeable + Vercel URL vivo. Feedback inmediato.

- **1 Senior + Agentes bajo demanda**: Escalable. Senior toma decisiones, agentes generan código/tests/docs en paralelo.

- **Post-MVP priorities ABIERTAS**: A) CFDI 4.0 funcional, B) IA + chatbot, C) 5-7 mayoristas más, D) Amazon. Decidir post-lanzamiento.

- **Facturación dummy desde Día 11**: No real, pero UI lista. Implementar real post-MVP cuando definidas reglas fiscales.

- **Demo-ready Día 25**: Branding profesional + 15 usuarios UAT OK = seguro go-live Día 28

- **42 días de ejecución (30 días laborales)** = 6 semanas reales, no apretado.

---

## Post-MVP Roadmap (Abierta, No Priorizado HOY)

**Después de Día 30 (post-lanzamiento exitoso):**

**Opciones todas viables para Mes 2-3 basado en métricas:**

| Opción | Esfuerzo | Impacto | Timeline | Prioridad Recomendada |
|--------|----------|--------|----------|----------------------|
| **A) Facturación CFDI 4.0** | 1-2 semanas | Crítico (fiscal/legal) | Mes 2 inicio | Si revenue excelente |
| **B) IA + Chatbot + Recomendaciones** | 1.5 semanas | Engagement +30% | Mes 2 mid | Si conversión es baja |
| **C) 5-7 mayoristas adicionales** | 2-3 semanas (agentes replican patrón) | Inventory +50% | Mes 2 end | Si productos stock bajo |
| **D) Amazon Seller Central** | 1 semana | Reach +100% | Mes 3 | Si quieren marketplace |

**Decidir post-MVP basado en:**
- **Métrica: High conversión (>2%) + buen AOV?** → Priorizar A (CFDI para formalizar) + D (Amazon expansion)
- **Métrica: Conversión baja (<1%)?** → Priorizar B (chatbot/recomendaciones para mejorar UX)
- **Métrica: Stock bajo en mayoristas?** → Priorizar C (agregar más mayoristas)
- **Goal: Expansion nacional/LATAM?** → Todas simultáneamente, escalar equipo

---

## Stack Técnico Resumido

- **Framework**: Next.js 14+ (App Router, fullstack)
- **Backend**: Next.js API Routes (serverless functions en Vercel)
- **Frontend**: React 18+ con TypeScript, Shadcn/UI (componentes base)
- **Base de Datos**: SQLite + Prisma ORM (local.db, embebido)
- **API Documentation**: Swagger/OpenAPI + Swagger UI en `/api-docs`
- **Hosting**: Vercel (deploy automático en cada push a main)
- **Pagos**: Stripe + PayPal SDKs oficiales
- **Mayoristas**: APIs REST/SOAP via axios (Ingram Micro, Distribuido, Synnex)
- **Emails**: Resend SDK o SendGrid (para notificaciones)
- **Tests**: Jest + Playwright E2E
- **Package Manager**: pnpm (más rápido que npm)
- **IA Asistentes**: GitHub Copilot, Claude API, Cursor IDE

### ¿Por qué esta stack para Demo MVP?

1. **Ultra ligero**: SQLite no requiere servidor DB externo, 0 costo
2. **Deploy instant**: Vercel → push a GitHub → live en <60s
3. **Fullstack JS**: 1 repo, 1 lenguaje (TypeScript), sin complejidad backend/frontend separados
4. **Swagger built-in**: API documentada, testeable, bonita (`/api-docs`)
5. **Serverless**: No preocuparse por scaling inicial, Vercel maneja todo
6. **Free hasta cierto punto**: Vercel hobby plan + SQLite = $0 iniciales
7. **Migración fácil**: Post-MVP, migrar SQLite → PostgreSQL es trivial (Prisma maneja ambos)

**Perfecto para demo**, escalable a producción después (cambiar DB + ir a VPS si se necesita).

---

## Notas de Proyecto

- **1 Senior Full Stack** + agentes IA bajo demanda (escalable, agentes generan assets específicos cuando se necesitan)
- **Presupuesto**: 300k MXN flexible, sin desglose estricto
- **Timeline**: 6 semanas (42 días naturales, ~30 días laborales)
- **Hosting**: Vercel gratuito para MVP, escala después si es necesario
- **Database**: SQLite local.db para MVP (0 costo), migración fácil a PostgreSQL post-MVP
- **Delivery**: Diaria (commits, PRs, Vercel staging/prod visible) + daily standup 15 min
- **Demo-ready**: Día 25 (con branding) listo para presentar entes de ir a prod
- **Go-Live**: Día 28 (Vercel production)
- **Post-Launch**: Día 29-30 monitoreo + análisis métricas iniciales
- **Post-MVP**: Todas opciones abiertas (A, B, C, D), prioridad decide post-lanzamiento
- **Facturación CFDI**: Dummy en MVP, real post-MVP cuando definida legislación específica
- **Escalabilidad**: Sin pain points para migrar SQLite → PostgreSQL + staging cloud cuando revenue lo justifique
- **Risk Management**: Buffer de 2 semanas (Semanas 5-6) para debugging impredecibles, UAT profundo, branding profesional
