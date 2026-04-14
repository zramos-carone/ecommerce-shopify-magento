# Día 2: Vercel + GitHub Auto-Deploy - Instrucciones Ejecutivas

**Fecha**: Día 2 del Proyecto  
**Timeline**: ~2-3 horas (mayormente espera de configuración)  
**Entregable Final**: Vercel Deploy ✅ + GitHub Repo ✅ + Auto-Deploy en Push ✅

---

## 📋 Checklist del Día 2

- [ ] Crear repositorio en GitHub
- [ ] Hacer commit inicial de todo el código
- [ ] Push al repositorio GitHub
- [ ] Conectar Vercel a GitHub (OAuth)
- [ ] Configurar proyecto en Vercel
- [ ] Setupear variables de entorno en Vercel
- [ ] Probar deploy automático (push a main = deploy)
- [ ] Configurar rama develop (para preview URLs)
- [ ] Documentar URLs de production y staging

---

## 🚀 Paso a Paso

### 1️⃣ Verificar Git Local (5 min)

```bash
# Ver estado actual
git status

# Debe mostrar algo como:
# On branch master
# Changes not staged for commit:
#   (use "git add <file>..." to update the index)
#   deleted:    plan.md

# Hacer commit de todo
git add .
git commit -m "Initial commit: Ecommerce MVP Day 1 complete"

# Ver logs
git log --oneline
# Debe mostrar al menos 1 commit
```

---

### 2️⃣ Crear Repositorio en GitHub (5 min)

**Opción A: Si tienes acceso a GitHub**

1. Ve a https://github.com/new
2. **Nombre del repositorio**: `ecommerce-mvp` (o tu preferencia)
3. **Descripción**: "Plataforma ecommerce MVP para venta de productos tecnológicos en México"
4. **Privado o Público**: Tu elección (privado = mejor para MVP)
5. **NO inicialices** con README (ya tienes uno)
6. Click "Create repository"

**Resultado esperado**:
```
https://github.com/tu-usuario/ecommerce-mvp
```

---

### 3️⃣ Conectar Local a GitHub (5-10 min)

Ejecuta estos comandos en la terminal:

```bash
# Ver el remote actual (debería estar vacío o apuntar a otro lugar)
git remote -v

# Si existe origin anterior, remover:
git remote remove origin

# Agregar el nuevo remote (reemplaza TU-USUARIO)
git remote add origin https://github.com/TU-USUARIO/ecommerce-mvp.git

# Verificar
git remote -v
# Debe mostrar:
# origin  https://github.com/TU-USUARIO/ecommerce-mvp.git (fetch)
# origin  https://github.com/TU-USUARIO/ecommerce-mvp.git (push)

# Crear main como branch principal
git branch -M main

# Push inicial a GitHub
git push -u origin main

# Verifica en GitHub: https://github.com/TU-USUARIO/ecommerce-mvp
```

**Si pide autenticación**:
- GitHub ya no acepta contraseña + usuario
- Necesitas **Personal Access Token** (PAT)
  1. Ve a https://github.com/settings/tokens
  2. Click "Generate new token (classic)"
  3. Permisos: `repo` (todos) + `workflow`
  4. Copia el token (aparece solo 1 vez)
  5. Usa como contraseña en lugar de tu password

**Alternativa (más fácil)**: Usar SSH
```bash
# Configurar SSH (una sola vez)
# https://docs.github.com/en/authentication/connecting-to-github-with-ssh

# Luego:
git remote remove origin
git remote add origin git@github.com:TU-USUARIO/ecommerce-mvp.git
git push -u origin main
```

---

### 4️⃣ Conectar Vercel a GitHub (10 min)

1. Ve a https://vercel.com/dashboard
2. Si no tienes cuenta, crea una (recomendado: login con GitHub)
3. Click **"Add New..."** → **"Project"**
4. Debería mostrarte tus repos de GitHub
5. Busca y selecciona **`ecommerce-mvp`**
6. Click **"Import"**

