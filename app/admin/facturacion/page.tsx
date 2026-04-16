import { FileText, AlertCircle, Building2, User, Hash } from 'lucide-react';

export default function AdminFacturacionPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FileText className="mr-3 h-6 w-6 text-blue-600" />
            Módulo de Facturación Electrónica (CFDI)
          </h2>
          <p className="text-gray-500 mt-1">
            Plataforma de emisión de comprobantes fiscales integrada.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Próximamente en v2.0</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Este es un módulo demostrativo (dummy). La integración real con PAC (Proveedor Autorizado de Certificación) del SAT y el timbrado en producción estarán disponibles en la siguiente gran actualización.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden opacity-75 pointer-events-none">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 border-b pb-2">Generar Factura (Mockup)</h3>
          
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="rfc" className="block text-sm font-medium text-gray-700 flex items-center">
                <Hash className="w-4 h-4 mr-1 text-gray-400" />
                RFC del Receptor
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="rfc"
                  id="rfc"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 border px-3"
                  placeholder="XAXX010101000"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 flex items-center">
                <User className="w-4 h-4 mr-1 text-gray-400" />
                Razón Social
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 border px-3"
                  placeholder="Público en General"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="uso_cfdi" className="block text-sm font-medium text-gray-700">
                Uso de CFDI
              </label>
              <div className="mt-1">
                <select
                  id="uso_cfdi"
                  name="uso_cfdi"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 border px-3 bg-white"
                >
                  <option>G01 - Adquisición de mercancias</option>
                  <option>G03 - Gastos en general</option>
                  <option>S01 - Sin efectos fiscales</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="forma_pago" className="block text-sm font-medium text-gray-700">
                Forma de Pago
              </label>
              <div className="mt-1">
                <select
                  id="forma_pago"
                  name="forma_pago"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 border px-3 bg-white"
                >
                  <option>01 - Efectivo</option>
                  <option>04 - Tarjeta de crédito</option>
                  <option>28 - Tarjeta de débito</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="regimen" className="block text-sm font-medium text-gray-700 flex items-center">
                <Building2 className="w-4 h-4 mr-1 text-gray-400" />
                Régimen Fiscal
              </label>
              <div className="mt-1">
                <select
                  id="regimen"
                  name="regimen"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 border px-3 bg-white"
                >
                  <option>601 - General de Ley Personas Morales</option>
                  <option>612 - Personas Físicas con Actividades Empresariales</option>
                  <option>616 - Sin obligaciones fiscales</option>
                </select>
              </div>
            </div>
            
            <div className="sm:col-span-6">
                <div className="border border-dashed border-gray-300 rounded-md p-6 text-center">
                  <p className="text-sm text-gray-500">Selecciona o ingresa un número de orden para cargar los productos y montos automáticamente aquí.</p>
                </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-400 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm"
          >
            Timbrar Factura (Deshabilitado)
          </button>
        </div>
      </div>
    </div>
  );
}
