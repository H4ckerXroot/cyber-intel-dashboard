export type ThreatCategory =
  | "latest-threat-news"
  | "cve-alerts"
  | "malware-analysis"
  | "ransomware-updates"
  | "threat-actors"
  | "government-advisories";

export type ThreatSeverity = "critical" | "high" | "medium" | "low";

export type IOCType = "cve" | "ip" | "domain" | "hash" | "url";

export interface IOC {
  type: IOCType;
  value: string;
}

export type ThreatTag =
  | "ransomware"
  | "phishing"
  | "malware"
  | "zero-day"
  | "cloud-attack"
  | "ai-threat"
  | "supply-chain"
  | "insider-threat";

export interface MitreTechnique {
  id: string;
  name: string;
  tactic: string;
}

export interface ThreatArticle {
  id: string;
  title: string;
  link: string;
  summary: string;
  publishedAt: string;
  source: string;
  feedUrl: string;
  category: ThreatCategory;
  severity: ThreatSeverity;
  image?: string;
  aiSummary?: string;
  impact?: string;
  affectedTechnologies?: string[];
  threatScore?: number;
  severityReason?: string;
  iocs?: IOC[];
  tags?: ThreatTag[];
  mitreTechniques?: MitreTechnique[];
  recommendedActions?: string[];
}

export interface FeedSource {
  name: string;
  url: string;
}

export interface FeedsApiResponse {
  articles: ThreatArticle[];
  fetchedAt: string;
  totalCount: number;
  feedSuccessCount?: number;
  feedTotalCount?: number;
  maxAgeHours?: number;
  filteredOutCount?: number;
  errors?: { feed: string; message: string }[];
}

export interface CategoryMeta {
  id: ThreatCategory;
  label: string;
  description: string;
  icon: string;
}
