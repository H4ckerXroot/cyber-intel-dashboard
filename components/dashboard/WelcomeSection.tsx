"use client";

import { BRAND } from "@/lib/brand";
import { LiveBadge } from "@/components/ui/LiveBadge";
import { TypingText } from "@/components/ui/TypingText";
import { formatRelativeTime } from "@/lib/utils";

interface WelcomeSectionProps {
  fetchedAt?: string;
  loading?: boolean;
  refreshing?: boolean;
  articleCount: number;
}

export function WelcomeSection({
  fetchedAt,
  loading,
  refreshing,
  articleCount,
}: WelcomeSectionProps) {
  const syncText = refreshing
    ? "Syncing feeds…"
    : loading
      ? "Loading feeds…"
      : `Last sync · ${fetchedAt ? formatRelativeTime(fetchedAt) : "—"}`;

  return (
    <div className="soc-card soc-card-hover relative overflow-hidden">
      <div className="hero-glow" />

      <div className="relative px-3.5 py-3 sm:px-4 sm:py-3.5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <LiveBadge />
          <span className="text-[11px] text-slate-500">{syncText}</span>
          <span className="hidden text-[11px] text-slate-600 sm:inline">
            · {BRAND.maxArticleAgeHours}h window
          </span>
        </div>

        <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.12em] text-blue-400/70">
          {BRAND.name}
        </p>
        <h1 className="mt-0.5 text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
          {BRAND.greeting}
        </h1>
        <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
          {BRAND.subtitle}
        </p>

        <TypingText
          text="Monitoring live threat intelligence feeds..."
          className="mt-2 min-h-[16px] text-[11px]"
        />

        <p className="mt-2 text-[11px] text-slate-500">
          <span className="font-medium tabular-nums text-slate-300">
            {loading ? "—" : articleCount.toLocaleString()}
          </span>{" "}
          signals · {BRAND.feedCount} sources
        </p>
      </div>
    </div>
  );
}
