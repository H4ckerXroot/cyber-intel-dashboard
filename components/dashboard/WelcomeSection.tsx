"use client";

import { BRAND } from "@/lib/brand";
import { BrandLogo } from "@/components/ui/BrandLogo";
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
    <div className="glass-hero relative h-full overflow-hidden rounded-lg border border-slate-800/70">
      <div className="hero-glow" />
      <div className="hero-ambient" />

      <div className="relative flex h-full items-stretch justify-between gap-4 px-4 py-3.5 sm:px-5 sm:py-4">
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <LiveBadge />
            <span className="text-[11px] text-slate-500">{syncText}</span>
            <span className="hidden text-[11px] text-slate-600 sm:inline">
              · {BRAND.maxArticleAgeHours}h window
            </span>
          </div>

          <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.14em] text-blue-400/75">
            {BRAND.name}
          </p>
          <h1 className="mt-0.5 text-lg font-semibold tracking-tight text-slate-50 sm:text-[1.35rem]">
            {BRAND.greeting}
          </h1>
          <p className="mt-0.5 max-w-md text-[11px] leading-snug text-slate-500">
            {BRAND.subtitle}
          </p>

          <TypingText
            text="Monitoring live threat intelligence feeds..."
            className="mt-2 min-h-[16px]"
          />

          <p className="mt-2 text-[11px] text-slate-500">
            <span className="font-medium tabular-nums text-slate-300">
              {loading ? "—" : articleCount.toLocaleString()}
            </span>{" "}
            signals · {BRAND.feedCount} sources
          </p>
        </div>

        <div className="hidden shrink-0 flex-col items-center justify-center rounded-lg border border-slate-700/50 bg-slate-900/50 px-4 py-3 sm:flex">
          <div className="rounded-lg bg-blue-600/10 p-2 ring-1 ring-blue-500/20">
            <BrandLogo size="md" />
          </div>
          <p className="mt-2 text-[10px] font-semibold text-slate-300">{BRAND.shortName}</p>
          <p className="text-[9px] text-slate-600">Operations</p>
        </div>
      </div>
    </div>
  );
}
