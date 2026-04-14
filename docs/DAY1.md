# Día 1: Setup & Infra - Instrucciones Ejecutivas

**Fecha**: Inicio Proyecto  
**Timeline**: ~6-8 horas de trabajo  
**Entregable Final**: GitHub repo + Vercel connected + Swagger inicializado + SQLite local.db

---

## 📋 Checklist del Día 1

- [ ] Instalar dependencias Node.js
- [ ] Clonar/crear repositorio Git
- [ ] Configurar archivo `.env.local`
- [ ] Crear y probar base de datos SQLite
- [ ] Iniciar servidor dev local
- [ ] Verificar estructura de carpetas
- [ ] Tested en navegador http://localhost:3000

---

## 🚀 Paso a Paso

### 1️⃣ Prerequisitos (15 min)

Verificar que tienes instalado:

```bash
# Node.js 18.17+
node --version
> v18.17.0

# pnpm 8.0+
pnpm --version
> 8.0.0

# Git 2.30+
git --version
> git version 2.30.0
```

Si no tienes pnpm, instálalo:
```bash
npm install -g pnpm@latest
```

---

### 2️⃣ Clonar Repositorio (10 min)

```bash
# Navegar a carpeta de proyectos
cd ~/Documents/ecommerce

# El repo ya existe, entrar:
cd ecommerce-mvp

# Ver archivos creados
ls -la
```

**Archivos esperados** (creados en Día 1):
```
ecommerce-mvp/
├── package.json ✅
├── tsconfig.json ✅
├── next.config.ts ✅
├── .env.example ✅
├── vercel.json ✅
├── prisma/
│   └── schema.prisma ✅
├── app/
│   ├── layout.tsx ✅
│   ├── page.tsx ✅
│   ├── globals.css ✅
│   └── api/ (vacío, para Día 2+)
├── lib/
│   └── db.ts ✅
├── docs/
│   ├── PLAN.md
│   ├── README.md
│   └── CHANGELOG.md
└── README.md
```

---

### 3️⃣ Instalar Dependencias (5-10 min)

```bash
# Instalar todas las dependencias
pnpm install

# Verificar instalación
pnpm list next react prisma
# debe mostrar:
# react@18.2.0
# next@14.0.0
# @prisma/client@5.5.0
```

**Tiempo aprox**: 2-3 min (primero), rápido en futuro.

---

### 4️⃣ Configurar Variables de Entorno (5 min)

```bash
# Copiar plantilla .env
cp .env.example .env.local

# Editar archivo
# En VSCode: Open .env.local
# Dejar los valores por defecto por ahora (SQLite local):
DATABASE_URL="file:./prisma/dev.db"

# Los demás valores (Stripe, PayPal, mayoristas) completar post-Día 3
# Por ahora dejar tal cual en .env.example
```

**⚠️ Importante**: `.env.local` NO se sube a Git (en .gitignore)

---

### 5️⃣ Crear & Migrar Base de Datos (5 min)

```bash
# Generar cliente Prisma
pnpm prisma generate

# Crear migraciones e inicializar DB
pnpm prisma migrate dev --name init

# El sistema preguntará:
# ✔ Enter a name for this migration › init
# ✔ Yes, I confirm (crear el archivo dev.db)

# Verificar que SQLite fue creado
ls -la prisma/dev.db
# debe existir: prisma/dev.db
```

**Resultado esperado**: 
- Archivo `prisma/dev.db` creado ✅
- Tablas: User, Product, Cart, Order, Payment, etc. ✅

---

### 6️⃣ Iniciar Servidor de Desarrollo (3 min)

```bash
# Iniciar dev server
pnpm dev

# Esperado:
# ▲ Next.js 14.0.0
# - Local:        http://localhost:3000
# - Environments: .env.local
#
# ✔ Ready in 1.23s
```

El servidor está corriendo. Mantén esta terminal abierta.

---

### 7️⃣ Verificar en Navegador (5 min)

Abre navegador web:

#### Home Page
```
http://localhost:3000
```

Deberías ver:
- Header con nav: "🛍️ Ecommerce MVP"
- Hero section: "Bienvenido a Ecommerce MVP"
- Status board: "Productos", "Pagos", "API"
- Estado Día 1 con checks verdes ✅

#### API Docs (Swagger)
```
http://localhost:3000/api-docs
```

Deberías ver:
- Swagger UI cargado
- Mensaje: "No API definitions yet" (normal, falta código Día 2+)

---

### 8️⃣ Verificar Estructura & Git (5 min)

```bash
# Verificar estructura de archivos
find app lib prisma public -type f | head -20

# Iniciar Git (si no está)
git init
git add .
git commit -m "Día 1: Setup Next.js + SQLite + Swagger skeleton"

# Verificar estado
git status
# debe mostrar: "nothing to commit, working tree clean"
```

