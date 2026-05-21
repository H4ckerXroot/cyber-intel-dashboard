export type ThreatCategory =
  | "latest-threat-news"
  | "cve-alerts"
  | "malware-analysis"
  | "ransomware-updates"
  | "threat-actors"
  | "government-advisories";

export type ThreatSeverity = "critical" | "high" | "medium" | "low";

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
  errors?: { feed: string; message: string }[];
}

export interface CategoryMeta {
  id: ThreatCategory;
  label: string;
  description: string;
  icon: string;
}
