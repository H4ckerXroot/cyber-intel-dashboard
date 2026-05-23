import type { ThreatArticle } from "@/lib/types";

const MARKETING_PATTERNS = [
  /\bwebinar\b/i,
  /\bregister now\b/i,
  /\bjoin us\b/i,
  /\bwe(?:'re| are) hiring\b/i,
  /\bcareers?\b/i,
  /\bjob opening\b/i,
  /\bwhite\s*paper\b/i,
  /\bebook\b/i,
  /\bsponsored\b/i,
  /\bpress release\b/i,
  /\bproduct launch\b/i,
  /\brequest a demo\b/i,
  /\bschedule a demo\b/i,
  /\bnewsletter signup\b/i,
  /\bdownload our\b/i,
  /\bmarketing\b/i,
  /\bevent registration\b/i,
];

const CYBER_KEYWORDS = [
  "cve",
  "vulnerability",
  "exploit",
  "malware",
  "ransomware",
  "phishing",
  "threat",
  "attack",
  "breach",
  "apt",
  "zero-day",
  "0-day",
  "ioc",
  "backdoor",
  "botnet",
  "advisory",
  "patch",
  "trojan",
  "infostealer",
  "supply chain",
  "nation-state",
  "credential",
  "exfiltration",
  "c2",
  "command and control",
  "security",
  "cyber",
];

function isMarketingPost(title: string, summary: string): boolean {
  const text = `${title} ${summary}`;
  return MARKETING_PATTERNS.some((p) => p.test(text));
}

function hasCyberRelevance(title: string, summary: string): boolean {
  const text = `${title} ${summary}`.toLowerCase();
  return CYBER_KEYWORDS.some((kw) => text.includes(kw));
}

export function filterRelevantArticles(
  articles: ThreatArticle[],
  minReliability = 72
): { kept: ThreatArticle[]; marketingFiltered: number } {
  let marketingFiltered = 0;
  const kept: ThreatArticle[] = [];

  for (const article of articles) {
    if (isMarketingPost(article.title, article.summary)) {
      marketingFiltered++;
      continue;
    }

    const reliableEnough =
      (article.sourceReliability ?? 70) >= minReliability ||
      hasCyberRelevance(article.title, article.summary) ||
      article.severity === "critical" ||
      article.severity === "high" ||
      (article.iocs?.length ?? 0) > 0;

    if (!reliableEnough) {
      marketingFiltered++;
      continue;
    }

    kept.push(article);
  }

  return { kept, marketingFiltered };
}
