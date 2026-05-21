"use client";

import { BRAND } from "@/lib/brand";
import { LiveBadge } from "@/components/ui/LiveBadge";
import { TypingText } from "@/components/ui/TypingText";
import { formatRelativeTime } from "@/lib/utils";

interface WelcomeSectionProps {
  fetchedAt?: string;
  loading?: boolean;
  articleCount: number;
}

export function WelcomeSection({
  fetchedAt,
  loading,
  articleCount,
}: WelcomeSectionProps) {
  return (
    <div className="relative h-full overflow-hidden rounded-lg border border-slate-800/80 bg-slate-900/60">
      <div className="hero-glow" />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative px-4 py-5 sm:px-5 sm:py-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <LiveBadge />
            <span className="text-xs text-slate-500">
              {loading
                ? "Syncing feeds…"
                : `Last sync · ${fetchedAt ? formatRelativeTime(fetchedAt) : "—"}`}
            </span>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-blue-400/80">
              {BRAND.name}
            </p>
            <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
              {BRAND.greeting}
            </h1>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">{BRAND.subtitle}</p>
          </div>

          <TypingText
            text="Monitoring live threat intelligence feeds..."
            className="min-h-[18px]"
          />

          <p className="text-xs text-slate-500">
            <span className="font-medium text-slate-300">
              {loading ? "—" : articleCount.toLocaleString()}
            </span>{" "}
            signals · {BRAND.feedCount} sources
          </p>
        </div>
      </div>
    </div>
  );
}
