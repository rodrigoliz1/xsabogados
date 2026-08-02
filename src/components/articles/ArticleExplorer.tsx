"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import type { Article } from "@/data/articles";

import { ArticleGrid } from "./ArticleGrid";

type ArticleExplorerProps = {
  articles: readonly Article[];
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-MX");
}

export function ArticleExplorer({ articles }: ArticleExplorerProps) {
  const [query, setQuery] = useState("");
  const [activeArea, setActiveArea] = useState("Todas");
  const areas = useMemo(
    () => [
      "Todas",
      ...new Set(articles.map((article) => article.practiceArea)),
    ],
    [articles],
  );

  const filteredArticles = useMemo(() => {
    const normalizedQuery = normalize(query.trim());

    return articles.filter((article) => {
      const matchesArea =
        activeArea === "Todas" || article.practiceArea === activeArea;
      const searchable = normalize(
        `${article.title} ${article.excerpt} ${article.practiceArea}`,
      );
      const matchesQuery =
        normalizedQuery.length === 0 || searchable.includes(normalizedQuery);

      return matchesArea && matchesQuery;
    });
  }, [activeArea, articles, query]);

  const clearFilters = () => {
    setQuery("");
    setActiveArea("Todas");
  };

  return (
    <div>
      <div className="mb-8 grid gap-5 border-y border-white/15 py-6 lg:grid-cols-[minmax(16rem,0.8fr)_1.2fr] lg:items-center">
        <label className="relative block">
          <span className="sr-only">Buscar artículos</span>
          <Search
            aria-hidden="true"
            className="absolute left-0 top-1/2 size-4 -translate-y-1/2 text-paper-quiet"
            strokeWidth={1.5}
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por tema o palabra clave"
            className="min-h-12 w-full border-b border-white/20 bg-transparent py-3 pl-7 pr-3 text-sm text-paper outline-none placeholder:text-paper-quiet focus:border-paper"
          />
        </label>

        <div
          className="flex gap-2 overflow-x-auto [scrollbar-width:none] lg:justify-end [&::-webkit-scrollbar]:hidden"
          aria-label="Filtrar artículos por área"
        >
          {areas.map((area) => {
            const isActive = activeArea === area;

            return (
              <button
                key={area}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveArea(area)}
                className={`min-h-11 shrink-0 rounded-full border px-4 text-[0.68rem] font-semibold uppercase tracking-[0.12em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper ${
                  isActive
                    ? "border-paper bg-paper text-ink"
                    : "border-white/15 text-paper-muted hover:border-white/40 hover:text-paper"
                }`}
              >
                {area}
              </button>
            );
          })}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {filteredArticles.length} artículos encontrados.
      </p>

      {filteredArticles.length > 0 ? (
        <ArticleGrid articles={filteredArticles} />
      ) : (
        <div className="flex min-h-72 flex-col items-center justify-center border border-white/15 px-6 text-center">
          <p className="font-serif text-3xl text-paper">
            No encontramos artículos con esos criterios.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-6 inline-flex min-h-11 items-center gap-2 border-b border-paper text-xs font-semibold uppercase tracking-[0.15em] text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper"
          >
            <X aria-hidden="true" className="size-4" strokeWidth={1.5} />
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
