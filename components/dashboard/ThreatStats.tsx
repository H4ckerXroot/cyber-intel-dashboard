"use client";

import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import type { ThreatSeverity } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ThreatStatsProps {
  total: number;
  severityCounts: Record<ThreatSeverity, number>;
  feedSuccess: number;
  feedTotal: number;
  loading?: boolean;
  className?: string;
}

export function ThreatStats({
  total,
  severityCounts,
  feedSuccess,
  feedTotal,
  loading,
  className,
}: ThreatStatsProps) {
  const cards = [
    {
      label: "Total Signals",
      value: total,
      color: "text-slate-100",
      sub: "last 48h",
    },
    {
      label: "Critical",
      value: severityCounts.critical,
      color: "text-red-400",
      sub: "severity",
    },
    {
      label: "High",
      value: severityCounts.high,
      color: "text-orange-400",
      sub: "severity",
    },
    {
      label: "Feeds Online",
      value: feedSuccess,
      suffix: `/${feedTotal}`,
      color: "text-blue-400",
      sub: "sources",
    },
  ];

  return (
    <div className={cn("grid grid-cols-2 gap-2 lg:grid-cols-4", className)}>
      {cards.map((card) => (
        <div
          key={card.label}
          className="soc-card flex min-h-[4.25rem] flex-col justify-center px-3 py-2"
        >
          <p className="text-[9px] font-medium uppercase tracking-[0.08em] text-slate-500">
            {card.label}
          </p>
          <p
            className={cn(
              "mt-0.5 text-base font-semibold tabular-nums leading-none sm:text-lg",
              card.color
            )}
          >
            <AnimatedCounter value={card.value} enabled={!loading} />
            {card.suffix && (
              <span className="text-xs font-normal text-slate-500">{card.suffix}</span>
            )}
          </p>
          <p className="mt-1 text-[9px] text-slate-600">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
