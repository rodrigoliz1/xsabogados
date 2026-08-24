import type { Metadata } from "next";
import { ArticleExplorer } from "@/components/articles/ArticleExplorer";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";
import {
  articleDisclaimer,
  articles,
  type ArticleListing,
} from "@/data/articles";
import { db } from "@/lib/db";

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

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const published = process.env.DATABASE_URL
    ? await db.article
        .findMany({
          where: { status: "PUBLISHED", publishedAt: { not: null } },
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            publishedAt: true,
            readingMinutes: true,
            heroMedia: { select: { id: true, altText: true } },
            author: { select: { name: true } },
            practiceArea: { select: { name: true } },
          },
          orderBy: { publishedAt: "desc" },
        })
        .catch(() => [])
    : [];
  const storedListings: ArticleListing[] = published
    .filter((article) => !articles.some((item) => item.slug === article.slug))
    .map((article, index) => ({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      author: article.author?.name || "XS ABOGADOS",
      practiceArea: article.practiceArea?.name || "Análisis jurídico",
      practiceAreaSlug: "",
      publishedAt: (article.publishedAt || new Date())
        .toISOString()
        .slice(0, 10),
      readingTime: `${article.readingMinutes} min de lectura`,
      index: String(articles.length + index + 1).padStart(2, "0"),
      imageUrl: article.heroMedia
        ? `/api/media/${article.heroMedia.id}`
        : undefined,
      imageAlt: article.heroMedia?.altText,
    }));
  const allArticles = [...articles, ...storedListings].sort((left, right) =>
    right.publishedAt.localeCompare(left.publishedAt),
  );
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Insights de XS ABOGADOS",
        url: `${SITE_URL}/insights`,
        description:
          "Perspectivas jurídicas de carácter general elaboradas por XS ABOGADOS.",
        hasPart: allArticles.map((article) => ({
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
      <JsonLd data={structuredData} />

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
        <ArticleExplorer articles={allArticles} />
        <p className="mt-6 max-w-3xl text-xs leading-6 text-paper-quiet">
          {articleDisclaimer}
        </p>
      </section>
    </div>
  );
}
