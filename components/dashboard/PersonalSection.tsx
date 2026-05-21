"use client";

import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { NewsCard } from "@/components/ui/NewsCard";
import type { ThreatArticle } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PersonalSectionProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  articles: ThreatArticle[];
  loading?: boolean;
  emptyMessage: string;
  isSaved: (id: string) => boolean;
  isWatchlisted: (id: string) => boolean;
  onToggleSave: (id: string) => void;
  onToggleWatchlist: (id: string) => void;
  onSelect: (article: ThreatArticle) => void;
  className?: string;
}

export function PersonalSection({
  id,
  title,
  description,
  icon,
  articles,
  loading,
  emptyMessage,
  isSaved,
  isWatchlisted,
  onToggleSave,
  onToggleWatchlist,
  onSelect,
  className,
}: PersonalSectionProps) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-20 flex flex-col gap-2.5", className)}
      aria-labelledby={`${id}-heading`}
    >
      <div className="flex items-center gap-2.5 border-b border-slate-800/60 pb-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-800/80 text-sm">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h2 id={`${id}-heading`} className="text-sm font-semibold text-slate-100">
            {title}
          </h2>
          <p className="text-[11px] text-slate-500">{description}</p>
        </div>
        <span className="shrink-0 text-xs tabular-nums text-slate-500">
          {articles.length}
        </span>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} />
      ) : articles.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-800 py-8 text-center">
          <p className="text-sm text-slate-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
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
