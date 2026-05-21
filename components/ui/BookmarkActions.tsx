"use client";

import { cn } from "@/lib/utils";

interface BookmarkActionsProps {
  saved: boolean;
  watchlisted: boolean;
  onToggleSave: () => void;
  onToggleWatchlist: () => void;
  className?: string;
}

export function BookmarkActions({
  saved,
  watchlisted,
  onToggleSave,
  onToggleWatchlist,
  className,
}: BookmarkActionsProps) {
  return (
    <div className={cn("flex gap-1", className)}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onToggleSave();
        }}
        className={cn(
          "rounded-lg p-1.5 transition-all",
          saved
            ? "text-amber-400 hover:bg-amber-500/10"
            : "text-zinc-500 hover:bg-blue-500/10 hover:text-blue-400"
        )}
        aria-label={saved ? "Remove from saved" : "Save article"}
        title={saved ? "Saved" : "Save"}
      >
        <svg className="h-4 w-4" fill={saved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onToggleWatchlist();
        }}
        className={cn(
          "rounded-lg p-1.5 transition-all",
          watchlisted
            ? "text-cyan-400 hover:bg-cyan-500/10"
            : "text-zinc-500 hover:bg-blue-500/10 hover:text-blue-400"
        )}
        aria-label={watchlisted ? "Remove from watchlist" : "Add to watchlist"}
        title={watchlisted ? "On watchlist" : "Watchlist"}
      >
        <svg className="h-4 w-4" fill={watchlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>
    </div>
  );
}
