# 🛡️ Guía de Pruebas - TECNO Ecommerce

Este documento describe el stack de pruebas utilizado para garantizar la integridad de la plataforma **TECNO**, cubriendo desde la identidad de marca hasta los flujos criticos de autenticación.

## 🚀 Inicio Rápido

Para ejecutar todas las pruebas del suite:

```bash
npx jest
```

## 🧪 Pruebas Disponibles

### 🔐 1. Lógica de Autenticación

**Archivo:** `__tests__/login-logic.test.ts`
Valida que el sistema de login (NextAuth + Prisma) funcione correctamente con las credenciales oficiales.

- **Caso Éxito:** `admin@tecno.com` / `Admin123`
- **Casos Error:** Password incorrecto, Usuario no encontrado.

### 🎨 2. Identidad Boutique (Branding)

**Archivo:** `__tests__/boutique-identity.test.ts`
Asegura que la marca dinámica **TECNO** se inyecte correctamente en todos los componentes del sistema sin referencias residuales a marcas antiguas.

### 📸 3. Búsqueda y Mayoristas

**Archivo:** `__tests__/mayorista-integration.test.ts` (Próximamente)
Validará la integración con las APIs de Ingram, Synnex y Distribuidor.

---

## 🛠️ Herramientas de Diagnóstico

Si encuentras problemas con la sesión en el entorno de desarrollo, puedes usar el script de telemetría directo:

```bash
npx tsx scripts/test-auth.ts
```

## 📝 Mejores Prácticas

1. **Limpieza de Caché:** Si los cambios en el código no se reflejan en los tests, usa `npx jest --clearCache`.
2. **Entorno:** Asegúrate de que el archivo `.env` tenga la configuración correcta de `DATABASE_URL` para SQLite.
3. **Seeding:** Antes de los tests, se recomienda haber ejecutado las semillas: `npx tsx prisma/seed-admin.ts`.

---

_Garantizando la excelencia tecnológica en cada despliegue._ 💎🚀🛡️
