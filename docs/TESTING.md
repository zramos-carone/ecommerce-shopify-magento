# 🛡️ Estrategia de Calidad y Testing - MaxTech

Este documento describe el ecosistema de pruebas y las garantías de calidad implementadas en la plataforma MaxTech. Nuestra filosofía es **"Cero Defectos en Producción"**, utilizando un pipeline de validación automatizado.

## 🛠️ Herramientas de Calidad

- **Jest**: Motor de pruebas unitarias para lógica de negocio y APIs.
- **ESLint**: Linter estricto para asegurar legibilidad y prevenir errores de código muerto.
- **TypeScript (TSC)**: Validación de tipado estricto para prevenir errores en tiempo de ejecución.
- **Husky & lint-staged**: Guardianes de pre-commit que aseguran que ningún código "sucio" llegue al repositorio.

## 🚀 Comandos Principales

Ejecuta estos comandos desde la raíz del proyecto utilizando `pnpm`:

| Comando              | Descripción                                                             |
| :------------------- | :---------------------------------------------------------------------- |
| `pnpm test`          | Ejecuta todas las pruebas unitarias disponibles.                        |
| `pnpm test:watch`    | Ejecuta las pruebas en modo interactivo (ideal para desarrollo).        |
| `pnpm test:coverage` | Genera un reporte detallado de qué porcentaje del código está cubierto. |
| `pnpm validate`      | **La Aduana Central.** Ejecuta Lint + Type Check + Tests.               |

## 🛡️ El Quality Gate (Husky)

Hemos configurado un "Aduana de Seguridad" que actúa automáticamente cada vez que intentas hacer un `git commit`:

1.  **Filtrado**: Solo analiza los archivos que has modificado (`lint-staged`).
2.  **Reparación**: Intenta corregir errores de estilo automáticamente (`eslint --fix`).
3.  **Validación**: Si hay errores de Linting, de Tipado o si falla una sola prueba unitaria, **el commit es rechazado**.

Esto garantiza que el historial de Git siempre contenga código estable y verificado.

## 🧪 Pruebas Especializadas

### Identidad Boutique (`__tests__/boutique-identity.test.ts`)

Esta prueba es crítica para el negocio. Valida que:

- Los mayoristas se oculten bajo la identidad **MAXTECH**.
- Las fotos genéricas del mayorista se filtren si no hay un override local ("Política Anti-Ugly-Photo").
- Los precios y nombres locales definidos en el Admin tengan prioridad absoluta.

## 📈 Mejores Prácticas

1.  **No subas código con `any`**: El `type-check` fallará.
2.  **Limpia tus variables**: El linter bloqueará el build si dejas variables o importaciones sin usar.
3.  **Pruebas primero**: Si creas una nueva API en `app/api`, asegúrate de añadir su correspondiente test en `__tests__`.

---

_Calidad MaxTech: Diseñado para durar, programado para ganar._ 🚀🛡️💎
