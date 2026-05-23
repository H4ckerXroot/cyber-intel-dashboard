"use client";

import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { NewsCard } from "@/components/ui/NewsCard";
import { getCategoryMeta } from "@/lib/categories";
import type { ThreatArticle, ThreatCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ThreatSectionProps {
  category: ThreatCategory;
  articles: ThreatArticle[];
  loading?: boolean;
  maxItems?: number;
  isSaved: (id: string) => boolean;
  isWatchlisted: (id: string) => boolean;
  onToggleSave: (id: string) => void;
  onToggleWatchlist: (id: string) => void;
  onSelect: (article: ThreatArticle) => void;
  className?: string;
}

export function ThreatSection({
  category,
  articles,
  loading,
  maxItems = 6,
  isSaved,
  isWatchlisted,
  onToggleSave,
  onToggleWatchlist,
  onSelect,
  className,
}: ThreatSectionProps) {
  const meta = getCategoryMeta(category);
  const displayArticles = articles.slice(0, maxItems);

  return (
    <section
      id={category}
      className={cn("scroll-mt-16 flex flex-col gap-2", className)}
      aria-labelledby={`${category}-heading`}
    >
      <div className="flex items-center gap-2.5 border-b border-slate-700/50 pb-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-800/60 text-sm">
          {meta.icon}
        </div>
        <div className="min-w-0 flex-1">
          <h2 id={`${category}-heading`} className="content-block-title">
            {meta.label}
          </h2>
          <p className="content-block-desc">{meta.description}</p>
        </div>
        <span className="shrink-0 rounded-md bg-slate-800/60 px-2 py-0.5 text-xs tabular-nums text-slate-400">
          {articles.length}
        </span>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} />
      ) : displayArticles.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-800 py-8 text-center">
          <p className="text-sm text-slate-500">
            No articles match your current filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
          {displayArticles.map((article) => (
            <NewsCard
              key={article.id}
              article={article}
              saved={isSaved(article.id)}
              watchlisted={isWatchlisted(article.id)}
              onToggleSave={() => onToggleSave(article.id)}
              onToggleWatchlist={() => onToggleWatchlist(article.id)}
              onSelect={() => onSelect(article)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
