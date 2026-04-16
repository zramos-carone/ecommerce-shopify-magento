export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bienvenido a Ecommerce MVP
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Plataforma moderna de e-commerce para venta de productos tecnológicos
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/catalog" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Ver Catálogo
          </a>
          <a href="/api-docs" className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300">
            API Docs
          </a>
        </div>
      </section>

      {/* Status Board */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="font-bold text-lg mb-2">📦 Productos</h3>
          <p className="text-gray-600">Acceso a 1,500+ productos de 3 mayoristas</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="font-bold text-lg mb-2">💳 Pagos</h3>
          <p className="text-gray-600">Stripe + PayPal integrados y listos</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="font-bold text-lg mb-2">📚 API</h3>
          <p className="text-gray-600">Swagger OpenAPI docs disponibles</p>
        </div>
      </section>

      {/* Project Status - Día 1 */}
      <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 Estado del Proyecto - Día 1</h2>
        <div className="space-y-2 text-gray-700">
          <p>✅ <strong>Repositorio Git</strong> - Creado y estructurado</p>
          <p>✅ <strong>Next.js 14</strong> - Configurado (App Router)</p>
          <p>✅ <strong>SQLite</strong> - Setup local con Prisma</p>
          <p>✅ <strong>Swagger/OpenAPI</strong> - Inicializado en `/api-docs`</p>
          <p>⏳ <strong>Mayoristas APIs</strong> - Próximo: Día 2-3</p>
          <p>⏳ <strong>Vercel Deploy</strong> - Próximo: Día 2</p>
        </div>
      </section>

      {/* Next Steps */}
      <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Próximos Pasos</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li><strong>Hoy (Día 1):</strong> Setup completado ✅</li>
          <li><strong>Día 2:</strong> Conectar Vercel + GitHub + deploy automático</li>
          <li><strong>Día 3:</strong> Mapear APIs mayoristas (Ingram, Distribuido, Synnex)</li>
          <li><strong>Día 4:</strong> Configurar Prisma + migraciones</li>
          <li><strong>Día 5:</strong> Test mayoristas + Swagger v1.0</li>
        </ol>
      </section>

      {/* Development Tips */}
      <section className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Comandos Útiles</h3>
        <div className="bg-gray-900 text-gray-100 rounded p-4 font-mono text-sm overflow-auto space-y-2">
          <p># Instalar dependencias</p>
          <p className="text-green-400">pnpm install</p>

          <p className="mt-2"># Iniciar dev server</p>
          <p className="text-green-400">pnpm dev</p>

          <p className="mt-2"># Crear archivo .env local</p>
          <p className="text-green-400">cp .env.example .env.local</p>

          <p className="mt-2"># Ejecutar migraciones Prisma</p>
          <p className="text-green-400">pnpm prisma migrate dev</p>

          <p className="mt-2"># Ver Swagger docs</p>
          <p className="text-green-400">http://localhost:3000/api-docs</p>
        </div>
      </section>
    </div>
  )
}
