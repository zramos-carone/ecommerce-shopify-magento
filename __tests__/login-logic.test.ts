import { validateUserCredentials } from "../lib/auth";
import { prisma } from "../lib/db";
import bcrypt from "bcryptjs";

/**
 * @jest-environment node
 */

describe("🛡️ Integración de Autenticación (TECNO)", () => {
  const testEmail = "admin@tecno.com";
  const correctPassword = "Admin123";
  const wrongPassword = "passwordIncorrecto789";

  beforeAll(async () => {
    // Asegurar que el usuario de prueba existe con el password oficial
    const hash = await bcrypt.hash(correctPassword, 10);
    await prisma.user.upsert({
      where: { email: testEmail },
      update: { password: hash },
      create: {
        email: testEmail,
        password: hash,
        name: "Admin TECNO",
        role: "admin",
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("✅ DEBE aceptar credenciales oficiales (admin@tecno.com)", async () => {
    const credentials = {
      email: testEmail,
      password: correctPassword,
    };

    // Probamos la lógica interna directamente para mayor precisión
    const userResult = await validateUserCredentials(credentials);

    expect(userResult).not.toBeNull();
    expect(userResult?.email).toBe(testEmail);
    expect(userResult?.role).toBe("admin");
  });

  it("❌ DEBE rechazar contraseña incorrecta", async () => {
    const credentials = {
      email: testEmail,
      password: wrongPassword,
    };

    let errorThrown = false;
    try {
      await validateUserCredentials(credentials);
    } catch (error: unknown) {
      errorThrown = true;
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      // eslint-disable-next-line jest/no-conditional-expect
      expect(errorMessage).toBe("Contraseña incorrecta");
    }
    expect(errorThrown).toBe(true);
  });

  it("❌ DEBE rechazar usuario inexistente", async () => {
    const credentials = {
      email: "fantasma@noexiste.com",
      password: correctPassword,
    };

    let errorThrown = false;
    try {
      await validateUserCredentials(credentials);
    } catch (error: unknown) {
      errorThrown = true;
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      // eslint-disable-next-line jest/no-conditional-expect
      expect(errorMessage).toBe("Usuario no encontrado");
    }
    expect(errorThrown).toBe(true);
  });
});
