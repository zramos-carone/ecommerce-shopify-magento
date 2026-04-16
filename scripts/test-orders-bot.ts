import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_URL = 'http://localhost:3000/api/checkout';

async function generateTestOrders(count: number = 50) {
  console.log(`🤖 Iniciando Bot de Órdenes: Generando ${count} transacciones...`);

  // 1. Obtener productos de la base de datos para simular compras reales
  const allProducts = await prisma.product.findMany();
  
  if (allProducts.length === 0) {
    console.error('❌ No hay productos en la base de datos. Ejecuta pnpm db:seed primero.');
    return;
  }

  const firstNames = ['Juan', 'Maria', 'Pedro', 'Ana', 'Luis', 'Sofia', 'Carlos', 'Elena', 'Diego', 'Lucia'];
  const lastNames = ['Garcia', 'Rodriguez', 'Lopez', 'Martinez', 'Perez', 'Sanchez', 'Gonzalez', 'Gomez'];
  const cities = ['CDMX', 'Guadalajara', 'Monterrey', 'Puebla', 'Queretaro', 'Merida', 'Tijuana', 'Cancun'];
  const methods = ['stripe', 'paypal'];

  for (let i = 1; i <= count; i++) {
    // Seleccionar de 1 a 4 productos aleatorios
    const numItems = Math.floor(Math.random() * 4) + 1;
    const cartItems = [];
    const selectedIndices = new Set();

    while (selectedIndices.size < numItems) {
      const idx = Math.floor(Math.random() * allProducts.length);
      if (!selectedIndices.has(idx)) {
        selectedIndices.add(idx);
        const p = allProducts[idx];
        cartItems.push({
          productId: p.id,
          name: p.name,
          price: p.price,
          quantity: Math.floor(Math.random() * 2) + 1 // 1 o 2 unidades
        });
      }
    }

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const method = methods[Math.floor(Math.random() * methods.length)];

    const payload = {
      cartItems,
      shippingAddress: {
        street: `Calle Falsa ${Math.floor(Math.random() * 1000)}`,
        city: city,
        state: 'N/A',
        zip: String(Math.floor(Math.random() * 90000) + 10000),
        country: 'Mexico'
      },
      customerEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      paymentMethod: method,
      firstName,
      lastName,
      phone: `55${Math.floor(Math.random() * 100000000)}`
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`✅ [${i}/${count}] Orden creada: ${data.orderNumber} ($${data.orderSummary.total}) - ${method.toUpperCase()}`);
      } else {
        console.error(`❌ [${i}/${count}] Error al crear orden:`, data.error);
      }
    } catch (error) {
      console.error(`❌ [${i}/${count}] Error de conexión:`, error instanceof Error ? error.message : error);
      console.log('💡 Asegúrate de que el servidor esté corriendo en localhost:3000 (pnpm dev)');
      break; 
    }
  }

  console.log('🏁 Proceso finalizado.');
  await prisma.$disconnect();
}

generateTestOrders(50);
