import { createSwaggerSpec } from "next-swagger-doc";

export const getSwaggerSpec = () => {
  return createSwaggerSpec({
    apiFolder: "app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "TECNO - Plataforma de Alta Tecnología API",
        version: "1.0.0",
        description:
          "API REST oficial de TECNO. Gestión de catálogo de alta gama, integración con mayoristas (Ingram, Distribuido, Synnex) y flujo transaccional seguro.",
        contact: {
          name: "Soporte TECNO",
          email: "tecnologia@tecno.com",
        },
        license: {
          name: "Licencia Privada TECNO",
          url: "https://tecno.com/license",
        },
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Servidor de Desarrollo TECNO",
        },
      ],
      tags: [
        {
          name: "Catálogo",
          description:
            "Búsqueda y consulta de productos con identidad dinámica TECNO.",
        },
        {
          name: "Transacción",
          description: "Gestión de carrito de compras y proceso de checkout.",
        },
        {
          name: "Órdenes",
          description: "Seguimiento y creación de pedidos de alta tecnología.",
        },
        {
          name: "Administración",
          description:
            "Endpoint exclusivos para el panel de control administrativo.",
        },
      ],
      components: {
        schemas: {
          Product: {
            type: "object",
            properties: {
              id: { type: "string", description: "ID interno de TECNO" },
              sku: { type: "string", description: "SKU unificado" },
              name: { type: "string", description: "Nombre comercial" },
              description: { type: "string", description: "Ficha técnica" },
              price: {
                type: "number",
                format: "float",
                description: "Precio de venta",
              },
              stock: { type: "integer", description: "Disponibilidad" },
              category: { type: "string", description: "Categoría" },
              brand: { type: "string", description: "Marca" },
              imageUrl: {
                type: "string",
                description: "URL de la imagen (Boutique Edition)",
              },
              mayorista: {
                type: "string",
                description: "Identidad del proveedor (Uso interno)",
              },
            },
          },
          CartItem: {
            type: "object",
            properties: {
              id: { type: "string" },
              sku: { type: "string" },
              name: { type: "string" },
              price: { type: "number" },
              quantity: { type: "integer" },
              imageUrl: { type: "string" },
            },
          },
          Order: {
            type: "object",
            properties: {
              id: { type: "string" },
              orderNumber: { type: "string" },
              status: {
                type: "string",
                enum: ["pending", "processing", "completed", "cancelled"],
              },
              paymentStatus: {
                type: "string",
                enum: ["pending", "paid", "failed"],
              },
              total: { type: "number" },
              email: { type: "string" },
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    productName: { type: "string" },
                    quantity: { type: "integer" },
                    price: { type: "number" },
                  },
                },
              },
            },
          },
          PaymentIntent: {
            type: "object",
            properties: {
              clientSecret: { type: "string" },
              amount: { type: "number" },
              currency: { type: "string" },
            },
          },
          ErrorResponse: {
            type: "object",
            properties: {
              error: { type: "string", description: "Tipo de error" },
              message: { type: "string", description: "Detalles del error" },
            },
          },
        },
      },
    },
  });
};
