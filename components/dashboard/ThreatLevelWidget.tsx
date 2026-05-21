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
    <div className={cn("glass-card rounded-lg p-4", className)}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        Threat Level
      </p>

      <div className="mt-2 flex items-center gap-2.5">
        <span
          className={cn(
            "h-2.5 w-2.5 rounded-full",
            meta.dot,
            (level === "high" || level === "critical") && "animate-subtle-pulse"
          )}
          aria-hidden
        />
        <span className={cn("text-lg font-semibold", meta.color.split(" ")[0])}>
          {meta.label}
        </span>
      </div>

      <p className="mt-1.5 text-[11px] leading-snug text-slate-500">
        {meta.description}
      </p>

      <div className="mt-3 grid grid-cols-4 gap-1.5 border-t border-slate-800/80 pt-3">
        {(Object.keys(THREAT_LEVEL_META) as ThreatLevelStatus[]).map((key) => {
          const active = key === level;
          return (
            <div
              key={key}
              className={cn(
                "rounded px-1.5 py-1 text-center text-[9px] font-medium",
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
