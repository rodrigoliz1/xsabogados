import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { Article } from "@/data/articles";
import { articleImages } from "@/data/editorial-images";

type ArticleCardProps = {
  article: Article;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00.000Z`));
}

export function ArticleCard({ article }: ArticleCardProps) {
  const image =
    articleImages[article.slug as keyof typeof articleImages] ?? undefined;

  return (
    <article className="group relative flex min-h-[25rem] flex-col overflow-hidden border border-white/15 bg-ink-2 p-6 transition duration-500 hover:border-white/35 hover:bg-ink-3 sm:p-8">
      {image ? (
        <div className="absolute inset-x-0 top-0 h-[46%] overflow-hidden border-b border-white/10">
          <Image
            alt={image.alt}
            className="object-cover grayscale transition duration-700 group-hover:scale-[1.035] group-hover:grayscale-0 motion-reduce:transform-none motion-reduce:transition-none"
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            src={image.src}
            style={{ objectPosition: image.position ?? "center" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-transparent to-black/10" />
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="absolute -right-24 top-10 size-64 rounded-full border border-white/10 transition-transform duration-700 group-hover:scale-125 motion-reduce:transform-none motion-reduce:transition-none"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute right-12 top-0 h-44 w-px rotate-[32deg] bg-white/10"
      />

      <div className="relative flex items-start justify-between gap-4">
        <span className="font-serif text-5xl font-light tracking-[-0.05em] text-white/20">
          {article.index}
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className="size-5 text-paper-quiet transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-paper motion-reduce:transform-none motion-reduce:transition-none"
          strokeWidth={1.25}
        />
      </div>

      <div className="relative mt-auto">
        <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-paper-quiet">
          <span>{article.practiceArea}</span>
          <span
            aria-hidden="true"
            className="size-1 rounded-full bg-white/35"
          />
          <time dateTime={article.publishedAt}>
            {formatDate(article.publishedAt)}
          </time>
        </div>
        <h2 className="max-w-2xl font-serif text-3xl leading-[1.02] tracking-[-0.035em] text-paper sm:text-4xl">
          {article.title}
        </h2>
        <p className="mt-5 max-w-2xl text-sm leading-6 text-paper-muted sm:text-base sm:leading-7">
          {article.excerpt}
        </p>
        <div className="mt-7 flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.14em] text-paper-quiet">
          <span>{article.readingTime}</span>
        </div>
      </div>

      <Link
        href={`/insights/${article.slug}`}
        aria-label={`Leer ${article.title}`}
        className="absolute inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-paper"
      >
        <span className="sr-only">Leer {article.title}</span>
      </Link>
    </article>
  );
}
