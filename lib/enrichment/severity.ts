import type { ThreatSeverity } from "@/lib/types";
import type { IOC, ThreatTag } from "./types";

interface SeverityResult {
  severity: ThreatSeverity;
  reason: string;
  score: number;
}

const CRITICAL_SIGNALS = [
  { pattern: "zero-day", reason: "Zero-day exploitation indicators detected" },
  { pattern: "0-day", reason: "Zero-day exploitation indicators detected" },
  { pattern: "actively exploited", reason: "Active exploitation reported in the wild" },
  { pattern: "mass exploitation", reason: "Widespread active exploitation" },
  { pattern: "wormable", reason: "Wormable vulnerability characteristics" },
  { pattern: "nation-state", reason: "Nation-state threat activity referenced" },
  { pattern: "state-sponsored", reason: "State-sponsored threat activity referenced" },
  { pattern: "emergency directive", reason: "Emergency government directive context" },
  { pattern: "supply chain attack", reason: "Supply chain compromise indicators" },
];

const HIGH_SIGNALS = [
  { pattern: "ransomware", reason: "Ransomware-related threat activity" },
  { pattern: "cve-", reason: "Published CVE vulnerability disclosure" },
  { pattern: "data breach", reason: "Confirmed or reported data breach" },
  { pattern: "remote code execution", reason: "Remote code execution risk" },
  { pattern: " rce", reason: "Remote code execution risk" },
  { pattern: "apt ", reason: "Advanced persistent threat actor involvement" },
  { pattern: "threat actor", reason: "Attributed threat actor activity" },
  { pattern: "compromised", reason: "Active compromise indicators" },
  { pattern: "stolen data", reason: "Data theft or exfiltration reported" },
];

const MEDIUM_SIGNALS = [
  { pattern: "vulnerability", reason: "General vulnerability disclosure" },
  { pattern: "malware", reason: "Malware campaign or sample activity" },
  { pattern: "phishing", reason: "Phishing or social engineering activity" },
  { pattern: "advisory", reason: "Security advisory or alert context" },
  { pattern: "campaign", reason: "Ongoing threat campaign activity" },
  { pattern: "botnet", reason: "Botnet or crimeware infrastructure activity" },
];

function scoreFromSeverity(severity: ThreatSeverity): number {
  switch (severity) {
    case "critical":
      return 92;
    case "high":
      return 74;
    case "medium":
      return 48;
    case "low":
      return 22;
  }
}

export function analyzeThreatLevel(
  title: string,
  summary: string,
  tags: ThreatTag[],
  iocs: IOC[]
): SeverityResult {
  const text = `${title} ${summary}`.toLowerCase();
  let severity: ThreatSeverity = "low";
  let reason = "Routine threat intelligence reporting with limited immediate operational impact.";

  for (const signal of CRITICAL_SIGNALS) {
    if (text.includes(signal.pattern)) {
      severity = "critical";
      reason = signal.reason;
      break;
    }
  }

  if (severity !== "critical") {
    for (const signal of HIGH_SIGNALS) {
      if (text.includes(signal.pattern)) {
        severity = "high";
        reason = signal.reason;
        break;
      }
    }
  }

  if (severity === "low") {
    for (const signal of MEDIUM_SIGNALS) {
      if (text.includes(signal.pattern)) {
        severity = "medium";
        reason = signal.reason;
        break;
      }
    }
  }

  if (tags.includes("zero-day") && severity !== "critical") {
    severity = "critical";
    reason = "Zero-day threat tag elevated severity classification";
  }

  if (tags.includes("ransomware") && severity === "low") {
    severity = "high";
    reason = "Ransomware threat tag elevated severity classification";
  }

  const cveCount = iocs.filter((i) => i.type === "cve").length;
  let score = scoreFromSeverity(severity);
  score += Math.min(cveCount * 4, 12);
  score += Math.min(iocs.length, 8);
  if (tags.includes("supply-chain")) score += 6;
  if (tags.includes("ransomware")) score += 5;
  score = Math.min(100, Math.max(10, score));

  if (cveCount >= 2 && severity === "medium") {
    severity = "high";
    reason = "Multiple CVEs referenced in reporting";
  }

  return { severity, reason, score };
}
