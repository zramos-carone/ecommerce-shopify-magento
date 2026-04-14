import { prisma } from '@/lib/db'
import { generateBulkProducts } from '@/lib/services/mayoristas/bulk-generator'

async function main() {
  console.log('🌱 Starting database seed (1,500 products)...')

  // Limpiar productos existentes
  await prisma.product.deleteMany()
  console.log('✅ Cleared existing products')

  // Generar 1,500 productos (500 por mayorista)
  const { ingram, distribuido, synnex } = generateBulkProducts()
  const allProducts = [...ingram, ...distribuido, ...synnex]

  console.log(`📦 Generated ${allProducts.length} products, inserting into database...`)

  // Insertar en batches para mejor performance
  const BATCH_SIZE = 100
  let inserted = 0

  for (let i = 0; i < allProducts.length; i += BATCH_SIZE) {
    const batch = allProducts.slice(i, i + BATCH_SIZE)

    await Promise.all(
      batch.map((product) =>
        prisma.product.create({
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
      )
    )

    inserted += batch.length
    const progress = Math.round((inserted / allProducts.length) * 100)
    console.log(`  ⏳ Progress: ${inserted}/${allProducts.length} (${progress}%)`)
  }

  console.log(`✅ Seeded ${allProducts.length} products`)
  console.log(`  - Ingram: ${ingram.length}`)
  console.log(`  - Distribuido: ${distribuido.length}`)
  console.log(`  - Synnex: ${synnex.length}`)
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
