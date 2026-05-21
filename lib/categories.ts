import type { CategoryMeta, ThreatCategory } from "./types";

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "latest-threat-news",
    label: "Latest Threat News",
    description: "Breaking cybersecurity news and industry updates",
    icon: "📡",
  },
  {
    id: "cve-alerts",
    label: "CVE Alerts",
    description: "Vulnerability disclosures and patch advisories",
    icon: "🔓",
  },
  {
    id: "malware-analysis",
    label: "Malware Analysis",
    description: "Malware campaigns, IOCs, and threat research",
    icon: "🦠",
  },
  {
    id: "ransomware-updates",
    label: "Ransomware Updates",
    description: "Ransomware groups, incidents, and extortion news",
    icon: "🔐",
  },
  {
    id: "threat-actors",
    label: "Threat Actors",
    description: "APT groups, cybercrime operations, and campaigns",
    icon: "👤",
  },
  {
    id: "government-advisories",
    label: "Government Advisories",
    description: "CISA and government cybersecurity alerts",
    icon: "🏛️",
  },
];

export const ALL_CATEGORY_ID = "all" as const;

export type FilterValue = typeof ALL_CATEGORY_ID | ThreatCategory;

export function getCategoryMeta(id: ThreatCategory): CategoryMeta {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}
