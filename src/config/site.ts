export const siteConfig = {
  name: "XS ABOGADOS",
  shortName: "XS",
  legalName: "XS ABOGADOS",
  description:
    "Firma jurídica en Guadalajara enfocada en asuntos corporativos, bancarios, financieros y controversias complejas.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://xs-abogados.com",
  locale: "es_MX",
  contact: {
    phoneDisplay: process.env.NEXT_PUBLIC_PHONE_DISPLAY ?? "+52 33 2960 2391",
    phoneHref: "+523329602391",
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "523329602391",
    whatsappMessage:
      "Hola, me gustaría recibir información sobre los servicios de XS ABOGADOS.",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contacto@xs-abogados.com",
    address:
      process.env.NEXT_PUBLIC_OFFICE_ADDRESS ??
      "Torre Celtis, Piso 18, Real de Acueducto 240, Puerta de Hierro, 45116 Zapopan, Jal.",
    schedule: "Lunes a viernes · 09:00–18:00",
  },
  navigation: [
    { label: "Firma", href: "/firma" },
    { label: "Equipo", href: "/equipo" },
    { label: "Áreas", href: "/areas" },
    { label: "Perspectivas", href: "/insights" },
    { label: "Portal", href: "/portal" },
  ],
} as const;

export function getWhatsAppUrl(message = siteConfig.contact.whatsappMessage) {
  return `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