---

## 📊 Deliverables del Día 1

### ✅ Archivos Creados
- `package.json` — Dependencias (Next.js, React, Prisma, Stripe, etc.)
- `next.config.ts` — Configuración Next.js
- `tsconfig.json` — TypeScript config
- `.env.example` — Template de variables (NO commiteado: .env.local es local)
- `vercel.json` — Config para Vercel deploy (Día 2)
- `prisma/schema.prisma` — Database schema (User, Product, Order, etc.)
- `app/layout.tsx` — Root layout con nav
- `app/page.tsx` — Home page con status board
- `app/globals.css` — Estilos Tailwind
- `lib/db.ts` — Prisma client singleton
- `docs/DAY1.md` — Este archivo

### ✅ Funcionalidad Verificada
- **Home Page**: http://localhost:3000 ✅ Working
- **Dev Server**: Corriendo en localhost:3000 ✅
- **Database**: SQLite inicializado (prisma/dev.db) ✅
- **TypeScript**: Compilando sin errores ✅
- **Structure**: Carpetas y archivos en lugar (Next.js App Router) ✅

### ✅ Listo para Día 2
- Repo Git con estructura base
- Next.js fullstack ready
- Prisma ORM con schema definido
- Vercel config prepped (deploy Día 2)

---

## 🆘 Troubleshooting - Día 1

### Error: `pnpm: command not found`
```bash
npm install -g pnpm@latest
pnpm --version  # verificar
```

### Error: `DATABASE_URL not found`
```bash
# Verificar que .env.local existe
cat .env.local

# Si falta, copiar:
cp .env.example .env.local
```

### Error: `prisma/dev.db not found`
```bash
# Correr migraciones:
pnpm prisma migrate dev --name init
```

### Error: `Port 3000 already in use`
```bash
# Usar otro puerto:
pnpm dev -- -p 3001

# O matar el proceso en 3000:
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Error: `Module not found`
```bash
# Reinstalar node_modules:
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## 📝 Notas Técnicas

### Estructura Next.js (App Router)
```
app/           → Pages + API routes (Next.js 14 App Router)
├── layout.tsx → Root layout (nav, footer)
├── page.tsx   → Home page (/)
├── globals.css → Estilos globales
└── api/       → API routes (para Día 2+)
  └── docs/    → Swagger/OpenAPI (para Día 2+)

lib/           → Funciones y utilidades
├── db.ts      → Prisma client

prisma/        → Database
├── schema.prisma → Definición de tablas
└── dev.db     → Archivo SQLite (generado, NO commiteado)

public/        → Assets estáticos
└── branding/  → Logo, colores (para Día 21+)
```

### Stack Tech - Día 1
| Componente | Versión | Propósito |
|-----------|---------|-----------|
| Next.js | 14.0+ | Framework fullstack |
| React | 18.2+ | UI Components |
| TypeScript | 5.3+ | Type safety |
| Prisma | 5.5+ | ORM para SQLite |
| SQLite | Latest | Database local |
| Tailwind | 3.3+ | Styling |
| pnpm | 8.0+ | Package manager |

### Database Schema (Día 1)
Tablas creadas por Prisma:
- `User` — Usuarios (customer, admin)
- `Product` — Productos del catálogo
- `Cart` — Carrito de compras
- `CartItem` — Items en carrito
- `Order` — Órdenes completadas  
- `OrderItem` — Items de órdenes
- `Address` — Direcciones de usuarios
- `Payment` — Registro de pagos
- `MayoristaSync` — Logs de sincronización mayoristas

---

## ✅ Checklist Final Día 1

- [x] Node.js + pnpm verificados
- [x] Repo clonado/creado
- [x] Dependencias instaladas (`pnpm install`)
- [x] `.env.local` configurado
- [x] Base de datos iniciada (`pnpm prisma migrate dev`)
- [x] Dev server corriendo (`pnpm dev`)
- [x] Home page visible en http://localhost:3000 ✅
- [x] Estructura Git con commit inicial
- [x] Documentación DAY1.md completada

---

## 🎯 Próximo: Día 2

**Día 2**: Vercel Connect + Deploy Automático + GitHub Integration
- [ ] Crear/conectar repositorio GitHub
- [ ] Conectar Vercel a GitHub
- [ ] Configurar deploy automático
- [ ] Probar preview US en ramasdevelop/feature

Ver `docs/DAY2.md` (a crear Día 2) para siguientes pasos.

---

**Estado**: ✅ Día 1 Completado  
**Timestamp**: 13 Abril 2026  
**Próximo**: Día 2 (Vercel Deploy)
