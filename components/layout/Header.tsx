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
  articleCount,
  fetchedAt,
  feedSuccess,
  feedTotal,
  onMenuToggle,
}: HeaderProps) {
  return (
    <header className="glass-panel sticky top-0 z-30 border-b border-slate-800/80 px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={onMenuToggle}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 lg:hidden"
              aria-label="Open menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-100">
                {BRAND.name}
              </p>
              <p className="hidden truncate text-xs text-slate-500 sm:block">
                {loading
                  ? "Syncing…"
                  : `${articleCount.toLocaleString()} signals · ${fetchedAt ? formatRelativeTime(fetchedAt) : "—"}${feedSuccess != null && feedTotal ? ` · ${feedSuccess}/${feedTotal} feeds` : ""}`}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <LiveBadge size="sm" className="hidden sm:inline-flex" />
            <RefreshButton onClick={onRefresh} loading={loading} />
          </div>
        </div>
        <SearchBar value={search} onChange={onSearchChange} />
      </div>
    </header>
  );
}
