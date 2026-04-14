import { prisma } from '@/lib/db'
import {
  getIngramProducts,
  getDistribuidoProducts,
  getSynnexProducts,
} from '@/lib/services/mayoristas'

async function main() {
  console.log('🌱 Starting database seed...')

  // Limpiar productos existentes
  await prisma.product.deleteMany()
  console.log('✅ Cleared existing products')

  // Obtener productos de todos los mayoristas
  const ingramProducts = getIngramProducts()
  const distribuidoProducts = getDistribuidoProducts()
  const synnexProducts = getSynnexProducts()

  const allProducts = [...ingramProducts, ...distribuidoProducts, ...synnexProducts]

  // Insertar en base de datos
  for (const product of allProducts) {
    await prisma.product.create({
      data: {
        sku: product.sku,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        brand: product.brand,
        mayoristId: product.mayorista,
        mayoristSku: product.mayoristSku,
        mayoristPrice: product.mayoristPrice,
      },
    })
  }

  console.log(`✅ Seeded ${allProducts.length} products`)
  console.log(`  - Ingram: ${ingramProducts.length}`)
  console.log(`  - Distribuido: ${distribuidoProducts.length}`)
  console.log(`  - Synnex: ${synnexProducts.length}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('✅ Seed completed!')
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
