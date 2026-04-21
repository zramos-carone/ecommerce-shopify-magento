import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

import { BRAND_CONFIG } from "@/lib/config/branding";
import { env } from "@/lib/config/env";
// Forzando el uso de env para que TECNO Guard se active en tiempo de build/runtime
void env;

export const metadata: Metadata = {
  title: BRAND_CONFIG.metaTitle,
  description: BRAND_CONFIG.metaDescription,
  keywords:
    "ecommerce, tecnología, laptops, hardware, software, México, white-label",
  authors: [{ name: BRAND_CONFIG.fullName }],
};

import { CartProvider } from "@/context/CartContext";
import NextAuthProvider from "@/app/components/NextAuthProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} font-inter antialiased`}
      >
        <NextAuthProvider>
          <CartProvider>{children}</CartProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
