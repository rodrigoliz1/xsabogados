import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { TeamFilters } from "@/components/team/TeamFilters";
import { EditorialImage } from "@/components/ui/editorial-image";
import { siteConfig } from "@/config/site";
import { editorialImages } from "@/data/editorial-images";
import { lawyers } from "@/data/lawyers";

const SITE_URL = siteConfig.url;

export const metadata: Metadata = {
  title: "Equipo | XS ABOGADOS",
  description:
    "Conoce al equipo de XS ABOGADOS y sus enfoques en derecho corporativo, bancario, financiero, litigio y derecho público.",
  alternates: { canonical: `${SITE_URL}/equipo` },
  openGraph: {
    title: "Equipo | XS ABOGADOS",
    description:
      "Perfiles profesionales organizados por áreas de práctica y enfoque jurídico.",
    url: `${SITE_URL}/equipo`,
    type: "website",
  },
};

export default function TeamPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: "Equipo de XS ABOGADOS",
        itemListElement: lawyers.map((lawyer, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Person",
            name: lawyer.name,
            jobTitle: lawyer.role,
            url: `${SITE_URL}/equipo/${lawyer.slug}`,
            worksFor: {
              "@type": "Organization",
              name: "XS ABOGADOS",
              url: SITE_URL,
            },
          },
        })),
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

      <section className="mx-auto max-w-shell px-5 pb-24 pt-36 sm:px-8 sm:pt-44 lg:px-12 lg:pb-32 lg:pt-52">
        <p className="text-xs font-semibold uppercase tracking-editorial text-paper-quiet">
          Equipo / Siete perfiles
        </p>
        <div className="mt-12 grid gap-10 border-t border-white/15 pt-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-end lg:gap-20">
          <h1 className="font-serif text-[clamp(4.5rem,11vw,10rem)] leading-[0.78] tracking-[-0.065em]">
            Nosotros
          </h1>
          <p className="max-w-md pb-2 text-base leading-8 text-paper-muted">
            Un equipo multidisciplinario que conecta análisis, estructura y
            ejecución para atender cada asunto desde sus distintas dimensiones.
          </p>
        </div>
        <EditorialImage
          className="mt-16 aspect-[16/7] min-h-[24rem]"
          image={editorialImages.puertaDeHierro}
          priority
          sizes="(max-width: 1280px) 100vw, 1200px"
        />
      </section>

      <section className="mx-auto max-w-shell px-5 pb-28 sm:px-8 lg:px-12 lg:pb-40">
        <TeamFilters lawyers={lawyers} />
      </section>

      <section className="border-y border-white/15 bg-paper text-ink">
        <div className="mx-auto grid max-w-shell gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-end lg:px-12 lg:py-28">
          <div>
            <p className="text-xs font-semibold uppercase tracking-editorial text-black/50">
              Consulta inicial
            </p>
            <h2 className="mt-7 max-w-4xl font-serif text-[clamp(3rem,6vw,6rem)] leading-[0.9] tracking-[-0.05em]">
              Encontremos el enfoque adecuado para tu asunto.
            </h2>
          </div>
          <Link
            href="/agenda"
            className="inline-flex min-h-12 w-fit items-center gap-3 bg-ink px-6 text-xs font-semibold uppercase tracking-[0.16em] text-paper transition hover:bg-ink-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink lg:justify-self-end"
          >
            Agendar una consulta
            <ArrowRight
              aria-hidden="true"
              className="size-4"
              strokeWidth={1.5}
            />
          </Link>
        </div>
      </section>
    </div>
  );
}
