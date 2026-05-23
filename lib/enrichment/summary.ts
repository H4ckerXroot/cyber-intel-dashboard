import type { IOC, ThreatTag } from "./types";
import type { ThreatCategory, ThreatSeverity } from "@/lib/types";

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
}

export function generateAnalystSummary(
  title: string,
  summary: string,
  severity: ThreatSeverity,
  tags: ThreatTag[],
  affectedTechnologies: string[],
  iocs: IOC[],
  category: ThreatCategory
): { aiSummary: string; impact: string } {
  const tagLabels = tags.map((t) => t.replace(/-/g, " "));
  const cves = iocs.filter((i) => i.type === "cve").map((i) => i.value);
  const primaryTag = tagLabels[0] ?? category.replace(/-/g, " ");

  const headline = truncate(title, 120);
  const context =
    summary.length > 60
      ? truncate(summary, 180)
      : "Limited RSS context available; review the full article for technical detail.";

  const threatType =
    tagLabels.length > 0
      ? tagLabels.slice(0, 3).join(", ")
      : category.replace(/-/g, " ");

  const techLine =
    affectedTechnologies.length > 0
      ? `Affected technologies/vendors: ${affectedTechnologies.join(", ")}.`
      : "No specific vendor or technology attribution detected from available text.";

  const cveLine =
    cves.length > 0
      ? `Referenced CVEs: ${cves.slice(0, 4).join(", ")}${cves.length > 4 ? " and others" : ""}.`
      : "";

  const aiSummary = [
    `Threat brief: ${headline}`,
    `Classification: ${capitalize(severity)} — ${threatType} activity reported. ${context}`,
    [techLine, cveLine].filter(Boolean).join(" "),
  ]
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  const impactBySeverity: Record<ThreatSeverity, string> = {
    critical:
      "Immediate operational risk — prioritize validation of exposure, containment, and executive notification.",
    high:
      "Elevated risk to the environment — accelerate patching, hunting, and defensive control updates.",
    medium:
      "Moderate risk — monitor for expansion, tune detections, and schedule remediation within standard change windows.",
    low:
      "Informational risk — track for situational awareness and correlate with existing intelligence.",
  };

  let impact = impactBySeverity[severity];

  if (tags.includes("ransomware")) {
    impact +=
      " Ransomware indicators suggest potential business disruption if endpoints or backups are impacted.";
  }
  if (tags.includes("zero-day")) {
    impact +=
      " Zero-day context may outpace patch availability — apply compensating controls immediately.";
  }
  if (tags.includes("supply-chain")) {
    impact +=
      " Supply chain exposure may affect multiple downstream systems beyond the initially reported target.";
  }

  return { aiSummary, impact };
}
