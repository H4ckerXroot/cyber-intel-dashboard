import type { ThreatSeverity } from "./types";

export type ThreatLevelStatus = "guarded" | "elevated" | "high" | "critical";

export const THREAT_LEVEL_META: Record<
  ThreatLevelStatus,
  { label: string; description: string; color: string; dot: string }
> = {
  guarded: {
    label: "Guarded",
    description: "Baseline monitoring — no elevated activity",
    color: "text-slate-400 border-slate-600/40 bg-slate-800/40",
    dot: "bg-slate-500",
  },
  elevated: {
    label: "Elevated",
    description: "Increased threat activity detected",
    color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    dot: "bg-amber-400",
  },
  high: {
    label: "High",
    description: "Significant threats require attention",
    color: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    dot: "bg-orange-400",
  },
  critical: {
    label: "Critical",
    description: "Severe threats — immediate analyst review",
    color: "text-red-400 border-red-500/30 bg-red-500/10",
    dot: "bg-red-400",
  },
};

export function computeThreatLevel(
  severityCounts: Record<ThreatSeverity, number>
): ThreatLevelStatus {
  const { critical, high, medium } = severityCounts;

  if (critical >= 5) return "critical";
  if (critical >= 2 || high >= 15) return "high";
  if (high >= 8 || critical >= 1 || medium >= 25) return "elevated";
  return "guarded";
}
