# CHANGELOG - Proyecto Ecommerce MVP

Registro de todos los cambios, iteraciones y decisiones del proyecto desde el concepto inicial hasta la ejecución.

---

## [1.0.0] - 13 Abril 2026 - Plan Final Aprobado

### ✅ Decisiones Finales Tomadas

#### Stack Técnico
- **Backend**: Next.js 14+ (App Router, API Routes serverless)
- **Frontend**: React 18+ con TypeScript, Shadcn/UI
- **Base de Datos**: SQLite + Prisma ORM (embebido, 0 costo)
- **Hosting**: Vercel (deploy automático)
- **API Docs**: Swagger/OpenAPI en `/api-docs`
- **Tests**: Jest + Playwright E2E
- **Package Manager**: pnpm

#### Timeline
- **Duración**: 6 semanas (42 días naturales, ~30 días laborales)
- **Go-Live**: Día 28
- **Buffer Post-Launch**: Días 29-30

#### Equipo
- **1 Senior Full Stack Developer**
- **N Agentes IA bajo demanda** (GitHub Copilot, Claude API, Cursor IDE)
- **Delivery Model**: Continuous delivery (commits diarios, Vercel preview)

#### Presupuesto
- **Total**: 300,000 MXN (sin desglose específico, flexible)
- **Hosting**: Vercel hobby (gratis inicialmente)
- **Database**: SQLite (gratis)

---

## [0.5.0] - 13 Abril 2026 - Iteración: MVP Demo-Level (SQLite + Swagger + Vercel)

### 🔄 Cambios desde plan anterior

#### Semana 1 (Setup & Infra)
**Antes**: WooCommerce + WordPress en Digital Ocean
**Ahora**: Next.js fullstack + SQLite + Prisma + Vercel

- Eliminado: MariaDB setup complejo, Digital Ocean VPS
- Agregado: Prisma ORM, Vercel connect, Swagger docs
- Ventaja: Deploy instant (<60s), 0 costo infra, 1 lenguaje (TypeScript)

#### Semana 2 (Backend Mayoristas + Frontend)
**Antes**: NestJS + Redis cache + WooCommerce theme
**Ahora**: Next.js API routes + React components + local.db sync

- Cambio: Backend separado → Backend integrado (API routes)
- Cambio: Redis cache → Prisma queries (embebido)
- Cambio: WooCommerce → React custom UI
- Ventaja: Menos fricción para 1 dev, código compartido TypeScript

#### Semana 3 (Payments + Admin + Billing Dummy)
**Antes**: Days 11-15 (5 días)
**Ahora**: Days 11-15 (5 días, igual contenido)

- Mantenido: Stripe + PayPal como priortarios
- Mantenido: Admin CRUD básico
- Mantenido: Facturación dummy placeholder
- Agregado: Especificaciones técnicas de API routes exactas

#### Semana 4 (QA Intenso) — NUEVO BLOQUE
**Antes**: Semana 4 con Go-Live (4 en 1)
**Ahora**: Semana 4 dedicada 100% a QA

- Agregado: 100+ test cases automáticos (Jest suite completo)
- Agregado: Mobile testing exhaustivo (Playwright E2E)
- Agregado: Integración mayoristas bajo carga (100 syncs simulados)
- Agregado: Security audit completo (secrets, env vars)
- Agregado: Performance profiling (Lighthouse >85)
- Ventaja: Reduce bugs en producción drásticamente

#### Semana 5 (Branding Profesional + UAT Ampliado) — NUEVO BLOQUE
**Antes**: Branding en 2 días (Día 16-17)
**Ahora**: Semana 5 completa (Día 21-25)

- Agregado: 5 días de branding profesional
- Agregado: 15 usuarios reales en UAT (no 10)
- Agregado: Stress test 50 usuarios concurrentes
- Agregado: A/B testing framework setup
- Ventaja: Branding visualmente consistente, UAT profundo

#### Semana 6 (Go-Live + Monitoreo Post-Launch) — NUEVO BLOQUE
**Antes**: Go-Live + UAT en 1 semana
**Ahora**: Semana 6 dedicada a go-live + monitoring

- Agregado: Rollback plan documentado
- Agregado: 24h monitoring post-launch (Día 29)
- Agregado: Análisis métricas iniciales (Día 30)
- Ventaja: Go-live sin estrés, datos confiables post-launch

