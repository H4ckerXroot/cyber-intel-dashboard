import type { ThreatSeverity } from "./types";

const CRITICAL_PATTERNS = [
  "critical",
  "zero-day",
  "0-day",
  "actively exploited",
  "emergency",
  "mass exploitation",
  "wormable",
  "nation-state attack",
  "supply chain attack",
];

const HIGH_PATTERNS = [
  "ransomware",
  "cve-",
  "data breach",
  "exploit",
  "apt ",
  "threat actor",
  "high severity",
  "remote code",
  "rce",
  "compromised",
  "stolen data",
];

const MEDIUM_PATTERNS = [
  "vulnerability",
  "malware",
  "phishing",
  "patch",
  "advisory",
  "campaign",
  "botnet",
  "backdoor",
];

export function classifySeverity(title: string, summary: string): ThreatSeverity {
  const text = `${title} ${summary}`.toLowerCase();

  if (CRITICAL_PATTERNS.some((p) => text.includes(p))) return "critical";
  if (HIGH_PATTERNS.some((p) => text.includes(p))) return "high";
  if (MEDIUM_PATTERNS.some((p) => text.includes(p))) return "medium";
  return "low";
}

export const SEVERITY_META: Record<
  ThreatSeverity,
  { label: string; className: string; dotClass: string }
> = {
  critical: {
    label: "Critical",
    className: "bg-red-950/50 text-red-300/95 border-red-900/50",
    dotClass: "bg-red-400",
  },
  high: {
    label: "High",
    className: "bg-orange-950/40 text-orange-300/95 border-orange-900/45",
    dotClass: "bg-orange-400",
  },
  medium: {
    label: "Medium",
    className: "bg-amber-950/35 text-amber-300/95 border-amber-900/40",
    dotClass: "bg-amber-400",
  },
  low: {
    label: "Low",
    className: "bg-slate-800/60 text-slate-400 border-slate-700/50",
    dotClass: "bg-slate-500",
  },
};
