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
            "rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors",
            active === sev
              ? "border-blue-600/50 bg-blue-600/12 text-blue-200"
              : "border-slate-700/50 bg-transparent text-slate-500 hover:border-slate-600 hover:text-slate-300"
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
