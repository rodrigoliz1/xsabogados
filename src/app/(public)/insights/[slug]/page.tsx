import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleGrid } from "@/components/articles/ArticleGrid";
import { EditorialImage } from "@/components/ui/editorial-image";
import { siteConfig } from "@/config/site";
import {
  articleDisclaimer,
  articles,
  getArticleBySlug,
  getArticlesBySlugs,
} from "@/data/articles";
import { articleImages } from "@/data/editorial-images";

const SITE_URL = siteConfig.url;

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00.000Z`));
}

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: "Artículo no encontrado | XS ABOGADOS" };
  }

  return {
    title: `${article.seo.title} | XS ABOGADOS`,
    description: article.seo.description,
    keywords: [...article.seo.keywords],
    authors: [{ name: article.author }],
    alternates: { canonical: `${SITE_URL}/insights/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `${SITE_URL}/insights/${article.slug}`,
      type: "article",
      publishedTime: `${article.publishedAt}T12:00:00.000Z`,
      authors: [article.author],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  const relatedArticles = getArticlesBySlugs(article.relatedSlugs);
  const editorialImage =
    articleImages[article.slug as keyof typeof articleImages] ?? undefined;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${SITE_URL}/insights/${article.slug}#article`,
        headline: article.title,
        description: article.excerpt,
        datePublished: article.publishedAt,
        dateModified: article.publishedAt,
        mainEntityOfPage: `${SITE_URL}/insights/${article.slug}`,
        author: {
          "@type": "Organization",
          name: article.author,
          url: SITE_URL,
        },
        publisher: {
          "@type": "LegalService",
          name: "XS ABOGADOS",
          url: SITE_URL,
        },
        articleSection: article.practiceArea,
        inLanguage: "es-MX",
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
          {
            "@type": "ListItem",
            position: 3,
            name: article.title,
            item: `${SITE_URL}/insights/${article.slug}`,
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

      <article>
        <header className="mx-auto max-w-shell px-5 pb-20 pt-32 sm:px-8 sm:pt-40 lg:px-12 lg:pb-28 lg:pt-48">
          <Link
            href="/insights"
            className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper-muted transition hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper"
          >
            <ArrowLeft
              aria-hidden="true"
              className="size-4"
              strokeWidth={1.5}
            />
            Todos los insights
          </Link>

          <div className="mt-12 border-t border-white/15 pt-10">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-paper-quiet">
              <Link
                href={`/areas/${article.practiceAreaSlug}`}
                className="transition hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper"
              >
                {article.practiceArea}
              </Link>
              <span
                aria-hidden="true"
                className="size-1 rounded-full bg-white/35"
              />
              <time dateTime={article.publishedAt}>
                {formatDate(article.publishedAt)}
              </time>
              <span
                aria-hidden="true"
                className="size-1 rounded-full bg-white/35"
              />
              <span>{article.readingTime}</span>
            </div>
            <h1 className="mt-8 max-w-6xl font-serif text-[clamp(4rem,9vw,9rem)] leading-[0.8] tracking-[-0.06em]">
              {article.title}
            </h1>
            <p className="mt-10 max-w-3xl text-xl leading-9 text-paper-muted sm:text-2xl sm:leading-10">
              {article.excerpt}
            </p>
            <p className="mt-8 text-sm text-paper-quiet">
              Por {article.author}
            </p>
          </div>
        </header>

        {editorialImage ? (
          <section className="mx-auto max-w-shell px-5 pb-20 sm:px-8 lg:px-12 lg:pb-28">
            <EditorialImage
              className="aspect-[16/7] min-h-[24rem]"
              image={editorialImage}
              priority
              sizes="(max-width: 1280px) 100vw, 1200px"
            />
          </section>
        ) : null}

        <div className="border-y border-white/15 bg-paper text-ink">
          <div className="mx-auto grid max-w-shell gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.62fr_1.38fr] lg:gap-20 lg:px-12 lg:py-28">
            <div>
              <span className="font-serif text-8xl font-light text-black/10 sm:text-9xl">
                {article.index}
              </span>
            </div>
            <div className="max-w-4xl space-y-7 font-serif text-[clamp(2rem,4vw,3.75rem)] leading-[1.06] tracking-[-0.035em]">
              {article.introduction.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-5 py-24 sm:px-8 lg:py-36">
          {article.sections.map((section, index) => (
            <section
              key={section.heading}
              className={`grid gap-7 ${index > 0 ? "mt-20 border-t border-white/15 pt-16" : ""}`}
            >
              <p className="text-xs font-semibold uppercase tracking-editorial text-paper-quiet">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="font-serif text-[clamp(2.7rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.045em]">
                {section.heading}
              </h2>
              <div className="space-y-6 text-lg leading-9 text-paper-muted">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {section.points ? (
                <ul className="mt-2 border-t border-white/15">
                  {section.points.map((point, pointIndex) => (
                    <li
                      key={point}
                      className="grid gap-3 border-b border-white/15 py-5 sm:grid-cols-[3rem_1fr]"
                    >
                      <span className="text-xs tracking-[0.16em] text-paper-quiet">
                        {String(pointIndex + 1).padStart(2, "0")}
                      </span>
                      <span className="text-base leading-7 text-paper-muted">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          <aside className="mt-20 border border-white/15 bg-ink-2 p-6 text-sm leading-7 text-paper-muted sm:p-8">
            {articleDisclaimer}
          </aside>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href={`/agenda?area=${article.practiceAreaSlug}`}
              className="inline-flex min-h-12 items-center gap-3 bg-paper px-6 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper"
            >
              Agendar una consulta
              <ArrowRight
                aria-hidden="true"
                className="size-4"
                strokeWidth={1.5}
              />
            </Link>
            <Link
              href={`/areas/${article.practiceAreaSlug}`}
              className="inline-flex min-h-12 items-center gap-3 border border-white/20 px-6 text-xs font-semibold uppercase tracking-[0.16em] text-paper transition hover:border-white/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper"
            >
              Ver área relacionada
            </Link>
          </div>
        </div>
      </article>

      <section className="border-t border-white/15 bg-ink-2">
        <div className="mx-auto max-w-shell px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <p className="text-xs font-semibold uppercase tracking-editorial text-paper-quiet">
            Lecturas relacionadas
          </p>
          <h2 className="mb-12 mt-7 font-serif text-5xl tracking-[-0.045em] sm:text-7xl">
            Continuar el análisis.
          </h2>
          <ArticleGrid articles={relatedArticles} />
        </div>
      </section>
    </div>
  );
}
