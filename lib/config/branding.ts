/**
 * branding.ts - Cerebro de Marca de la Plataforma
 *
 * Centraliza toda la identidad visual y nominal para permitir
 * el cambio fácil de marca (White-label).
 */

export const BRAND_CONFIG = {
  // Nombres
  shortName: "TEC", // Parte en Azul (Igual que MAX)
  accentName: "NO", // Parte en Gris (Igual que TECH)
  fullName: "Tecno",

  // Slogans y Textos
  slogan: "Tu Socio Tecnológico",
  adminPanelName: "Command Center",

  // Identidad de Marketplace (Unificada para la API)
  identityName: "TECNO",

  // SEO
  metaTitle: "Tecno - Boutique de Tecnología Curada",
  metaDescription:
    "Hardware de alto rendimiento seleccionado por expertos para profesionales exigentes.",

  // Configuración de Catálogo
  allowMayoristaImages: true, // true = mayoristas fallback, false = solo fotos locales

  // Estética (Para uso futuro en variables CSS)
  colors: {
    primary: "#2563eb", // Azul Neón / Blue 600
    secondary: "#000000",
  },
};
