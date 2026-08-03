import {
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircleMore,
  Phone,
} from "lucide-react";
import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/contact-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EditorialImage } from "@/components/ui/editorial-image";
import { siteConfig } from "@/config/site";
import { editorialImages } from "@/data/editorial-images";
import {
  getPublicSiteSettings,
  getSettingsWhatsAppUrl,
} from "@/server/services/site-settings-service";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contacta a XS ABOGADOS en Guadalajara o solicita una consulta mediante nuestra agenda.",
  alternates: { canonical: "/contacto" },
};

export default async function ContactPage() {
  const settings = await getPublicSiteSettings();
  return (
    <div className="min-h-screen bg-ink pb-24 pt-28 text-paper lg:pb-32 lg:pt-36">
      <Container>
        <Breadcrumbs items={[{ label: "Contacto" }]} />
        <div className="mt-12 grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <div>
            <p className="eyebrow text-paper-quiet">Contacto</p>
            <h1 className="mt-6 text-balance font-serif text-6xl leading-[0.9] tracking-[-0.045em] sm:text-7xl lg:text-8xl">
              Hablemos con contexto y precisión.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-paper-muted">
              Cuéntanos de forma general qué necesitas. Revisaremos tu mensaje y
              te indicaremos el canal adecuado para continuar.
            </p>
            <ButtonLink className="mt-8" href="/agenda">
              Agendar una consulta{" "}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </ButtonLink>
            <EditorialImage
              className="mt-10 aspect-[16/10] min-h-72"
              image={editorialImages.puertaDeHierro}
              priority
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
            <dl className="mt-12 divide-y divide-white/10 border-y border-white/10">
              <ContactItem
                icon={Phone}
                label="Teléfono"
                value={settings.phoneDisplay}
                href={`tel:${settings.phoneE164}`}
              />
              <ContactItem
                icon={MessageCircleMore}
                label="WhatsApp"
                value={settings.phoneDisplay}
                href={getSettingsWhatsAppUrl(settings)}
                external
              />
              <ContactItem
                icon={Mail}
                label="Correo"
                value={settings.contactEmail}
                href={`mailto:${settings.contactEmail}`}
              />
              <ContactItem
                icon={MapPin}
                label="Oficina"
                value={settings.address}
                href={siteConfig.contact.mapsUrl}
                external
              />
              <ContactItem
                icon={Clock3}
                label="Horario"
                value={settings.officeHours}
              />
            </dl>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/[0.025] p-5 sm:p-8 lg:p-10">
            <p className="eyebrow text-paper-quiet">Escríbenos</p>
            <h2 className="mt-4 font-serif text-4xl leading-none sm:text-5xl">
              Inicia la conversación.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-6 text-paper-quiet">
              Los campos permiten únicamente una primera aproximación; no envíes
              expedientes ni información reservada.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

function ContactItem({
  icon: Icon,
  label,
  value,
  href,
  external = false,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  return (
    <div className="flex gap-4 py-5">
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-paper" />
      <div>
        <dt className="eyebrow text-paper-quiet">{label}</dt>
        <dd className="mt-2 max-w-md text-sm leading-6 text-paper-muted">
          {href ? (
            <a
              className="transition hover:text-paper"
              href={href}
              rel={external ? "noopener noreferrer" : undefined}
              target={external ? "_blank" : undefined}
            >
              {value}
            </a>
          ) : (
            value
          )}
        </dd>
      </div>
    </div>
  );
}
