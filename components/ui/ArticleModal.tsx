"use client";

import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { SourceBadge } from "@/components/ui/SourceBadge";
import type { ThreatArticle } from "@/lib/types";
import { formatFullDate, cn } from "@/lib/utils";
import { useEffect } from "react";

interface ArticleModalProps {
  article: ThreatArticle | null;
  onClose: () => void;
}

export function ArticleModal({ article, onClose }: ArticleModalProps) {
  useEffect(() => {
    if (!article) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [article, onClose]);

  if (!article) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="article-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close dialog"
      />

      <div
        className={cn(
          "relative z-10 w-full max-w-lg animate-fade-in overflow-hidden rounded-xl",
          "border border-slate-700/80 bg-slate-900 shadow-2xl"
        )}
      >
        <div className="border-b border-slate-800 px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <SeverityBadge severity={article.severity} size="md" />
            <CategoryBadge category={article.category} size="md" />
          </div>
          <h2
            id="article-modal-title"
            className="mt-3 text-lg font-semibold leading-snug text-slate-50"
          >
            {article.title}
          </h2>
        </div>

        <div className="space-y-4 px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <SourceBadge source={article.source} className="max-w-none" />
            <time
              dateTime={article.publishedAt}
              className="text-slate-500"
            >
              {formatFullDate(article.publishedAt)}
            </time>
          </div>

          {article.summary ? (
            <div>
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Summary
              </p>
              <p className="text-sm leading-relaxed text-slate-300">
                {article.summary}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No summary available.</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-800 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
          >
            Close
          </button>
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          >
            Open Article
          </a>
        </div>
      </div>
    </div>
  );
}
