"use client";

import type { ThreatSeverity } from "@/lib/types";
import { cn } from "@/lib/utils";

interface IntelWidgetsProps {
  severityCounts?: Record<ThreatSeverity, number>;
  totalArticles?: number;
  className?: string;
}

const SEVERITY_ORDER: ThreatSeverity[] = [
  "critical",
  "high",
  "medium",
  "low",
];

const SEVERITY_BAR: Record<ThreatSeverity, string> = {
  critical: "bg-red-500/70",
  high: "bg-orange-500/65",
  medium: "bg-amber-500/55",
  low: "bg-slate-600/70",
};

const SEVERITY_LABEL: Record<ThreatSeverity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export function IntelWidgets({
  severityCounts,
  totalArticles = 0,
  className,
}: IntelWidgetsProps) {
  const counts = severityCounts ?? {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };
  const maxCount = Math.max(...SEVERITY_ORDER.map((s) => counts[s]), 1);
  const total = totalArticles || Object.values(counts).reduce((a, b) => a + b, 0);

  const distribution = SEVERITY_ORDER.map((sev) => ({
    sev,
    count: counts[sev],
    pct: total > 0 ? Math.round((counts[sev] / total) * 100) : 0,
    height: Math.max(8, Math.round((counts[sev] / maxCount) * 100)),
  }));

  return (
    <div className={cn("grid gap-2 lg:grid-cols-2", className)}>
      <div className="soc-card px-3 py-2.5">
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <div>
            <h3 className="section-heading">Severity Distribution</h3>
            <p className="section-subheading">Current feed breakdown</p>
          </div>
          <span className="text-[10px] tabular-nums text-slate-500">{total} total</span>
        </div>
        <div className="flex h-24 items-end gap-2 border-b border-slate-800/60 pb-1">
          {distribution.map(({ sev, count, height }) => (
            <div key={sev} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[9px] tabular-nums text-slate-500">{count}</span>
              <div
                className={cn("w-full max-w-[2.5rem] rounded-sm", SEVERITY_BAR[sev])}
                style={{ height: `${height}%` }}
              />
              <span className="text-[8px] font-medium uppercase text-slate-600">
                {SEVERITY_LABEL[sev].slice(0, 4)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="soc-card px-3 py-2.5">
        <div className="mb-2">
          <h3 className="section-heading">Exposure Mix</h3>
          <p className="section-subheading">Share by severity tier</p>
        </div>
        <div className="space-y-2">
          {distribution.map(({ sev, count, pct }) => (
            <div key={sev} className="flex items-center gap-2">
              <span className="w-14 shrink-0 text-[10px] text-slate-500">
                {SEVERITY_LABEL[sev]}
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                <div
                  className={cn("h-full rounded-full", SEVERITY_BAR[sev])}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right text-[10px] tabular-nums text-slate-500">
                {pct}%
              </span>
              <span className="w-6 shrink-0 text-right text-[10px] tabular-nums text-slate-600">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
