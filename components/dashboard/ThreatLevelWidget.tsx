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
      <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-500">
        Threat Level
      </p>

      <div className="mt-1.5 flex items-center gap-2">
        <span
          className={cn(
            "h-2 w-2 shrink-0 rounded-full",
            meta.dot,
            (level === "high" || level === "critical") && "animate-subtle-pulse"
          )}
          aria-hidden
        />
        <span className={cn("text-base font-semibold leading-none", meta.color.split(" ")[0])}>
          {meta.label}
        </span>
      </div>

      <p className="mt-1 text-[10px] leading-snug text-slate-500">{meta.description}</p>

      <div className="mt-2 grid grid-cols-4 gap-1 border-t border-slate-800/70 pt-2">
        {(Object.keys(THREAT_LEVEL_META) as ThreatLevelStatus[]).map((key) => {
          const active = key === level;
          return (
            <div
              key={key}
              className={cn(
                "rounded px-1 py-0.5 text-center text-[8px] font-medium uppercase tracking-wide",
                active ? THREAT_LEVEL_META[key].color : "text-slate-600"
              )}
            >
              {THREAT_LEVEL_META[key].label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
