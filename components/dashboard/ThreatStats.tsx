"use client";

import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import type { ThreatSeverity } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ThreatStatsProps {
  total: number;
  severityCounts: Record<ThreatSeverity, number>;
  feedSuccess: number;
  feedTotal: number;
  watchlistCount?: number;
  savedCount?: number;
  loading?: boolean;
  className?: string;
}

export function ThreatStats({
  total,
  severityCounts,
  feedSuccess,
  feedTotal,
  watchlistCount = 0,
  savedCount = 0,
  loading,
  className,
}: ThreatStatsProps) {
  const cards = [
    {
      label: "Total Signals",
      value: total,
      color: "text-slate-100",
      accent: "from-slate-700/20 to-transparent",
    },
    {
      label: "Critical",
      value: severityCounts.critical,
      color: "text-red-400",
      accent: "from-red-950/30 to-transparent",
    },
    {
      label: "High",
      value: severityCounts.high,
      color: "text-orange-400",
      accent: "from-orange-950/25 to-transparent",
    },
    {
      label: "Feeds Online",
      value: feedSuccess,
      suffix: `/${feedTotal}`,
      color: "text-blue-400",
      accent: "from-blue-950/25 to-transparent",
    },
    {
      label: "Watchlist",
      value: watchlistCount,
      color: "text-violet-400",
      accent: "from-violet-950/25 to-transparent",
    },
    {
      label: "Saved",
      value: savedCount,
      color: "text-slate-300",
      accent: "from-slate-800/30 to-transparent",
    },
  ];

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6",
        className
      )}
    >
      {cards.map((card) => (
        <div
          key={card.label}
          className={cn(
            "soc-card relative overflow-hidden px-2.5 py-2",
            "bg-gradient-to-br",
            card.accent
          )}
        >
          <p className="truncate text-[10px] font-medium uppercase tracking-[0.06em] text-slate-500">
            {card.label}
          </p>
          <p
            className={cn(
              "mt-0.5 text-lg font-semibold tabular-nums leading-none",
              card.color
            )}
          >
            <AnimatedCounter value={card.value} enabled={!loading} />
            {card.suffix && (
              <span className="text-[10px] font-normal text-slate-500">{card.suffix}</span>
            )}
          </p>
        </div>
      ))}
    </div>
  );
}
