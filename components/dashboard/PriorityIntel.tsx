"use client";

import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { NewsCard } from "@/components/ui/NewsCard";
import type { ThreatArticle } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PriorityBlockProps {
  title: string;
  description: string;
  articles: ThreatArticle[];
  loading?: boolean;
  onSelect: (article: ThreatArticle) => void;
  isSaved: (id: string) => boolean;
  isWatchlisted: (id: string) => boolean;
  onToggleSave: (id: string) => void;
  onToggleWatchlist: (id: string) => void;
}

function PriorityBlock({
  title,
  description,
  articles,
  loading,
  onSelect,
  isSaved,
  isWatchlisted,
  onToggleSave,
  onToggleWatchlist,
}: PriorityBlockProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <h3 className="section-heading">{title}</h3>
          <p className="section-subheading">{description}</p>
        </div>
        {!loading && (
          <span className="shrink-0 text-xs tabular-nums text-slate-500">
            {articles.length}
          </span>
        )}
      </div>
      {loading ? (
        <LoadingSkeleton count={3} />
      ) : articles.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-800 py-6 text-center text-xs text-slate-500">
          No articles in this category
        </p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 2xl:grid-cols-3">
          {articles.slice(0, 6).map((article) => (
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
    </div>
  );
}

interface PriorityIntelProps {
  latestNews: ThreatArticle[];
  cveAlerts: ThreatArticle[];
  ransomware: ThreatArticle[];
  loading?: boolean;
  onSelect: (article: ThreatArticle) => void;
  isSaved: (id: string) => boolean;
  isWatchlisted: (id: string) => boolean;
  onToggleSave: (id: string) => void;
  onToggleWatchlist: (id: string) => void;
  className?: string;
}

export function PriorityIntel({
  latestNews,
  cveAlerts,
  ransomware,
  loading,
  onSelect,
  isSaved,
  isWatchlisted,
  onToggleSave,
  onToggleWatchlist,
  className,
}: PriorityIntelProps) {
  return (
    <section
      id="priority-intel"
      className={cn("scroll-mt-16 flex flex-col gap-3", className)}
      aria-label="Priority intelligence"
    >
      <div className="border-b border-slate-800/50 pb-1.5">
        <h2 className="section-heading">Priority Intelligence</h2>
        <p className="section-subheading">Latest news, CVEs, and ransomware</p>
      </div>

      <div id="latest-threat-news" className="scroll-mt-20">
        <PriorityBlock
          title="Latest Threat News"
          description="Breaking headlines and industry updates"
          articles={latestNews}
          loading={loading}
          onSelect={onSelect}
          isSaved={isSaved}
          isWatchlisted={isWatchlisted}
          onToggleSave={onToggleSave}
          onToggleWatchlist={onToggleWatchlist}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div id="cve-alerts" className="scroll-mt-20">
          <PriorityBlock
            title="CVE Alerts"
            description="Vulnerabilities and patch advisories"
            articles={cveAlerts}
            loading={loading}
            onSelect={onSelect}
            isSaved={isSaved}
            isWatchlisted={isWatchlisted}
            onToggleSave={onToggleSave}
            onToggleWatchlist={onToggleWatchlist}
          />
        </div>
        <div id="ransomware-updates" className="scroll-mt-20">
          <PriorityBlock
            title="Ransomware Updates"
            description="Incidents and extortion activity"
            articles={ransomware}
            loading={loading}
            onSelect={onSelect}
            isSaved={isSaved}
            isWatchlisted={isWatchlisted}
            onToggleSave={onToggleSave}
            onToggleWatchlist={onToggleWatchlist}
          />
        </div>
      </div>
    </section>
  );
}