### ⏱️ Timeline Adjustment
- **De**: 4 semanas (apretado)
- **A**: 6 semanas (realista)
- **Razón**: Buffer para debugging mayoristas, testing pagos, branding, UAT profundo

---

## [0.4.0] - 13 Abril 2026 - Iteración: Stack Técnico a Node.js

### 🔄 Cambios desde plan anterior

#### Backend Framework
**Antes**: Python (Django/FastAPI) + PostgreSQL + Redis
**Ahora**: Node.js + Express/NestJS + TypeScript + PostgreSQL

- **Por qué**: 
  - 1 lenguaje (TypeScript) backend + frontend → menos context switching
  - Agentes IA generan código JS/TS significativamente mejor
  - Full-stack frameworks (Next.js) viables sin separar backend/frontend
  - Desarrollo + hot reload más rápido

#### Stack Comparación

| Aspecto | Python Plan | Node.js Plan |
|---------|-------------|--------------|
| Backend | Django/FastAPI | Express/NestJS |
| Frontend | React (separate) | React (same repo) |
| DB | PostgreSQL | PostgreSQL |
| Cache | Redis | Redis/node-cache |
| ORM | Django ORM/SQLAlchemy | TypeORM |
| Tests | pytest | Jest |
| Dev Speed | Medium | High |
| IA Support | Good | Excellent |

#### Archivo Estructura (Node.js)
- `backend/src/` → APIs, services, models
- `backend/tests/` → Jest suite
- `frontend/src/` → React pages/components
- Tipos compartidos (`lib/shared-types.ts`)

#### Mayores
- Mantuvimos: Stripe/PayPal, mayoristas APIs, Swagger docs, Vercel deploy

---

## [0.3.0] - 13 Abril 2026 - Iteración: Estructura MVP Realista

### 🔄 Cambios desde plan anterior

#### Timeline Expansion
**Antes**: Implied 4-5 semanas
**Ahora**: Explícitamente 4 semanas + buffer considerations

#### Delivery Model
**Antes**: Phases semanales (Semana 1-4)
**Ahora**: Daily deliverables + Vercel preview (continuous feedback)

#### Preguntas Aclaradas del Usuario
1. **Equipo**: 1 Senior Full Stack + Agentes IA bajo demanda (escalable)
2. **Delivery**: Diaria (no esperada a fin de fase)
3. **Post-MVP**: Todas opciones (A, B, C, D) abiertas, prioridad post-lanzamiento
4. **Facturación**: Módulo dummy (placeholder) en MVP, real post-MVP

#### Cambios en Plan Original
- Eliminado: WooCommerce (cambio a Next.js)
- Eliminado: MariaDB standalone (cambio a SQLite)
- Eliminado: Digital Ocean como hosting (cambio a Vercel)
- Agregado: Swagger API docs live
- Agregado: Daily standup + continuous preview URLs

---

## [0.2.0] - 13 Abril 2026 - Concepto Original (Ejecutivo)

### ✨ Plan Inicial Presentado

#### Estructura Propuesta (5 Fases)
1. **Etapa Previa**: Plataforma Integración Mayoristas (5-7 semanas)
   - Backend: Nginx + Python
   - Frontend: React
   - DB: MariaDB
   - Hosting: Digital Ocean

2. **Etapa 1**: Identidad Visual y Marca

3. **Etapa 2**: Estudio de Mercado

4. **Etapa 3**: Creación Plataforma E-Commerce
   - Opciones: Shopify, WooCommerce, Magento
   
5. **Etapa 4**: Integración Sistemas + Automatización

#### Team Requerido (Concepto)
- Developers (múltiples roles)
- Diseñadores
- Marketing
- Contadores
- Soporte técnico

#### Presupuesto Mencionado
- 300,000 MXN (sin desglose)

#### Issues Identificados
- ❌ Timeline 5-7 semanas muy largo para MVP
- ❌ Multiple equipos (overhead de coordinación)
- ❌ WooCommerce vs Magento vs Shopify (indeciso)
- ❌ Facturación CFDI desde Día 1 (scope creep)
- ❌ Mayoristas no especificadas completamente

---

## [0.1.0] - 13 Abril 2026 - Inicio Proyecto

### 📋 Resumen Ejecutivo Original

**Archivo**: `resumen_ejecutivo_ecommerce.md`

#### Contexto
- Crear plataforma ecommerce en México para venta de productos tecnológicos
- Empresa digital nueva, modelo moderno y escalable
- Combinar IA, experiencia usuario, logística automatizada

