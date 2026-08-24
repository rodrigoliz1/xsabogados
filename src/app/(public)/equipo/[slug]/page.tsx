import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LawyerPortrait } from "@/components/team/LawyerPortrait";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";
import { getLawyerBySlug, lawyers } from "@/data/lawyers";
import { db } from "@/lib/db";
import { getPublicSiteSettings } from "@/server/services/site-settings-service";

const SITE_URL = siteConfig.url;
const appointmentAreaByLawyer: Record<string, string> = {
  "victor-silva": "corporativo-negocios",
  "alejandro-guerrero": "litigio-solucion-conflictos",
  "isamar-torres": "bancario-financiero",
  "fernando-velasco": "litigio-solucion-conflictos",
  "rodrigo-lizarraga": "litigio-solucion-conflictos",
  "felipe-ibarra-ibarra": "litigio-solucion-conflictos",
  "jose-luis-ahumada": "bancario-financiero",
  "rodrigo-rubio-gutierrez": "litigio-solucion-conflictos",
};

type LawyerPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return lawyers.map((lawyer) => ({ slug: lawyer.slug }));
}

export async function generateMetadata({
  params,
}: LawyerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lawyer = getLawyerBySlug(slug);

  if (!lawyer) {
    return { title: "Perfil no encontrado | XS ABOGADOS" };
  }

  const description = `${lawyer.name}, ${lawyer.role} en XS ABOGADOS. ${lawyer.primaryArea}.`;

  return {
    title: `${lawyer.name} | Equipo XS ABOGADOS`,
    description,
    alternates: { canonical: `${SITE_URL}/equipo/${lawyer.slug}` },
    openGraph: {
      title: `${lawyer.name} | XS ABOGADOS`,
      description,
      url: `${SITE_URL}/equipo/${lawyer.slug}`,
      type: "profile",
      images: lawyer.image
        ? [
            {
              url: `${SITE_URL}${lawyer.image}`,
              alt: lawyer.imageAlt ?? lawyer.name,
            },
          ]
        : undefined,
    },
  };
}

