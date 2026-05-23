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
  sourceReliability?: number;
  ingestMethod?: FeedIngestMethod;
}

export interface FeedSource {
  name: string;
  url: string;
}

export type FeedIngestMethod = "rss" | "atom" | "discovered" | "scrape" | "none";

export type FeedHealthStatus =
  | "online"
  | "degraded"
  | "failed"
  | "timeout"
  | "blocked"
  | "invalid"
  | "unsupported"
  | "parsing_failed";

export interface CTISource {
  name: string;
  siteUrl: string;
  /** Required — RSS/Atom endpoint only (no HTML discovery). */
  feedUrl: string;
  reliability: number;
}

export interface FeedHealthRecord {
  name: string;
  status: FeedHealthStatus;
  method: FeedIngestMethod;
  articleCount: number;
  reliability: number;
  sourceUrl?: string;
  resolvedUrl?: string;
  responseType?: string;
  lastSync?: string;
  errorReason?: string;
  message?: string;
  durationMs?: number;
}

export interface FeedHealthSummary {
  online: number;
  degraded: number;
  failed: number;
  timeout: number;
  blocked: number;
  invalid: number;
  unsupported: number;
  parsing_failed: number;
  total: number;
}

export interface FeedsApiResponse {
  articles: ThreatArticle[];
  fetchedAt: string;
  syncedAt?: string;
  totalCount: number;
  feedSuccessCount?: number;
  feedTotalCount?: number;
  maxAgeHours?: number;
  filteredOutCount?: number;
  marketingFiltered?: number;
  duplicateFiltered?: number;
  feedHealth?: FeedHealthRecord[];
  healthSummary?: FeedHealthSummary;
  errors?: { feed: string; message: string }[];
}

export interface CategoryMeta {
  id: ThreatCategory;
  label: string;
  description: string;
  icon: string;
}