#### Mayoristas Mencionados
- Ingram Micro (implícito)
- Distribuido (implícito)
- Synnex (implícito)
- Otros no especificados

#### Requisitos Clave
- Catálogo multiproducto (laptops, hardware, software, accesorios, licencias)
- Múltiples métodos pago
- IA para recomendaciones
- Facturación CFDI 4.0
- Integración Envia.com para logística
- Soporte postventa 24/7

---

## Decisiones Clave del Proyecto

| Decisión | Alternativa Rechazada | Razón |
|----------|----------------------|-------|
| **Next.js** | Django/FastAPI | TypeScript fullstack, mejor IA support, deploy instant |
| **SQLite** | PostgreSQL | MVP ultra ágil, 0 costo, migración trivial post-MVP |
| **Vercel** | Digital Ocean | Deploy automático, preview URLs, serverless functions |
| **Swagger** | REST docs manual | API bonita, testeable, cliente puede explorar sin código |
| **6 semanas** | 4 semanas | Buffer para debugging mayoristas, testing pagos, branding |
| **1 Senior + IA** | Team multidisciplinar | Escala en demand, agentes generan código más rápido |
| **Facturación Dummy** | CFDI desde Día 1 | Reduce scope MVP, implementable post-lanzamiento |

---

## Métricas de Éxito (MVP Launch)

### Día 20 (QA Checkpoint)
- ✅ 100+ test cases automáticos
- ✅ <1% error rate
- ✅ Lighthouse >85 score
- ✅ 0 security issues

### Día 25 (Pre-Launch)
- ✅ 15 usuarios reales UAT
- ✅ 0 bugs críticos reportados
- ✅ Branding 100% aplicado
- ✅ Swagger docs completos

### Día 30 (Post-Launch)
- ✅ 10+ órdenes reales completadas
- ✅ Pagos 99.5% success rate
- ✅ 24h sin crashes
- ✅ Monitoreo activo (Sentry, Vercel Analytics)

---

## Pendientes Post-MVP (Roadmap Abierto)

### Opción A: Facturación CFDI 4.0 (1-2 semanas)
- **Impacto**: Crítico fiscal
- **Cuándo**: Mes 2 inicio (si revenue excelente)

### Opción B: IA + Chatbot + Recomendaciones (1.5 semanas)
- **Impacto**: Engagement +30%
- **Cuándo**: Mes 2 mid (si conversión baja)

### Opción C: 5-7 Mayoristas Adicionales (2-3 semanas)
- **Impacto**: Inventory +50%
- **Cuándo**: Mes 2 end (si stock bajo)

### Opción D: Amazon Seller Central (1 semana)
- **Impacto**: Reach +100%
- **Cuándo**: Mes 3 (si quieren marketplace)

---

## Cambios Esperados Post-Lanzamiento

### Semana de Ejecución vs Post-Launch
- **Semanas 1-6**: Desarrollo activo, daily commits
- **Semana 7+**: Monitoreo, hotfixes, metrics analysis
- **Mes 2**: Post-MVP features basado en datos

### Posibles Ajustes (Feedback-Driven)
- Cambios UI basado en user feedback
- Optimización pagos (si tasa rechazo alta)
- Scaling mayoristas (si inventory crítico)
- IA prioridad (si conversión baja)

---

## Contactos / Recursos

### Equipo
- **Senior Developer**: Por definir
- **IA Agents**: GitHub Copilot, Claude API, Cursor IDE

### Servicios Externos
- **Stripe**: Pagos (SDK oficial)
- **PayPal**: Fallback pagos
- **Vercel**: Hosting + CI/CD
- **Mayoristas APIs**:
  - Ingram Micro
  - Distribuido
  - Synnex

### Documentación Generada
- `plan.md` — Plan detallado 6 semanas
- `README.md` — Setup inicial
- `CHANGELOG.md` — Este archivo
- `/docs/technical-spec.md` — Spec técnica detallada (generated Día 1-5)
- `/docs/api-mayoristas.md` — Integración mayoristas (generated Día 3)

---

## Aprobación

✅ **Status**: PLAN APROBADO  
📅 **Fecha Aprobación**: 13 Abril 2026  
👤 **Aprobado Por**: Usuario (Senior Full Stack + Copilot)  
🚀 **Fecha Inicio**: TBD (después de aprobación final)  
🎯 **Fecha Go-Live Target**: +42 días desde inicio

---

*Documento actualizado: 13 Abril 2026 - 2:15 PM*
