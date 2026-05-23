"use client";

import { BRAND } from "@/lib/brand";
import { LiveBadge } from "@/components/ui/LiveBadge";
import { RefreshButton } from "@/components/ui/RefreshButton";
import { SearchBar } from "@/components/ui/SearchBar";
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
    <header className="glass-panel sticky top-0 z-30 shrink-0 border-b border-slate-800/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-3 py-2 sm:px-4 lg:px-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800/60 lg:hidden"
            aria-label="Open menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="hidden min-w-0 sm:block lg:hidden">
            <p className="truncate text-[13px] font-semibold text-slate-100">{BRAND.name}</p>
          </div>

          <div className="min-w-0 flex-1">
            <SearchBar value={search} onChange={onSearchChange} />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden text-right sm:block">
              <p className="text-[10px] text-slate-500">Sync · {syncLabel}</p>
              {feedSuccess != null && feedTotal && !loading && !refreshing && (
                <p className="text-[10px] tabular-nums text-slate-600">
                  {feedSuccess}/{feedTotal} feeds · {articleCount} signals
                </p>
              )}
            </div>
            <LiveBadge size="sm" className="hidden md:inline-flex" />
            <RefreshButton onClick={onRefresh} loading={refreshing || loading} />
          </div>
        </div>
      </div>
    </header>
  );
}