export default async function LawyerProfilePage({ params }: LawyerPageProps) {
  const { slug } = await params;
  const lawyer = getLawyerBySlug(slug);

  if (!lawyer) notFound();

  const currentIndex = lawyers.findIndex((item) => item.slug === lawyer.slug);
  const previous =
    lawyers[(currentIndex - 1 + lawyers.length) % lawyers.length];
  const next = lawyers[(currentIndex + 1) % lawyers.length];
  const appointmentArea = appointmentAreaByLawyer[lawyer.slug] ?? "";
  const appointmentUrl = `/agenda?area=${appointmentArea}&profesional=${lawyer.slug}`;
  const [storedContact, settings] = await Promise.all([
    process.env.DATABASE_URL
      ? db.lawyerProfile
          .findUnique({
            where: { slug: lawyer.slug },
            select: { phone: true, emailPublic: true, linkedInUrl: true },
          })
          .catch(() => null)
      : null,
    getPublicSiteSettings(),
  ]);
  const phoneDisplay = storedContact?.phone || settings.phoneDisplay;
  const phoneDigits = phoneDisplay.replace(/\D/g, "");
  const phoneHref = storedContact?.phone
    ? `tel:+${phoneDigits}`
    : `tel:${settings.phoneE164}`;
  const email = storedContact?.emailPublic || settings.contactEmail;
  const linkedIn =
    storedContact?.linkedInUrl ||
    Object.entries(settings.socialLinks).find(([label]) =>
      label.toLowerCase().includes("linkedin"),
    )?.[1] ||
    `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(lawyer.name)}`;
  const whatsappNumber =
    phoneDigits.length >= 10 && phoneDigits.length <= 15
      ? phoneDigits
      : settings.whatsappNumber;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hola ${lawyer.name}, me gustaría consultar un asunto con XS ABOGADOS.`)}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/equipo/${lawyer.slug}#person`,
        name: lawyer.name,
        jobTitle: lawyer.role,
        url: `${SITE_URL}/equipo/${lawyer.slug}`,
        image: lawyer.image ? `${SITE_URL}${lawyer.image}` : undefined,
        description: lawyer.biography.join(" "),
        knowsAbout: lawyer.focus,
        worksFor: {
          "@type": "LegalService",
          name: "XS ABOGADOS",
          url: SITE_URL,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Inicio",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Equipo",
            item: `${SITE_URL}/equipo`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: lawyer.name,
            item: `${SITE_URL}/equipo/${lawyer.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-ink text-paper">
      <JsonLd data={structuredData} />

      <section className="mx-auto max-w-shell px-5 pb-16 pt-32 sm:px-8 sm:pt-40 lg:px-12 lg:pb-24 lg:pt-48">
        <Link
          href="/equipo"
          className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper-muted transition hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper"
        >
          <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.5} />
          Todo el equipo
        </Link>
      </section>

      <section className="mx-auto grid max-w-shell gap-10 px-5 pb-24 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20 lg:px-12 lg:pb-36">
        <LawyerPortrait
          lawyer={lawyer}
          priority
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="aspect-[4/5] lg:sticky lg:top-28 lg:self-start"
        />

        <div className="lg:pt-6">
          <p className="text-xs font-semibold uppercase tracking-editorial text-paper-quiet">
            {lawyer.role}
          </p>
          <h1 className="mt-7 font-serif text-[clamp(4rem,8.5vw,8.5rem)] leading-[0.78] tracking-[-0.065em]">
            {lawyer.name}
          </h1>
          <p className="mt-8 max-w-xl text-base uppercase leading-7 tracking-[0.12em] text-paper-muted">
            {lawyer.primaryArea}
          </p>

          <div className="mt-14 border-t border-white/15 pt-10">
            <h2 className="text-xs font-semibold uppercase tracking-editorial text-paper-quiet">
              Semblanza
            </h2>
            <div className="mt-7 space-y-6 text-lg leading-8 text-paper-muted">
              {lawyer.biography.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="mt-14 grid gap-10 border-t border-white/15 pt-10 sm:grid-cols-2">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-editorial text-paper-quiet">
                Formación
              </h2>
              <ul className="mt-6 space-y-4 text-sm leading-7 text-paper-muted">
                {lawyer.education.map((item) => (
                  <li key={item} className="border-l border-white/20 pl-4">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-editorial text-paper-quiet">
                Enfoque de práctica
              </h2>
              <ul className="mt-6 space-y-3 text-sm leading-6 text-paper-muted">
                {lawyer.focus.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-3 h-px w-5 shrink-0 bg-white/35"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-14 border border-white/15 bg-ink-2 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-editorial text-paper-quiet">
              Consulta relacionada
            </p>
            <p className="mt-5 max-w-xl font-serif text-3xl leading-tight tracking-[-0.035em] sm:text-4xl">
              Comparte el contexto general de tu asunto para orientar el primer
              contacto.
            </p>
            <Link
              href={appointmentUrl}
              className="mt-8 inline-flex min-h-12 items-center gap-3 bg-paper px-6 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper"
            >
              Solicitar una consulta
              <ArrowRight
                aria-hidden="true"
                className="size-4"
                strokeWidth={1.5}
              />
            </Link>
          </div>
          <section className="mt-8 border border-white/15 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-editorial text-paper-quiet">
              Contacto directo
            </p>
            <div className="mt-6 grid gap-px overflow-hidden border border-white/15 bg-white/15 sm:grid-cols-2">
              {[
                {
                  href: `mailto:${email}`,
                  label: "Correo",
                  value: email,
                  icon: Mail,
                },
                {
                  href: phoneHref,
                  label: "Celular",
                  value: phoneDisplay,
                  icon: Phone,
                },
                {
                  href: whatsappUrl,
                  label: "WhatsApp",
                  value: "Iniciar conversación",
                  icon: MessageCircle,
                  external: true,
                },
                {
                  href: linkedIn,
                  label: "LinkedIn",
                  value: "Consultar perfil",
                  icon: ExternalLink,
                  external: true,
                },
              ].map((contact) => {
                const Icon = contact.icon;
                return (
                  <a
                    key={contact.label}
                    href={contact.href}
                    target={contact.external ? "_blank" : undefined}
                    rel={contact.external ? "noreferrer" : undefined}
                    className="group flex min-h-28 flex-col justify-between bg-ink px-5 py-5 transition hover:bg-ink-3"
                  >
                    <Icon
                      className="size-4 text-paper-quiet transition group-hover:text-paper"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <span>
                      <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-paper-quiet">
                        {contact.label}
                      </span>
                      <span className="mt-2 block break-all text-sm text-paper-muted group-hover:text-paper">
                        {contact.value}
                      </span>
                    </span>
                  </a>
                );
              })}
            </div>
          </section>
        </div>
      </section>

      <nav
        aria-label="Navegación entre perfiles"
        className="border-y border-white/15"
      >
        <div className="mx-auto grid max-w-shell sm:grid-cols-2">
          <Link
            href={`/equipo/${previous.slug}`}
            className="group flex min-h-40 items-center gap-4 border-b border-white/15 px-5 py-8 transition hover:bg-ink-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-paper sm:border-b-0 sm:border-r sm:px-8 lg:px-12"
          >
            <ArrowLeft
              aria-hidden="true"
              className="size-5 shrink-0 text-paper-quiet transition group-hover:-translate-x-1 motion-reduce:transform-none"
              strokeWidth={1.25}
            />
            <span>
              <span className="block text-[0.68rem] uppercase tracking-[0.16em] text-paper-quiet">
                Perfil anterior
              </span>
              <span className="mt-3 block font-serif text-3xl tracking-[-0.03em]">
                {previous.name}
              </span>
            </span>
          </Link>
          <Link
            href={`/equipo/${next.slug}`}
            className="group flex min-h-40 items-center justify-end gap-4 px-5 py-8 text-right transition hover:bg-ink-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-paper sm:px-8 lg:px-12"
          >
            <span>
              <span className="block text-[0.68rem] uppercase tracking-[0.16em] text-paper-quiet">
                Siguiente perfil
              </span>
              <span className="mt-3 block font-serif text-3xl tracking-[-0.03em]">
                {next.name}
              </span>
            </span>
            <ArrowRight
              aria-hidden="true"
              className="size-5 shrink-0 text-paper-quiet transition group-hover:translate-x-1 motion-reduce:transform-none"
              strokeWidth={1.25}
            />
          </Link>
        </div>
      </nav>
    </div>
  );
}
