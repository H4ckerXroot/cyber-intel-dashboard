"use client";

import {
  computeThreatLevel,
  THREAT_LEVEL_META,
  type ThreatLevelStatus,
} from "@/lib/threatLevel";
import type { ThreatSeverity } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ThreatLevelWidgetProps {
  severityCounts: Record<ThreatSeverity, number>;
  className?: string;
}

export function ThreatLevelWidget({
  severityCounts,
  className,
}: ThreatLevelWidgetProps) {
  const level = computeThreatLevel(severityCounts);
  const meta = THREAT_LEVEL_META[level];

  return (
    <div className={cn("soc-card px-3 py-2.5", className)}>
      <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-500">
        Threat Level
      </p>

      <div className="mt-1.5 flex items-center gap-2">
        <span
          className={cn(
            "h-2 w-2 shrink-0 rounded-full ring-2 ring-offset-1 ring-offset-[#070f1a]",
            meta.dot,
            level === "critical" && "ring-red-500/30",
            level === "high" && "ring-orange-500/25",
            (level === "high" || level === "critical") && "animate-subtle-pulse"
          )}
          aria-hidden
        />
        <span className={cn("text-[15px] font-semibold leading-none", meta.color.split(" ")[0])}>
          {meta.label}
        </span>
      </div>

      <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-slate-500">
        {meta.description}
      </p>

      <div className="mt-2 flex gap-0.5 rounded-md border border-slate-800/80 bg-slate-950/40 p-0.5">
        {(Object.keys(THREAT_LEVEL_META) as ThreatLevelStatus[]).map((key) => {
          const active = key === level;
          return (
            <div
              key={key}
              className={cn(
                "flex-1 rounded px-0.5 py-1 text-center text-[7px] font-semibold uppercase tracking-wide",
                active
                  ? cn(THREAT_LEVEL_META[key].color, "shadow-sm")
                  : "text-slate-600"
              )}
            >
              {THREAT_LEVEL_META[key].label.slice(0, 4)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
