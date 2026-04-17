const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@maxtech.com';
  const adminPassword = 'MaxTechAdmin2026!'; // ⚠️ Cambia esto después del primer login

  console.log('🛡️ Generando administrador maestro...');

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      role: 'admin',
      name: 'Admin MaxTech'
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      name: 'Admin MaxTech'
    }
  });

  console.log('✅ Administrador creado/actualizado con éxito:');
  console.log(`📧 Email: ${admin.email}`);
  console.log(`🔑 Password: ${adminPassword}`);
  console.log('---');
  console.log('⚠️ IMPORTANTE: Añade NEXTAUTH_SECRET="tu_secreto_aqui" a tu archivo .env');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