**Pantalla de Configuración de Vercel**:
- **Project Name**: `ecommerce-mvp` (auto-rellenado)
- **Framework Preset**: Next.js (auto-detectado)
- **Root Directory**: `./` (correcto)
- **Build Command**: `pnpm build` (auto-detectado)
- **Output Directory**: `.next` (auto-detectado)
- **Install Command**: `pnpm install` (auto-detectado)

Click **"Deploy"**

**Espera ~3-5 minutos** mientras Vercel:
1. Clona el repo
2. Instala dependencias
3. Compila el proyecto
4. Despliega a producción

---

### 5️⃣ Configurar Variables de Entorno en Vercel (5 min)

Vercel necesita los mismos `.env` que tienes localmente:

1. En Vercel, ve a tu proyecto → **"Settings"** → **"Environment Variables"**
2. Agrega estas variables (según tu `.env.local` actual):

```
DATABASE_URL=file:./prisma/dev.db
NEXT_PUBLIC_API_URL=https://tu-dominio-vercel.vercel.app

# Stripe (obtener desde dashboard Stripe)
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal (obtener desde PayPal Sandbox)
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_MODE=sandbox

# Mayoristas
INGRAM_API_KEY=...
INGRAM_API_URL=...
DISTRIBUIDO_API_KEY=...
DISTRIBUIDO_API_URL=...
SYNNEX_API_KEY=...
SYNNEX_API_URL=...

# Email
RESEND_API_KEY=...
EMAIL_FROM=noreply@tudominio.com

# Analytics
SENTRY_DSN=...
VERCEL_ENV=production
```

**Para MVP: Puedes dejar en blanco** servicios como Stripe/PayPal por ahora, ya que aún no están integrados.

**Importante**: 
- Cada variable agregada debe hacer click en **"Save"**
- Las variables no aparecen en logs (seguro)

---

### 6️⃣ Deploy Automático en Push (2 min)

**Vercel está ya configurado para auto-deploy**. Pruébalo:

```bash
# Hacer un cambio pequeño (ej: editar la bienvenida)
# Luego:
git add .
git commit -m "Test: Update welcome message"
git push origin main

# Vercel debería iniciar deploy automáticamente
# Ve a https://vercel.com/dashboard/projects/ecommerce-mvp
# Verás el nuevo "Deployment" en progress
```

**Espera unos 2-3 minutos y verás**:
- ✅ "Deployment Successful"
- URL en vivo: `https://ecommerce-mvp-[random].vercel.app`

---

### 7️⃣ Configurar Rama Develop (Staging) - OPCIONAL (5 min)

Para tener un **staging environment** separado:

1. Crear rama develop localmente:
```bash
git checkout -b develop
git push -u origin develop
```

2. En Vercel, ve a **"Settings"** → **"Git"**
3. Encontrar **"Production Branch"**: debe ser `main`
4. Agregar **"Preview Branches"**: agrega `develop`
5. Cada push a `develop` = preview URL automática (sin afectar producción)

**Resultado**:
- `main` → https://ecommerce-mvp.vercel.app (producción)
- `develop` → https://developed-ecommerce-mvp.vercel.app (staging)
- `feature/*` → URLs dinámicas de preview

---

### 8️⃣ Verificar Deployment (5 min)

```bash
# 1. Visita tu URL de Vercel (ej: https://ecommerce-mvp-abc123.vercel.app)
# 2. Deberías ver la misma página que en localhost:3000 ✅

# 3. Verifica que funciona:
# - Navigation bar visible
# - Status board visible (Día 1 ✅)
# - Botones clickeables
# - No errores en console (F12 → Console)

# 4. Verifica dominios alternativos:
https://ecommerce-mvp.vercel.app  # Dominio principal
https://vercel.live              # Vercel.live inspector
```

---

## 🎯 Resultado Esperado

**Al final de Día 2 tendrás**:

