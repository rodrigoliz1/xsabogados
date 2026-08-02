import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { siteConfig } from "@/config/site";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "XS ABOGADOS | Estrategia jurídica en Guadalajara",
    template: "%s | XS ABOGADOS",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "Servicios jurídicos",
  keywords: [
    "abogados en Guadalajara",
    "despacho de abogados en Guadalajara",
    "abogados corporativos",
    "abogados mercantiles",
    "litigio civil y mercantil",
    "derecho bancario y financiero",
    "recuperación de cartera",
    "juicio de amparo",
    "derecho administrativo y fiscal",
    "XS Abogados",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "XS ABOGADOS | Estrategia jurídica",
    description: "Estrategia jurídica para decisiones que definen el futuro.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "XS ABOGADOS" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "XS ABOGADOS | Estrategia jurídica",
    description: "Estrategia jurídica para decisiones que definen el futuro.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html data-scroll-behavior="smooth" lang="es-MX">
      <body>{children}</body>
    </html>
  );
}
