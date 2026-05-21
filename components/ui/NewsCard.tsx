"use client";

import { BookmarkActions } from "@/components/ui/BookmarkActions";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { SourceBadge } from "@/components/ui/SourceBadge";
import type { ThreatArticle } from "@/lib/types";
import { formatRelativeTime, cn } from "@/lib/utils";
import { useState } from "react";

interface NewsCardProps {
  article: ThreatArticle;
  className?: string;
  saved?: boolean;
  watchlisted?: boolean;
  onToggleSave?: () => void;
  onToggleWatchlist?: () => void;
  onSelect?: () => void;
}

export function NewsCard({
  article,
  className,
  saved = false,
  watchlisted = false,
  onToggleSave,
  onToggleWatchlist,
  onSelect,
}: NewsCardProps) {
  const [imgError, setImgError] = useState(false);
  const showImage = article.image && !imgError;

  return (
    <article
      className={cn(
        "glass-card group flex flex-col overflow-hidden rounded-xl transition-all duration-200",
        "hover:border-slate-600/80 hover:shadow-md hover:shadow-black/20",
        onSelect && "cursor-pointer",
        className
      )}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (onSelect && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onSelect();
        }
      }}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-900/80">
        {showImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.image}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              onError={() => setImgError(true)}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
          </>
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-800/50">
            <span className="font-mono text-sm font-medium text-slate-600">
              {article.source.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute left-3 top-3">
          <SeverityBadge severity={article.severity} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <SourceBadge source={article.source} />
          {onToggleSave && onToggleWatchlist && (
            <div onClick={(e) => e.stopPropagation()}>
              <BookmarkActions
                saved={saved}
                watchlisted={watchlisted}
                onToggleSave={onToggleSave}
                onToggleWatchlist={onToggleWatchlist}
              />
            </div>
          )}
        </div>

        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-slate-100 group-hover:text-blue-200">
          {article.title}
        </h3>

        {article.summary && (
          <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">
            {article.summary}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-800/60 pt-3">
          <CategoryBadge category={article.category} />
          <time
            dateTime={article.publishedAt}
            className="shrink-0 text-[11px] text-slate-500"
          >
            {formatRelativeTime(article.publishedAt)}
          </time>
        </div>
      </div>
    </article>
  );
}
