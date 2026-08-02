import type { Metadata } from "next";

import { ArticleExplorer } from "@/components/articles/ArticleExplorer";
import { siteConfig } from "@/config/site";
import { articleDisclaimer, articles } from "@/data/articles";

const SITE_URL = siteConfig.url;

export const metadata: Metadata = {
  title: "Insights | XS ABOGADOS",
  description:
    "Análisis general sobre prevención de controversias, reestructuración financiera y defensa frente a actos de autoridad.",
  alternates: { canonical: `${SITE_URL}/insights` },
  openGraph: {
    title: "Insights | XS ABOGADOS",
    description:
      "Perspectivas jurídicas para comprender decisiones, riesgos y escenarios complejos.",
    url: `${SITE_URL}/insights`,
    type: "website",
  },
};

export default function InsightsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Insights de XS ABOGADOS",
        url: `${SITE_URL}/insights`,
        description:
          "Perspectivas jurídicas de carácter general elaboradas por XS ABOGADOS.",
        hasPart: articles.map((article) => ({
          "@type": "Article",
          headline: article.title,
          url: `${SITE_URL}/insights/${article.slug}`,
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
            name: "Insights",
            item: `${SITE_URL}/insights`,
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
          Insights / Análisis general
        </p>
        <div className="mt-12 grid gap-10 border-t border-white/15 pt-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-end lg:gap-20">
          <h1 className="font-serif text-[clamp(4.5rem,11vw,10rem)] leading-[0.78] tracking-[-0.065em]">
            Pensar
            <br />
            antes.
          </h1>
          <p className="max-w-md pb-2 text-base leading-8 text-paper-muted">
            Notas para identificar preguntas, ordenar información y comprender
            mejor el contexto jurídico de decisiones relevantes.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-shell px-5 pb-28 sm:px-8 lg:px-12 lg:pb-40">
        <ArticleExplorer articles={articles} />
        <p className="mt-6 max-w-3xl text-xs leading-6 text-paper-quiet">
          {articleDisclaimer}
        </p>
      </section>
    </div>
  );
}
