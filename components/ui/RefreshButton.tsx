"use client";

import { cn } from "@/lib/utils";

interface RefreshButtonProps {
  onClick: () => void;
  loading?: boolean;
  className?: string;
}

export function RefreshButton({ onClick, loading, className }: RefreshButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={cn(
        "rounded-lg border border-slate-700/80 bg-slate-800/50 px-3 py-2 text-xs font-medium text-slate-300 transition-colors",
        "hover:border-blue-500/40 hover:bg-slate-800 hover:text-slate-100",
        "disabled:cursor-wait disabled:opacity-70",
        className
      )}
      aria-label="Refresh feeds"
      aria-busy={loading}
    >
      <span className="flex items-center gap-1.5">
        <svg
          className={cn("h-3.5 w-3.5", loading && "animate-spin")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        {loading ? "Syncing…" : "Refresh"}
      </span>
    </button>
  );
}
