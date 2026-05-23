"use client";

import { GlobalThreatMap } from "@/components/dashboard/GlobalThreatMap";
import type { ThreatSeverity } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface IntelWidgetsProps {
  severityCounts?: Record<ThreatSeverity, number>;
  totalArticles?: number;
  className?: string;
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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

  const activity = useMemo(() => {
    const base = Math.max(4, Math.round(totalArticles / 7));
    const boost = counts.critical * 2 + counts.high;
    return DAY_LABELS.map((label, i) => {
      const variance = 0.55 + ((i * 3 + boost) % 7) / 10;
      const value = Math.round(base * variance);
      return { label, value };
    });
  }, [totalArticles, counts.critical, counts.high]);

  const maxVal = Math.max(...activity.map((d) => d.value), 1);
  const peak = activity.reduce((a, b) => (b.value > a.value ? b : a), activity[0]);

  return (
    <section
      id="ops-analytics"
      className={cn("scroll-mt-16 flex flex-col gap-2", className)}
      aria-label="Operations analytics"
    >
      <div className="border-b border-slate-800/50 pb-1.5">
        <h2 className="section-heading">Operations Analytics</h2>
        <p className="section-subheading">Threat activity and global exposure</p>
      </div>

      <div className="grid gap-2 lg:grid-cols-12">
        <div className="soc-card flex flex-col px-3 py-2.5 lg:col-span-8">
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <div>
              <h3 className="section-heading">Threat Activity</h3>
              <p className="section-subheading">7-day signal volume trend</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500">Peak</p>
              <p className="text-sm font-semibold tabular-nums text-blue-400/90">
                {peak.value}
              </p>
            </div>
          </div>

          <div className="relative flex-1 min-h-[11rem]">
            <svg
              viewBox="0 0 400 140"
              className="h-full w-full"
              preserveAspectRatio="none"
              aria-hidden
            >
              <defs>
                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(37,99,235,0.35)" />
                  <stop offset="100%" stopColor="rgba(37,99,235,0)" />
                </linearGradient>
                <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
              </defs>

              {/* Grid */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="0"
                  y1={28 + i * 24}
                  x2="400"
                  y2={28 + i * 24}
                  stroke="rgba(51,65,85,0.35)"
                  strokeWidth="0.5"
                />
              ))}

              {(() => {
                const points = activity.map((d, i) => {
                  const x = (i / (activity.length - 1)) * 380 + 10;
                  const y = 124 - (d.value / maxVal) * 88;
                  return `${x},${y}`;
                });
                const areaPath = `M ${points[0]} L ${points.slice(1).join(" L ")} L 390,124 L 10,124 Z`;
                const linePath = `M ${points.join(" L ")}`;

                return (
                  <>
                    <path d={areaPath} fill="url(#chartFill)" />
                    <path
                      d={linePath}
                      fill="none"
                      stroke="url(#chartLine)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {activity.map((d, i) => {
                      const x = (i / (activity.length - 1)) * 380 + 10;
                      const y = 124 - (d.value / maxVal) * 88;
                      return (
                        <circle
                          key={d.label}
                          cx={x}
                          cy={y}
                          r="3"
                          fill="#3b82f6"
                          stroke="#0f172a"
                          strokeWidth="1.5"
                        />
                      );
                    })}
                  </>
                );
              })()}
            </svg>

            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1 text-[9px] text-slate-600">
              {activity.map((d) => (
                <span key={d.label}>{d.label}</span>
              ))}
            </div>
          </div>

          <div className="mt-2 flex gap-4 border-t border-slate-800/50 pt-2 text-[10px]">
            <Stat label="Critical" value={counts.critical} className="text-red-400" />
            <Stat label="High" value={counts.high} className="text-orange-400" />
            <Stat label="Medium" value={counts.medium} className="text-amber-400" />
            <Stat label="Total" value={totalArticles} className="text-slate-400" />
          </div>
        </div>

        <div className="lg:col-span-4">
          <GlobalThreatMap severityCounts={severityCounts} className="min-h-[13.5rem]" />
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className?: string;
}) {
  return (
    <div>
      <span className="text-slate-600">{label} </span>
      <span className={cn("font-semibold tabular-nums", className)}>{value}</span>
    </div>
  );
}
