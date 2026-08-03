import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

import { PracticeFaqs } from "@/components/practice-areas/PracticeFaqs";
import { LawyerGrid } from "@/components/team/LawyerGrid";
import { siteConfig } from "@/config/site";
import { getLawyersBySlugs } from "@/data/lawyers";
import {
  getPracticeAreaBySlug,
  legalInformationDisclaimer,
  practiceAreas,
} from "@/data/practice-areas";

const SITE_URL = siteConfig.url;
const LEGACY_PUBLIC_LAW_SLUG = "administrativo-fiscal-constitucional";
const DISPUTES_PATH = "/areas/litigio-solucion-conflictos";

type PracticeAreaPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return practiceAreas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({
  params,
}: PracticeAreaPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (slug === LEGACY_PUBLIC_LAW_SLUG) {
    const area = getPracticeAreaBySlug("litigio-solucion-conflictos");
    return area
      ? {
          title: `${area.seo.title} | XS ABOGADOS`,
          description: area.seo.description,
          alternates: { canonical: `${SITE_URL}${DISPUTES_PATH}` },
        }
      : { title: "Litigio & Solución de Conflictos | XS ABOGADOS" };
  }

  const area = getPracticeAreaBySlug(slug);

  if (!area) {
    return { title: "Área no encontrada | XS ABOGADOS" };
  }

  return {
    title: `${area.seo.title} | XS ABOGADOS`,
    description: area.seo.description,
    keywords: [...area.seo.keywords],
    alternates: { canonical: `${SITE_URL}/areas/${area.slug}` },
    openGraph: {
      title: `${area.title} | XS ABOGADOS`,
      description: area.shortDescription,
      url: `${SITE_URL}/areas/${area.slug}`,
      type: "website",
    },
  };
}

