"use client";

import { NotificationCenter } from "@/components/layout/NotificationCenter";
import { UserProfileMenu } from "@/components/layout/UserProfileMenu";
import { LiveBadge } from "@/components/ui/LiveBadge";
import { RefreshButton } from "@/components/ui/RefreshButton";
import { SearchBar } from "@/components/ui/SearchBar";
import type { ThreatArticle, ThreatSeverity } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";

interface HeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  loading: boolean;
  refreshing: boolean;
  articleCount: number;
  fetchedAt?: string;
  feedSuccess?: number;
  feedTotal?: number;
  severityCounts: Record<ThreatSeverity, number>;
  allArticles: ThreatArticle[];
  onMenuToggle: () => void;
}

export function Header({
  search,
  onSearchChange,
  onRefresh,
  loading,
  refreshing,
  articleCount,
  fetchedAt,
  feedSuccess,
  feedTotal,
  severityCounts,
  allArticles,
  onMenuToggle,
}: HeaderProps) {
  const syncLabel = refreshing
    ? "Syncing…"
    : loading
      ? "Loading…"
      : fetchedAt
        ? formatRelativeTime(fetchedAt)
        : "—";

  return (
    <header className="topbar sticky top-0 z-40 shrink-0 border-b border-slate-800/80">
      <div className="flex h-14 items-center gap-2 px-3 sm:gap-3 sm:px-4">
        <button
          type="button"
          onClick={onMenuToggle}
          className="shrink-0 rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-800/60 lg:hidden"
          aria-label="Open menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="min-w-0 flex-1">
          <SearchBar value={search} onChange={onSearchChange} />
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          <div className="hidden text-right lg:block">
            <p className="text-[11px] text-slate-500">Sync · {syncLabel}</p>
            {feedSuccess != null && feedTotal && !loading && !refreshing && (
              <p className="text-[11px] tabular-nums text-slate-600">
                {feedSuccess}/{feedTotal} feeds · {articleCount} signals
              </p>
            )}
          </div>

          <LiveBadge size="sm" className="hidden sm:inline-flex" />
          <RefreshButton onClick={onRefresh} loading={refreshing || loading} />

          <div className="mx-0.5 hidden h-6 w-px bg-slate-800 md:block" aria-hidden />

          <NotificationCenter
            severityCounts={severityCounts}
            articles={allArticles}
          />
          <UserProfileMenu />
        </div>
      </div>
    </header>
  );
}
