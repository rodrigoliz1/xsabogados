import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import {
  getPublicSiteSettings,
  getSettingsWhatsAppUrl,
} from "@/server/services/site-settings-service";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const settings = await getPublicSiteSettings();
  const legalService = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: settings.firmName,
    url: settings.domain,
    image: `${settings.domain}/og.png`,
    telephone: settings.phoneDisplay,
    email: settings.contactEmail,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "Zapopan",
      addressRegion: "Jalisco",
      addressCountry: "MX",
    },
    areaServed: "México",
    priceRange: "Consulta previa",
  };

  return (
    <>
      <a
        className="fixed left-3 top-3 z-[100] -translate-y-24 rounded-full bg-paper px-4 py-2 text-sm font-semibold text-ink transition focus:translate-y-0"
        href="#contenido"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido">{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton
        firmName={settings.firmName}
        href={getSettingsWhatsAppUrl(settings)}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(legalService).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
    </>
  );
}