export default async function PracticeAreaPage({
  params,
}: PracticeAreaPageProps) {
  const { slug } = await params;

  if (slug === LEGACY_PUBLIC_LAW_SLUG) {
    permanentRedirect(DISPUTES_PATH);
  }

  const area = getPracticeAreaBySlug(slug);

  if (!area) notFound();

  const relatedLawyers = getLawyersBySlugs(area.relatedLawyerSlugs);
  const currentIndex = practiceAreas.findIndex(
    (item) => item.slug === area.slug,
  );
  const nextArea = practiceAreas[(currentIndex + 1) % practiceAreas.length];
  const appointmentUrl = `/agenda?area=${area.slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE_URL}/areas/${area.slug}#service`,
        name: area.title,
        description: area.shortDescription,
        url: `${SITE_URL}/areas/${area.slug}`,
        areaServed: "México",
        provider: {
          "@type": "LegalService",
          name: "XS ABOGADOS",
          url: SITE_URL,
          telephone: siteConfig.contact.phoneDisplay,
        },
        serviceType: area.services,
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
            name: "Áreas de práctica",
            item: `${SITE_URL}/areas`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: area.title,
            item: `${SITE_URL}/areas/${area.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-ink text-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="mx-auto max-w-shell px-5 pb-24 pt-32 sm:px-8 sm:pt-40 lg:px-12 lg:pb-36 lg:pt-48">
        <Link
          href="/areas"
          className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper-muted transition hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper"
        >
          <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.5} />
          Todas las áreas
        </Link>
        <div className="mt-12 grid gap-12 border-t border-white/15 pt-10 lg:grid-cols-[0.62fr_1.38fr] lg:gap-20">
          <div className="flex items-start justify-between lg:block">
            <span className="font-serif text-7xl font-light text-white/15 sm:text-9xl">
              {area.index}
            </span>
            <p className="max-w-xs text-sm leading-7 text-paper-muted lg:mt-16">
              {area.shortDescription}
            </p>
          </div>
          <h1 className="font-serif text-[clamp(4rem,9.4vw,9rem)] leading-[0.79] tracking-[-0.065em]">
            {area.title}
          </h1>
        </div>
      </section>

      <section className="border-y border-white/15 bg-paper text-ink">
        <div className="mx-auto grid max-w-shell gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.62fr_1.38fr] lg:gap-20 lg:px-12 lg:py-32">
          <p className="text-xs font-semibold uppercase tracking-editorial text-black/50">
            Enfoque
          </p>
          <div className="max-w-5xl space-y-7 font-serif text-[clamp(2.1rem,4.5vw,4.5rem)] leading-[1.02] tracking-[-0.04em]">
            {area.introduction.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-shell gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.62fr_1.38fr] lg:gap-20 lg:px-12 lg:py-36">
        <div>
          <p className="text-xs font-semibold uppercase tracking-editorial text-paper-quiet">
            Problemáticas atendidas
          </p>
          <p className="mt-6 max-w-xs text-sm leading-7 text-paper-muted">
            La ruta jurídica depende de los hechos, documentos, plazos y
            objetivos particulares de cada asunto.
          </p>
        </div>
        <ul className="border-t border-white/15">
          {area.problems.map((problem, index) => (
            <li
              key={problem}
              className="grid gap-4 border-b border-white/15 py-6 sm:grid-cols-[3rem_1fr]"
            >
              <span className="text-xs tracking-[0.18em] text-paper-quiet">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-serif text-2xl leading-tight tracking-[-0.025em] sm:text-3xl">
                {problem}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-white/15 bg-ink-2">
        <div className="mx-auto max-w-shell px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
          <p className="text-xs font-semibold uppercase tracking-editorial text-paper-quiet">
            Servicios
          </p>
          <h2 className="mt-7 max-w-4xl font-serif text-[clamp(3rem,6vw,6rem)] leading-[0.9] tracking-[-0.05em]">
            Intervención precisa, alcance definido.
          </h2>
          <ol className="mt-14 grid border-l border-t border-white/15 sm:grid-cols-2 xl:grid-cols-5">
            {area.services.map((service, index) => (
              <li
                key={service}
                className="flex min-h-52 flex-col border-b border-r border-white/15 p-5 sm:p-6"
              >
                <span className="text-[0.68rem] tracking-[0.16em] text-paper-quiet">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-auto text-base leading-6 text-paper-muted">
                  {service}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-shell px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-[0.62fr_1.38fr] lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-editorial text-paper-quiet">
              Método de intervención
            </p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2">
            {area.method.map((step) => (
              <li
                key={step.number}
                className="flex min-h-72 flex-col border border-white/15 p-6 sm:p-8"
              >
                <span className="text-xs tracking-[0.18em] text-paper-quiet">
                  {step.number}
                </span>
                <div className="mt-auto">
                  <h3 className="font-serif text-3xl tracking-[-0.035em] sm:text-4xl">
                    {step.title}
                  </h3>
                  <p className="mt-5 text-sm leading-7 text-paper-muted">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-white/15 bg-paper text-ink">
        <div className="mx-auto max-w-shell px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
          <div className="mb-12 grid gap-8 lg:grid-cols-[0.62fr_1.38fr] lg:gap-20">
            <p className="text-xs font-semibold uppercase tracking-editorial text-black/50">
              Profesionales relacionados
            </p>
            <h2 className="font-serif text-[clamp(3rem,6vw,6rem)] leading-[0.9] tracking-[-0.05em]">
              Un equipo conectado con el asunto.
            </h2>
          </div>
          <div className="[&_*]:border-black/15 [&_h2]:text-ink [&_p]:text-black/60 [&_svg]:text-black/50">
            <LawyerGrid lawyers={relatedLawyers} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-shell gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.62fr_1.38fr] lg:gap-20 lg:px-12 lg:py-36">
        <div>
          <p className="text-xs font-semibold uppercase tracking-editorial text-paper-quiet">
            Preguntas frecuentes
          </p>
        </div>
        <PracticeFaqs faqs={area.faqs} />
      </section>

      <section className="mx-auto max-w-shell px-5 pb-24 sm:px-8 lg:px-12 lg:pb-36">
        <div className="border border-white/15 bg-ink-2 p-6 sm:p-10 lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-editorial text-paper-quiet">
              Consulta inicial
            </p>
            <h2 className="mt-6 max-w-4xl font-serif text-[clamp(3rem,5.5vw,5.5rem)] leading-[0.9] tracking-[-0.05em]">
              Un asunto complejo comienza por una lectura clara.
            </h2>
          </div>
          <div className="mt-10 lg:mt-0 lg:justify-self-end">
            <Link
              href={appointmentUrl}
              className="inline-flex min-h-12 items-center gap-3 bg-paper px-6 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper"
            >
              Agendar una consulta
              <ArrowRight
                aria-hidden="true"
                className="size-4"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        </div>
        <p className="mt-5 text-xs leading-6 text-paper-quiet">
          {legalInformationDisclaimer}
        </p>
      </section>

      <nav aria-label="Siguiente área" className="border-t border-white/15">
        <Link
          href={`/areas/${nextArea.slug}`}
          className="group mx-auto flex min-h-48 max-w-shell items-center justify-between gap-8 px-5 py-10 transition hover:bg-ink-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-paper sm:px-8 lg:px-12"
        >
          <span>
            <span className="block text-[0.68rem] uppercase tracking-[0.16em] text-paper-quiet">
              Siguiente área
            </span>
            <span className="mt-4 block max-w-4xl font-serif text-4xl leading-none tracking-[-0.04em] sm:text-6xl">
              {nextArea.title}
            </span>
          </span>
          <ArrowRight
            aria-hidden="true"
            className="size-7 shrink-0 text-paper-quiet transition group-hover:translate-x-2 group-hover:text-paper motion-reduce:transform-none"
            strokeWidth={1}
          />
        </Link>
      </nav>
    </div>
  );
}
