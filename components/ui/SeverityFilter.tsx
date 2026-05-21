"use client";

import { SEVERITY_META } from "@/lib/severity";
import type { ThreatSeverity } from "@/lib/types";
import { cn } from "@/lib/utils";

export type SeverityFilterValue = ThreatSeverity | "all";

interface SeverityFilterProps {
  active: SeverityFilterValue;
  onChange: (value: SeverityFilterValue) => void;
  counts?: Record<ThreatSeverity, number>;
  className?: string;
}

const ORDER: SeverityFilterValue[] = [
  "all",
  "critical",
  "high",
  "medium",
  "low",
];

export function SeverityFilter({
  active,
  onChange,
  counts,
  className,
}: SeverityFilterProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)} role="group" aria-label="Filter by severity">
      {ORDER.map((sev) => (
        <button
          key={sev}
          type="button"
          onClick={() => onChange(sev)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200",
            active === sev
              ? "border-blue-500/60 bg-blue-500/20 text-blue-200 shadow-[0_0_14px_rgba(59,130,246,0.25)]"
              : "border-slate-700/60 bg-slate-900/40 text-slate-400 hover:border-blue-500/30 hover:text-blue-300"
          )}
        >
          {sev === "all" ? "All Severity" : SEVERITY_META[sev].label}
          {sev !== "all" && counts?.[sev] !== undefined && counts[sev] > 0 && (
            <span className="ml-1.5 text-[10px] opacity-70">({counts[sev]})</span>
          )}
        </button>
      ))}
    </div>
  );
}
