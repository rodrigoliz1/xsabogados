import { getSiteUrl } from "@/lib/site-url";

export const siteConfig = {
  name: "XS ABOGADOS",
  shortName: "XS",
  legalName: "XS ABOGADOS",
  description:
    "Firma jurídica en Guadalajara enfocada en asuntos corporativos, bancarios, financieros y controversias complejas.",
  url: getSiteUrl(),
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
    mapsUrl:
      "https://www.google.com/maps?vet=10CAAQoqAOahcKEwiYj_jTloOWAxUAAAAAHQAAAAAQCQ..i&rlz=1C5CHFA_enMX1072MX1072&pvq=CgwvZy8xcHR4ODk3d2QiGwoVVG9ycmUgQ2VsdGlzLCBQaXNvIDE4EAIYAw&lqi=ClNUb3JyZSBDZWx0aXMsIFBpc28gMTgsIFJlYWwgZGUgQWN1ZWR1Y3RvIDI0MCwgUHVlcnRhIGRlIEhpZXJybywgNDUxMTYgWmFwb3BhbiwgSmFsLkjsvpLE55WAgAhaaxAAEAEQAhADGAAYARgEGAYYBxgIGAoYCxgMGA0iTXRvcnJlIGNlbHRpcyBwaXNvIDE4IHJlYWwgZGUgYWN1ZWR1Y3RvIDI0MCBwdWVydGEgZGUgaGllcnJvIDQ1MTE2IHphcG9wYW4gamFskgEdZXhlY3V0aXZlX3N1aXRlX3JlbnRhbF9hZ2VuY3k&fvr=1&cs=0&um=1&ie=UTF-8&fb=1&gl=mx&sa=X&geocode=KVfCcJ0BryiEMc9kdhkC5SNh&daddr=Torre+Celtis,+Real+de+Acueducto+240,+Puerta+de+Hierro,+45116+Zapopan,+Jal.",
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
