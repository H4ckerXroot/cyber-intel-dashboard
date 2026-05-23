"use client";

import { BookmarkActions } from "@/components/ui/BookmarkActions";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { ThreatTagBadge } from "@/components/ui/ThreatTagBadge";
import type { ThreatArticle } from "@/lib/types";
import { formatFullDate, formatRelativeTime, cn } from "@/lib/utils";
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
  const relativeTime = formatRelativeTime(article.publishedAt);
  const preview = article.aiSummary ?? article.summary;

  return (
    <article
      className={cn(
        "soc-card soc-card-hover group flex h-full min-h-[15.5rem] flex-col overflow-hidden",
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
      <div className="relative h-[7.25rem] shrink-0 overflow-hidden bg-slate-900/90">
        {showImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.image}
              alt=""
              className="h-full w-full object-cover object-center transition-transform duration-200 group-hover:scale-[1.01]"
              onError={() => setImgError(true)}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060d18] via-transparent to-transparent" />
          </>
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-900/60 px-2">
            <SourceBadge source={article.source} className="max-w-full" />
          </div>
        )}
        <div className="absolute left-2 top-2">
          <SeverityBadge severity={article.severity} />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1.5 p-2.5">
        {!showImage && onToggleSave && onToggleWatchlist && (
          <div className="flex items-center justify-between gap-1">
            <SourceBadge source={article.source} className="max-w-[70%]" />
            <div onClick={(e) => e.stopPropagation()}>
              <BookmarkActions
                saved={saved}
                watchlisted={watchlisted}
                onToggleSave={onToggleSave}
                onToggleWatchlist={onToggleWatchlist}
              />
            </div>
          </div>
        )}

        {showImage && onToggleSave && onToggleWatchlist && (
          <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
            <BookmarkActions
              saved={saved}
              watchlisted={watchlisted}
              onToggleSave={onToggleSave}
              onToggleWatchlist={onToggleWatchlist}
            />
          </div>
        )}

        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-slate-100 group-hover:text-blue-200/90">
          {article.title}
        </h3>

        {preview && (
          <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">
            {preview}
          </p>
        )}

        <div className="mt-auto space-y-1.5 border-t border-slate-800/50 pt-2">
          <div className="flex flex-wrap items-center gap-1">
            <CategoryBadge category={article.category} />
            {article.tags?.slice(0, 2).map((tag) => (
              <ThreatTagBadge key={tag} tag={tag} />
            ))}
          </div>
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
            <span className="truncate">
              {(article.iocs?.length ?? 0) > 0 && (
                <>
                  {article.iocs!.length} IOC{article.iocs!.length === 1 ? "" : "s"}
                  {article.threatScore != null && (
                    <span className="text-slate-600"> · {article.threatScore}</span>
                  )}
                </>
              )}
            </span>
            {showImage && (
              <SourceBadge source={article.source} className="max-w-[45%] shrink-0" />
            )}
            <time
              dateTime={article.publishedAt}
              className="ml-auto shrink-0 tabular-nums text-slate-500"
              title={formatFullDate(article.publishedAt)}
            >
              {relativeTime}
            </time>
          </div>
        </div>
      </div>
    </article>
  );
}
