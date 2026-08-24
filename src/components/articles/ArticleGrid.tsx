import type { ArticleListing } from "@/data/articles";

import { ArticleCard } from "./ArticleCard";

type ArticleGridProps = {
  articles: readonly ArticleListing[];
};

export function ArticleGrid({ articles }: ArticleGridProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </div>
  );
}
