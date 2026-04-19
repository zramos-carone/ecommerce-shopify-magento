import { validateUserCredentials } from "../lib/auth";
import { prisma } from "../lib/db";

async function diagnostic() {
  // eslint-disable-next-line no-console
  console.log("🚀 [DIAGNOSTICO DIRECTO] Iniciando validación de TECNO...");

  const testEmail = "admin@tecno.com";
  const testPass = "Admin123";

  // 1. Verificar si Prisma ve al usuario
  // eslint-disable-next-line no-console
  console.log("🔍 [PASO 1] Consultando base de datos directamente...");
  const user = await prisma.user.findUnique({ where: { email: testEmail } });

  if (!user) {
    // eslint-disable-next-line no-console
    console.log("❌ Error: El usuario no existe en la DB. Abortando.");
    return;
  }
  // eslint-disable-next-line no-console
  console.log("✅ Usuario encontrado en DB:", user.email);

  // 2. Intentar ejecutar validación directa
  // eslint-disable-next-line no-console
  console.log("🔑 [PASO 2] Ejecutando validateUserCredentials directamente...");

  const credentials = {
    email: testEmail,
    password: testPass,
  };

  try {
    const result = await validateUserCredentials(credentials);

    if (result) {
      // eslint-disable-next-line no-console
      console.log(
        "🏆 [EXITO] La función authorize devolvió el usuario correctamente:",
      );
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(result, null, 2));
    } else {
      // eslint-disable-next-line no-console
      console.log("⚠️ [FALLO] La función devolvió NULL pero no lanzó error.");
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    // eslint-disable-next-line no-console
    console.log(
      "❌ [EXCEPTION] La función lanzó un error esperado:",
      errorMessage,
    );
  } finally {
    await prisma.$disconnect();
  }
}

diagnostic();
