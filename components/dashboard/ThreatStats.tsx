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
    { label: "Signals", value: total, color: "text-slate-100" },
    { label: "Critical", value: severityCounts.critical, color: "text-red-400" },
    { label: "High", value: severityCounts.high, color: "text-orange-400" },
    {
      label: "Feeds",
      value: feedSuccess,
      suffix: `/${feedTotal}`,
      color: "text-blue-400",
    },
  ];

  return (
    <div
      className={cn("grid grid-cols-2 gap-2 sm:grid-cols-4", className)}
    >
      {cards.map((card) => (
        <div key={card.label} className="glass-card rounded-lg px-3 py-2.5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            {card.label}
          </p>
          <p className={cn("mt-0.5 text-lg font-semibold tabular-nums", card.color)}>
            <AnimatedCounter value={card.value} enabled={!loading} />
            {card.suffix && (
              <span className="text-xs font-normal text-slate-500">{card.suffix}</span>
            )}
          </p>
        </div>
      ))}
    </div>
  );
}
