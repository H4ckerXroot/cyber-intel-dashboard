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
  low: "text-sky-400",
};

const BAR_COLORS: Record<ThreatSeverity, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-amber-500",
  low: "bg-sky-500",
};

export function ThreatScoreGauge({
  score,
  severity,
  className,
}: ThreatScoreGaugeProps) {
  const clamped = Math.min(100, Math.max(0, score));

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Threat Score
          </p>
          <p className={cn("text-2xl font-semibold tabular-nums", SEVERITY_COLORS[severity])}>
            {clamped}
            <span className="text-sm font-normal text-slate-500">/100</span>
          </p>
        </div>
        <span className="text-xs capitalize text-slate-400">{severity}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className={cn("h-full rounded-full transition-all", BAR_COLORS[severity])}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
