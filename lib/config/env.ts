import { z } from "zod";

/**
 * Esquema de validación para las variables de entorno de TECNO.
 * Define qué variables son obligatorias y valida su formato.
 */
const envSchema = z.object({
  // ========== ENVIRONMENT ==========
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // ========== DATABASE ==========
  DATABASE_URL: z
    .string({
      required_error:
        "❌ DATABASE_URL es obligatoria para conectar con el núcleo de datos.",
    })
    .min(1, "DATABASE_URL no puede estar vacía."),

  // ========== AUTH ==========
  NEXTAUTH_SECRET: z
    .string({
      required_error:
        "❌ NEXTAUTH_SECRET es obligatoria para cifrar las sesiones de TECNO.",
    })
    .min(
      16,
      "NEXTAUTH_SECRET debe tener al menos 16 caracteres para ser segura.",
    ),

  NEXTAUTH_URL: z
    .string({
      required_error:
        "❌ NEXTAUTH_URL es obligatoria para el flujo de autenticación.",
    })
    .url("NEXTAUTH_URL debe ser una URL válida."),

  // ========== APP CONFIG ==========
  NEXT_PUBLIC_APP_NAME: z.string().default("TECNO Ecommerce"),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),

  // ========== PAYMENTS (Opcionales en modo Sandbox) ==========
  STRIPE_SECRET_KEY: z.string().optional(),
  PAYPAL_CLIENT_ID: z.string().optional(),
});

/**
 * Función que valida las variables de entorno actuales.
 * Lanza un error descriptivo si algo falta o está mal configurado.
 */
export const validateEnv = () => {
  try {
    const parsed = envSchema.safeParse(process.env);

    if (!parsed.success) {
      const { errors } = parsed.error;

      /* eslint-disable no-console */
      console.error("🛡️ [TECNO Guard] Error de configuración detectado:");
      errors.forEach((err) => {
        console.error(`   ⚠️  ${err.path.join(".")}: ${err.message}`);
      });
      /* eslint-enable no-console */

      // En servidor (build/runtime), lanzamos error para detener la ejecución insegura
      if (typeof window === "undefined") {
        throw new Error(
          "Configuración de entorno inválida. Revisa los logs de TECNO Guard.",
        );
      }
    }

    return parsed.data;
  } catch (error) {
    if (typeof window === "undefined") {
      /* eslint-disable no-console */
      console.error("❌ Error crítico en el validador de entorno:", error);
      /* eslint-enable no-console */
      process.exit(1);
    }
  }
};

// Exportamos las variables tipadas y validadas
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const env =
  typeof window === "undefined" ? (validateEnv() as any) : ({} as any);
