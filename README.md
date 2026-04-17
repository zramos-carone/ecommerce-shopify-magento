# MaxTech - Plataforma Ecommerce MVP México Electrónico

![Status](https://img.shields.io/badge/status-in%20planning-blue) ![Timeline](https://img.shields.io/badge/timeline-6%20weeks-green) ![Stack](https://img.shields.io/badge/stack-Next.js-black)

# Resumen Ejecutivo: MaxTech - E-commerce de Nueva Generación en México

Plataforma de ecommerce MVP para venta de productos tecnológicos en México, con integración de mayoristas (Ingram Micro, Distribuido, Synnex), sistema de pagos robusto (Stripe + PayPal), y deployment automático en Vercel.

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Stack Técnico](#stack-técnico)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Setup Inicial](#setup-inicial)
- [Variables de Entorno](#variables-de-entorno)
- [Ejecutar en Desarrollo](#ejecutar-en-desarrollo)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deploy a Vercel](#deploy-a-vercel)
- [Comandos Útiles](#comandos-útiles)
- [Troubleshooting](#troubleshooting)
- [Recursos](#recursos)

---

## ✨ Características

### MVP (Semanas 1-6)
- ✅ **Catálogo de Productos**: 1,500+ productos de 3 mayoristas
- ✅ **Integración Mayoristas**: Ingram Micro, Distribuido, Synnex
- ✅ **Carrito de Compras**: Persistencia localStorage + DB
- ✅ **Sistema de Pagos**: Stripe + PayPal (priortarios)
- ✅ **Admin Panel**: Gestión órdenes, inventario, reportes básicos
- ✅ **Facturación Dummy**: Placeholder UI, implementación real post-MVP
- ✅ **Rastreo de Órdenes**: Estados básicos + notificaciones
- ✅ **API Documentation**: Swagger/OpenAPI en `/api-docs`
- ✅ **Branding Professional**: Logo, colores, identidad visual aplicada
- ✅ **Mobile Responsive**: Optimizado para iOS/Android

### Post-MVP (Mes 2+)
- 🔄 **Facturación CFDI 4.0** (Opción A)
- 🔄 **IA + Chatbot + Recomendaciones** (Opción B)
- 🔄 **5-7 Mayoristas Adicionales** (Opción C)
- 🔄 **Amazon Seller Central** (Opción D)

---

## 🛠️ Stack Técnico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Framework** | Next.js | 14+ |
| **Language** | TypeScript | 5.0+ |
| **Frontend** | React | 18+ |
| **UI Components** | Shadcn/UI | Latest |
| **Database** | SQLite + Prisma | Latest |
| **API Docs** | Swagger/OpenAPI | 3.0 |
| **Payments** | Stripe + PayPal SDKs | Latest |
| **Testing** | Jest + Playwright | Latest |
| **Package Manager** | pnpm | 8.0+ |
| **Hosting** | Vercel | - |
| **CI/CD** | GitHub Actions | - |

---

## 📦 Requisitos Previos

Antes de instalar, asegúrate de tener:

- **Node.js** 18.17+ ([Download](https://nodejs.org/))
- **pnpm** 8.0+ ([Install](https://pnpm.io/installation))
- **Git** 2.30+ ([Download](https://git-scm.com/))
- **Cuenta Vercel** (gratis en [vercel.com](https://vercel.com))
- **Cuenta Stripe** (sandbox, en [stripe.com](https://stripe.com))
- **Cuenta PayPal** (sandbox, en [paypal.com/developers](https://developer.paypal.com/))

### Verificar Instalación

```bash
# Node.js
node --version  # debe ser v18.17 o superior

# pnpm
pnpm --version  # debe ser 8.0 o superior

# Git
git --version   # debe estar instalado
```

---

## 🚀 Instalación

### 1. Clonar Repositorio

```bash
# HTTPS
git clone https://github.com/YOUR_ORG/ecommerce-mvp.git
cd ecommerce-mvp

# o SSH
git clone git@github.com:YOUR_ORG/ecommerce-mvp.git
cd ecommerce-mvp
```

### 2. Instalar Dependencias

```bash
# Instalar todas las dependencias
pnpm install

# Verificar instalación
pnpm list next react prisma
```

### 3. Crear archivos .env

```bash
# Copiar plantilla de variables de entorno
cp .env.example .env.local
```

### 4. Inicializar Base de Datos

```bash
# Correr migraciones de Prisma
pnpm prisma migrate dev --name init

# Generar cliente Prisma
pnpm prisma generate

# Seed de datos dummy (opcional, carga 100 productos de prueba)
pnpm prisma db seed
```

### 5. Generar Swagger Docs

```bash
# La documentación Swagger se genera automáticamente en /api-docs
# No requiere comando especial, se crea cuando corre dev server
```

---

## 🔑 Variables de Entorno

Edita `.env.local` con tus credenciales reales:

```bash
# ========== DATABASE ==========
DATABASE_URL="file:./prisma/dev.db"

# ========== PAYMENTS - STRIPE ==========
STRIPE_PUBLIC_KEY="pk_test_51234567890..."
STRIPE_SECRET_KEY="sk_test_51234567890..."
STRIPE_WEBHOOK_SECRET="whsec_1234567890..."

# ========== PAYMENTS - PAYPAL ==========
PAYPAL_CLIENT_ID="AaaBbBcC..."
PAYPAL_CLIENT_SECRET="aaaBBBccc..."
PAYPAL_MODE="sandbox"  # o "live"

# ========== MAYORISTAS APIs ==========
# Ingram Micro
INGRAM_API_KEY="your_ingram_key"
INGRAM_API_URL="https://api.ingrammicro.com/v1"

# Distribuido
DISTRIBUIDO_API_KEY="your_distribuido_key"
DISTRIBUIDO_API_URL="https://api.distribuido.com.mx/v1"

# Synnex
SYNNEX_API_KEY="your_synnex_key"
SYNNEX_API_URL="https://api.synnex.com.mx/v1"

# ========== EMAILS ==========
RESEND_API_KEY="re_1234567890..."  # o SENDGRID_API_KEY
EMAIL_FROM="orders@ecommerce-mvp.com"

# ========== ANALYTICS & MONITORING ==========
SENTRY_DSN="https://xxxxx@sentry.io/1234567"
NEXT_PUBLIC_VERCEL_ENV="development"

# ========== VERCEL (Auto-populated on Vercel) ==========
# VERCEL_ENV será auto-seteado por Vercel en deploy
# VERCEL_URL será la URL del deploy preview
```

### Cómo obtener las credenciales

#### Stripe
1. Ir a [dashboard.stripe.com](https://dashboard.stripe.com/login)
2. Ir a **Developers → API Keys**
3. Copiar **Publishable Key** y **Secret Key**
4. Crear webhook en **Developers → Webhooks**, copiar **Signing Secret**

#### PayPal
1. Ir a [developer.paypal.com](https://developer.paypal.com/)
2. Login o crear cuenta
3. Ir a **Apps & Credentials**
4. Crear aplicación, copiar **Client ID** y **Secret**

#### Mayoristas
- **Ingram Micro**: Contactar sales@ingrammicro.com.mx
- **Distribuido**: Contactar api@distribuido.com.mx
- **Synnex**: Contactar integrations@synnex.com.mx

---

## 💻 Ejecutar en Desarrollo

### Opción 1: Dev Server + Hot Reload

```bash
# Iniciar dev server
pnpm dev

# El servidor estará en http://localhost:3000
# API docs en http://localhost:3000/api-docs
# Cambios se recargan automáticamente
```

### Opción 2: Build + Start (simular producción)

```bash
# Compilar TypeScript
pnpm build

# Iniciar servidor optimizado
pnpm start

# El servidor estará en http://localhost:3000
```

### Opción 3: Con Docker (opcional)

```bash
# Build imagen Docker
docker build -t ecommerce-mvp .

# Ejecutar contenedor
docker run -p 3000:3000 --env-file .env.local ecommerce-mvp
```

---

## 📁 Estructura del Proyecto

```
ecommerce-mvp/
├── app/
│   ├── (pages)/
│   │   ├── page.tsx                    # Home page
│   │   ├── catalog/
│   │   │   ├── page.tsx               # Product listing
│   │   │   └── [id]/page.tsx          # Product detail
│   │   ├── checkout/page.tsx           # Checkout flow
│   │   ├── order-tracking/[id]/page.tsx# Order tracking
│   │   └── admin/
│   │       ├── layout.tsx
│   │       ├── dashboard/page.tsx      # Admin dashboard
│   │       ├── inventory/page.tsx      # Stock management
│   │       └── billing-dummy/page.tsx  # Facturación placeholder
│   ├── api/
│   │   ├── products/route.ts           # GET /api/products
│   │   ├── mayoristas/
│   │   │   ├── ingram.ts              # Ingram service
│   │   │   ├── distribuido.ts         # Distribuido service
│   │   │   ├── synnex.ts              # Synnex service
│   │   │   └── sync/route.ts          # POST /api/mayoristas/sync
│   │   ├── orders/route.ts             # Order CRUD
│   │   ├── payments/
│   │   │   ├── intent/route.ts        # Stripe payment intent
│   │   │   ├── paypal-webhook/route.ts # PayPal webhook
│   │   │   └── stripe-webhook/route.ts # Stripe webhook
│   │   ├── checkout/route.ts           # Checkout logic
│   │   ├── cart/route.ts               # Cart operations
│   │   ├── admin/
│   │   │   ├── inventory/route.ts
│   │   │   └── promotions/route.ts
│   │   ├── emails/order-confirmation/route.ts
│   │   └── docs/swagger.ts             # OpenAPI spec
│   ├── layout.tsx                      # Root layout
│   └── globals.css
├── lib/
│   ├── db.ts                           # Prisma client
│   ├── types.ts                        # Shared TypeScript types
│   ├── stripe.ts                       # Stripe utilities
│   └── validators.ts                   # Zod schemas
├── components/
│   ├── ProductCard.tsx
│   ├── Cart.tsx
│   ├── Navbar.tsx
│   └── Admin/
├── prisma/
│   ├── schema.prisma                   # Database schema
│   ├── migrations/                     # Migration history
│   └── seed.ts                         # Seed script
├── __tests__/
│   ├── api.test.ts                     # Jest API tests
│   └── e2e/                            # Playwright E2E tests
├── public/
│   ├── branding/
│   │   ├── logo.svg
│   │   └── colors.json
│   └── images/
├── docs/
│   ├── README.md                       # This file
│   ├── TECHNICAL_SPEC.md              # Technical specification
│   ├── API.md                          # API documentation
│   └── DEPLOYMENT.md                   # Deployment guide
├── .github/workflows/
│   ├── tests.yml                       # Auto tests on push
│   ├── deploy-staging.yml              # Auto deploy staging
│   └── deploy-prod.yml                 # Auto deploy prod
├── .env.example                        # Template de variables
├── .env.local                          # Variables locales (IGNORED)
├── next.config.ts
├── tsconfig.json
├── jest.config.js
├── vercel.json                         # Vercel configuration
├── package.json
├── pnpm-lock.yaml
└── README.md                           # This file
```

---

## 📖 API Documentation

### Ver Documentación Interactiva

Una vez corriendo el dev server, ve a:

```
http://localhost:3000/api-docs
```

Ahí verás:
- ✅ Todos los endpoints disponibles
- ✅ Parámetros y tipos esperados
- ✅ Ejemplos de request/response
- ✅ Botón "Try it out" para testear en vivo

### Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| **GET** | `/api/products` | Listar productos |
| **GET** | `/api/products/[id]` | Detalle producto |
| **POST** | `/api/mayoristas/sync` | Sincronizar mayoristas |
| **POST** | `/api/orders` | Crear orden |
| **GET** | `/api/orders/[id]` | Detalle orden |
| **POST** | `/api/payments/intent` | Crear Stripe intent |
| **POST** | `/api/payments/webhook` | Stripe webhook |
| **GET** | `/api/admin/inventory` | Inventario admin |
| **POST** | `/api/admin/promotions` | Crear promoción |

Ver documentación completa en `/api-docs` o ver [API.md](./docs/API.md)

---

## 🧪 Testing

### Tests Unitarios + Integration (Jest)

```bash
# Correr todos los tests
pnpm test

# Correr tests en modo watch (reexecuta en cambios)
pnpm test:watch

# Correr tests con cobertura
pnpm test:coverage

# Correr tests específicos
pnpm test __tests__/api.test.ts
```

### Tests E2E (Playwright)

```bash
# Instalar browsers para Playwright
pnpm exec playwright install

# Correr tests E2E
pnpm test:e2e

# Correr E2E con UI interactivo
pnpm test:e2e --ui

# Correr E2E contra staging
PLAYWRIGHT_TEST_BASE_URL=https://staging.vercel.app pnpm test:e2e
```

### Pre-commit Hooks (Husky)

```bash
# Los tests se ejecutan automáticamente antes de hacer commit
# Si fallan, el commit se cancela (previene bugs en main)

# Para hacer commit sin pasar tests (emergencia)
git commit --no-verify
```

---

## 🌍 Deploy a Vercel

### 1. Conectar Repositorio a Vercel

```bash
# Caso 1: Ya tienes repo en GitHub
# Ve a https://vercel.com/new
# Selecciona tu repositorio
# Vercel detecta que es Next.js automáticamente

# Caso 2: Deploy desde línea de comandos
pnpm i -g vercel
vercel
```

### 2. Configurar Variables de Entorno en Vercel

```bash
# En Vercel Dashboard:
# Settings → Environment Variables
# Agregar todas las variables de .env.local

# O vía CLI:
vercel env add DATABASE_URL
vercel env add STRIPE_SECRET_KEY
# ... etc
```

### 3. Deploy a Staging (Preview)

```bash
# Automatizado: Cada PR a GitHub crea preview URL
# https://ecommerce-mvp-staging-xxxxx.vercel.app

# Manual:
vercel --prod=false
```

### 4. Deploy a Production

```bash
# Automático: Merge a main crea production deploy
# https://ecommerce-mvp.vercel.app

# Manual:
vercel --prod
```

### 5. Ver Logs en Vercel

```bash
# En Vercel Dashboard:
# Deployments → Select deployment → Logs

# O vía CLI:
vercel logs
```

Ver [DEPLOYMENT.md](./docs/DEPLOYMENT.md) para detalles completos.

---

## 🔧 Comandos Útiles

```bash
# ========== INSTALACIÓN Y SETUP ==========
pnpm install                           # Instalar dependencias
pnpm install --frozen-lockfile         # Instalar exactas (CI/CD)

# ========== DESARROLLO ==========
pnpm dev                               # Dev server con hot reload
pnpm build                             # Build para producción
pnpm start                             # Iniciar servidor producción
pnpm lint                              # Lint y format code

# ========== TESTING ==========
pnpm test                              # Correr tests Jest
pnpm test:watch                        # Tests con watch mode
pnpm test:coverage                     # Tests + coverage report
pnpm test:e2e                          # Tests Playwright

# ========== DATABASE ==========
pnpm prisma migrate dev --name NAME    # Crear migración
pnpm prisma migrate deploy             # Aplicar migraciones (prod)
pnpm prisma studio                     # GUI interactiva para DB
pnpm prisma db seed                    # Seed de datos
pnpm prisma db push                    # Sync schema (dev)

# ========== DOCUMENTACIÓN ==========
pnpm docs:generate                     # Generar docs automáticos
pnpm docs:serve                        # Servir docs localmente

# ========== LIMPIEZA ==========
pnpm clean                             # Limpiar cache y .next/
pnpm install --force                   # Reinstalar dependencias forzadamente
```

---

## 🆘 Troubleshooting

### Problema: `pnpm: command not found`
```bash
# Solución: Instalar pnpm globalmente
npm install -g pnpm@latest

# Verificar
pnpm --version
```

### Problema: `DATABASE_URL not found`
```bash
# Solución: Crear .env.local
cp .env.example .env.local

# Editar .env.local con tus valores
# Si está vacio, usa valor por defecto:
DATABASE_URL="file:./prisma/dev.db"
```

### Problema: `Error: Could not connect to database`
```bash
# Solución: Ejecutar migraciones
pnpm prisma migrate dev

# Si siguue fallando, resetear DB:
pnpm prisma migrate reset  # ⚠️ Borra todos los datos
```

### Problema: `Port 3000 already in use`
```bash
# Solución 1: Usar otro puerto
pnpm dev -- -p 3001

# Solución 2: Matar proceso en puerto 3000
# En macOS/Linux:
lsof -ti:3000 | xargs kill -9

# En Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Problema: `Stripe/PayPal keys invalid`
```bash
# Verificar que están en .env.local (NO en .env)
# Verificar que NO son nulos o vacíos:
cat .env.local | grep STRIPE

# Si cambias keys, reinicia dev server:
pnpm dev
```

### Problema: Tests fallan con `Cannot find module`
```bash
# Solución: Regenerar cliente Prisma
pnpm prisma generate

# Reinstalar node_modules
rm -rf node_modules
pnpm install
```

### Problema: Vercel deploy falla
```bash
# 1. Verificar variables en Vercel Dashboard
# 2. Correr build localmente
pnpm build

# 3. Check de error en Vercel logs
vercel logs --follow

# 4. Si todo falla, redeploy:
vercel redeploy
```

Ver documentación completa en `docs/TROUBLESHOOTING.md`

---

## 📚 Recursos

### Documentación Oficial
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Stripe API Docs](https://stripe.com/docs/api)
- [PayPal Docs](https://developer.paypal.com/docs/)

### Herramientas
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Stripe Dashboard](https://dashboard.stripe.com/)
- [Prisma Studio](http://localhost:5555) (ejecutar `pnpm prisma studio`)
- [Swagger UI](http://localhost:3000/api-docs)

### Guías Internas
- [TECHNICAL_SPEC.md](./docs/TECHNICAL_SPEC.md) — Especificaciones técnicas detalladas
- [API.md](./docs/API.md) — Documentación de todos los endpoints
- [DEPLOYMENT.md](./docs/DEPLOYMENT.md) — Guía de deployment
- [CHANGELOG.md](./CHANGELOG.md) — Historial de cambios del proyecto

### Mayoristas - Contactos & Documentación
- **Ingram Micro**
  - API Docs: [partner.cloud.ingram.com](https://partner.cloud.ingram.com)
  - Contacto: integrations@ingrammicro.com.mx

- **Distribuido**
  - API Docs: [api.distribuido.com.mx/docs](https://api.distribuido.com.mx/docs)
  - Contacto: api@distribuido.com.mx

- **Synnex**
  - API Docs: [integrations.synnex.com.mx](https://integrations.synnex.com.mx)
  - Contacto: devops@synnex.com.mx

---

## 📞 Soporte y Contacto

### Para Problemas de Setup
1. Revisar [Troubleshooting](#troubleshooting) arriba
2. Revisar logs: `pnpm dev` output
3. Verificar variables `.env.local`
4. Revisar [GitHub Issues](https://github.com/YOUR_ORG/ecommerce-mvp/issues)

### Para Mejoras o Features
- Crear [GitHub Discussion](https://github.com/YOUR_ORG/ecommerce-mvp/discussions)
- Revisar [CHANGELOG.md](./CHANGELOG.md) para roadmap post-MVP

### Equipo de Desarrollo
- **Senior Full Stack**: TBD
- **IA Assistance**: GitHub Copilot, Claude API, Cursor IDE

---

## 📄 Licencia

[MIT License](./LICENSE) - Usa este código libremente en tus proyectos.

---

## 🎯 Próximos Pasos

1. ✅ **Clone el repo**
   ```bash
   git clone https://github.com/YOUR_ORG/ecommerce-mvp.git
   cd ecommerce-mvp
   ```

2. ✅ **Instala dependencias**
   ```bash
   pnpm install
   ```

3. ✅ **Configura .env**
   ```bash
   cp .env.example .env.local
   # Edita .env.local con tus valores
   ```

4. ✅ **Inicia dev server**
   ```bash
   pnpm dev
   ```

5. ✅ **Abre en navegador**
   ```
   http://localhost:3000
   http://localhost:3000/api-docs (Swagger)
   ```

---

**¡Listo para desarrollar! 🚀**

*Para preguntas o problemas, revisar Troubleshooting o crear issue en GitHub.*

---

**Última actualización**: 13 Abril 2026  
**Versión**: 1.0.0-MVP  
**Status**: En Desarrollo (Semana 1/6)