### URLs en Vivo
- 🟢 **Production**: https://ecommerce-mvp.vercel.app (auto-actualiza en push a `main`)
- 🟡 **Staging**: https://developed-ecommerce-mvp.vercel.app (auto-actualiza en push a `develop`)
- 🔵 **GitHub Repo**: https://github.com/TU-USUARIO/ecommerce-mvp (código fuente)

### CI/CD Pipeline Funcional
```
Flujo:
1. Developer hace commit local
2. Git push origin main/develop
3. GitHub recibe el push
4. Vercel webhook se dispara
5. Vercel clona, instala, compila
6. Si OK → deploy automático
7. Si error → notificación por email
```

### Verificaciones Post-Vercel
- ✅ Home page en https://ecommerce-mvp.vercel.app
- ✅ No errores en console del navegador
- ✅ API docs en `/api-docs` (si está implementado)
- ✅ Logs de Vercel muestran "Build Successful"

---

## 📌 Troubleshooting

### Error: "Repository not found"
**Causa**: GitHub no está conectado a Vercel
**Solución**:
1. Ve a https://vercel.com/account/settings/git-integration
2. Conecta GitHub (autoriza Vercel en GitHub)
3. Reintentar importar proyecto

### Error: "Build failed"
**Causa**: Falta dependencia o error en código
**Solución**:
1. Revisa logs en Vercel dashboard → "Deployments" → último build
2. Busca el error específico
3. Arregla localmente: `pnpm lint`, `pnpm type-check`, `pnpm build`
4. Commit y push: auto-deploy debería funcionar

### Error: "DATABASE_URL not set"
**Causa**: Variables de entorno no configuradas en Vercel
**Solución**:
1. Ve a Vercel → `Settings` → `Environment Variables`
2. Verifica que `DATABASE_URL` esté definida
3. Reinicia el deployment: click botón "Redeploy"

### La página se ve diferente en Vercel vs localhost
**Causa**: Posiblemente cache o variables no propagadas
**Solución**:
1. Hard refresh en navegador: `Ctrl+Shift+R` (Windows) o `Cmd+Shift+R` (Mac)
2. Vaciar cache de Vercel: `Settings` → botón "Redeploy"
3. Esperar 1-2 minutos

---

## 📚 Comandos Útiles para Día 2

```bash
# Ver estado de origin
git remote -v

# Ver todas las ramas
git branch -a

# Crear rama develop si no existe
git checkout -b develop
git push -u origin develop

# Cambiar entre ramas
git checkout main
git checkout develop

# Ver logs
git log --oneline --graph --all

# Deshacer commit (sin perder cambios)
git reset --soft HEAD~1

# Forzar sincronización con GitHub
git fetch origin
git pull origin main
```

---

## ✅ Checklist Final Día 2

- [ ] GitHub repo creado y conectado
- [ ] Código pusheado a GitHub (visible en https://github.com/TU-USUARIO/ecommerce-mvp)
- [ ] Vercel proyecto importado
- [ ] Deploy #1 exitoso en Vercel
- [ ] Variables de entorno configuradas
- [ ] URL en vivo funciona: https://ecommerce-mvp-?.vercel.app
- [ ] Auto-deploy probado: commit → push → deploy automático ✅
- [ ] Rama develop creada (opcional pero recomendado)

---

## 🎯 Próximo: Día 3

**Día 3**: Comenzar Integración de Mayoristas
- [ ] Crear servicios para Ingram Micro API
- [ ] Crear rutas `/api/mayoristas/search`
- [ ] Testear conexión a APIs (mock si no tienes credenciales aún)
- [ ] Seed base de datos con productos de prueba

Ver `docs/DAY3.md` (a crear Día 3) para siguientes pasos.

---

**Estado**: ✅ Día 2 Completado  
**Timestamp**: 13 Abril 2026  
**Próximo**: Día 3 (Mayoristas APIs)
