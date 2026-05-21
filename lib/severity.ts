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
    className: "bg-red-500/20 text-red-300 border-red-500/40",
    dotClass: "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]",
  },
  high: {
    label: "High",
    className: "bg-orange-500/20 text-orange-300 border-orange-500/40",
    dotClass: "bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)]",
  },
  medium: {
    label: "Medium",
    className: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    dotClass: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]",
  },
  low: {
    label: "Low",
    className: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    dotClass: "bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.5)]",
  },
};
