import { validateEnv } from "../lib/config/env";

/**
 * Script de CLI para validar el entorno antes de procesos críticos.
 */
/* eslint-disable no-console */
console.log("🛡️ [TECNO Guard] Iniciando escaneo de seguridad de entorno...");

try {
  validateEnv();
  console.log(
    "✅ [TECNO Guard] Entorno validado con éxito. Todo listo para operar.",
  );
  process.exit(0);
} catch {
  // El error ya fue reportado por validateEnv a la consola
  process.exit(1);
}
/* eslint-enable no-console */
