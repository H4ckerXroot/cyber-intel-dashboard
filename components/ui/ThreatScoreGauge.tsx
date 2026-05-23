import type { ThreatSeverity } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ThreatScoreGaugeProps {
  score: number;
  severity: ThreatSeverity;
  className?: string;
}

const SEVERITY_COLORS: Record<ThreatSeverity, string> = {
  critical: "text-red-400",
  high: "text-orange-400",
  medium: "text-amber-400",
  low: "text-slate-400",
};

const BAR_COLORS: Record<ThreatSeverity, string> = {
  critical: "bg-red-500/80",
  high: "bg-orange-500/75",
  medium: "bg-amber-500/70",
  low: "bg-slate-600",
};

export function ThreatScoreGauge({
  score,
  severity,
  className,
}: ThreatScoreGaugeProps) {
  const clamped = Math.min(100, Math.max(0, score));

  return (
    <div className={cn("rounded-md border border-slate-800/60 bg-slate-900/30 px-2.5 py-2", className)}>
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-500">
            Threat Score
          </p>
          <p className={cn("text-lg font-semibold tabular-nums leading-none", SEVERITY_COLORS[severity])}>
            {clamped}
            <span className="text-xs font-normal text-slate-600">/100</span>
          </p>
        </div>
        <span className="text-[10px] capitalize text-slate-500">{severity}</span>
      </div>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-800">
        <div
          className={cn("h-full rounded-full", BAR_COLORS[severity])}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
