import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { PracticeAreaGrid } from "@/components/practice-areas/PracticeAreaGrid";
import { EditorialImage } from "@/components/ui/editorial-image";
import { siteConfig } from "@/config/site";
import { editorialImages } from "@/data/editorial-images";
import { practiceAreas } from "@/data/practice-areas";

const SITE_URL = siteConfig.url;

export const metadata: Metadata = {
  title: "Áreas de práctica | XS ABOGADOS",
  description:
    "Asesoría corporativa, bancaria y financiera; litigio civil, mercantil, administrativo, fiscal y constitucional; recuperación de cartera y reestructuración.",
  keywords: [
    "abogados en Guadalajara",
    "abogados corporativos",
    "derecho bancario y financiero",
    "litigio civil y mercantil",
    "recuperación de cartera",
  ],
  alternates: { canonical: `${SITE_URL}/areas` },
  openGraph: {
    title: "Áreas de práctica | XS ABOGADOS",
    description:
      "Cuatro áreas conectadas por una misma forma de trabajar: comprensión, diagnóstico, estrategia, ejecución y seguimiento.",
    url: `${SITE_URL}/areas`,
    type: "website",
  },
};

export default function PracticeAreasPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: "Áreas de práctica de XS ABOGADOS",
        itemListElement: practiceAreas.map((area, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: area.title,
          url: `${SITE_URL}/areas/${area.slug}`,
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
            name: "Áreas de práctica",
            item: `${SITE_URL}/areas`,
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
          Áreas de práctica / 01—04
        </p>
        <div className="mt-12 grid gap-10 border-t border-white/15 pt-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-end lg:gap-20">
          <h1 className="font-serif text-[clamp(4.5rem,11vw,10rem)] leading-[0.78] tracking-[-0.065em]">
            Precisión
            <br />
            aplicada.
          </h1>
          <p className="max-w-md pb-2 text-base leading-8 text-paper-muted">
            Cada práctica se conecta con las demás para comprender la dimensión
            corporativa, financiera, contenciosa y pública de una decisión.
          </p>
        </div>

      </section>

      <section className="mx-auto max-w-shell px-5 pb-28 sm:px-8 lg:px-12 lg:pb-40">
        <PracticeAreaGrid areas={practiceAreas} />
      </section>

      <section className="border-y border-white/15 bg-paper text-ink">
        <div className="mx-auto grid max-w-shell gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-end lg:px-12 lg:py-28">
          <div>
            <p className="text-xs font-semibold uppercase tracking-editorial text-black/50">
              Punto de entrada
            </p>
            <h2 className="mt-7 max-w-4xl font-serif text-[clamp(3rem,6vw,6rem)] leading-[0.9] tracking-[-0.05em]">
              Si el asunto cruza varias áreas, comenzamos por el contexto.
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
