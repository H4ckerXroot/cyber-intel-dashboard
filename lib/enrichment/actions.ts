import type { IOC, ThreatTag } from "./types";
import type { ThreatCategory, ThreatSeverity } from "@/lib/types";

export function generateRecommendedActions(
  severity: ThreatSeverity,
  category: ThreatCategory,
  tags: ThreatTag[],
  iocs: IOC[]
): string[] {
  const actions: string[] = [];
  const hasCve = iocs.some((i) => i.type === "cve");
  const hasNetworkIoc = iocs.some(
    (i) => i.type === "ip" || i.type === "domain" || i.type === "url"
  );
  const hasHash = iocs.some((i) => i.type === "hash");

  if (severity === "critical" || tags.includes("zero-day")) {
    actions.push(
      "Escalate to incident response and validate exposure across internet-facing assets within 4 hours."
    );
    actions.push(
      "Enable enhanced monitoring for exploitation attempts and block known malicious indicators at perimeter controls."
    );
  }

  if (tags.includes("ransomware")) {
    actions.push(
      "Verify offline backups, restrict lateral movement paths, and review endpoint detection alerts for encryption activity."
    );
    actions.push(
      "Isolate affected hosts and preserve forensic artifacts before remediation."
    );
  }

  if (tags.includes("phishing")) {
    actions.push(
      "Search mail gateways and SIEM for matching sender domains, URLs, and attachment hashes."
    );
    actions.push(
      "Issue user awareness alert and reset credentials for users who interacted with suspicious content."
    );
  }

  if (hasCve || category === "cve-alerts") {
    actions.push(
      "Cross-reference listed CVEs against your asset inventory and prioritize patching based on exposure."
    );
    actions.push(
      "Apply vendor mitigations or virtual patches where fixes are not yet available."
    );
  }

  if (hasNetworkIoc || hasHash) {
    actions.push(
      "Block extracted network indicators and file hashes in firewall, proxy, and EDR policies."
    );
  }

  if (tags.includes("supply-chain")) {
    actions.push(
      "Review third-party software dependencies and verify integrity of update channels."
    );
  }

  if (tags.includes("cloud-attack")) {
    actions.push(
      "Audit cloud IAM roles, API keys, and storage bucket policies for unauthorized access."
    );
  }

  if (tags.includes("ai-threat")) {
    actions.push(
      "Review AI/LLM integrations for prompt injection risks and restrict untrusted model inputs."
    );
  }

  if (category === "government-advisories") {
    actions.push(
      "Align defensive controls with advisory guidance and document compliance actions for leadership review."
    );
  }

  if (severity === "high" && actions.length < 3) {
    actions.push(
      "Add this threat to the daily SOC briefing and track related IOC sightings for 72 hours."
    );
  }

  if (severity === "medium" || severity === "low") {
    if (actions.length === 0) {
      actions.push(
        "Monitor for related reporting and correlate with existing detection rules."
      );
    }
    actions.push(
      "Document findings in the threat intelligence tracker for trend analysis."
    );
  }

  return [...new Set(actions)].slice(0, 6);
}
