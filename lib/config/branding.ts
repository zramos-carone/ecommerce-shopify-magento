/**
 * branding.ts - Cerebro de Marca de la Plataforma
 *
 * Centraliza toda la identidad visual y nominal para permitir
 * el cambio fácil de marca (White-label).
 */

export const BRAND_CONFIG = {
  // Nombres
  shortName: "TECNO", // Ej: TECNO
  accentName: "CORP", // Ej: CORP (usado en logos de dos partes)
  fullName: "Tecno Corp", // Nombre legal o completo

  // Slogans y Textos
  slogan: "Tu Socio Tecnológico",
  adminPanelName: "Command Center",

  // Identidad de Marketplace (El nombre que aparece en los productos)
  identityName: "TECNO", // Antes era "MAXTECH"

  // SEO
  metaTitle: "Tecno - Boutique de Tecnología Curada",
  metaDescription:
    "Hardware de alto rendimiento seleccionado por expertos para profesionales exigentes.",

  // Estética (Para uso futuro en variables CSS)
  colors: {
    primary: "#2563eb", // Azul Neón / Blue 600
    secondary: "#000000",
  },
};
