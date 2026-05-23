import type { ThreatArticle, ThreatTag } from "@/lib/types";

const BOOST_TAGS: ThreatTag[] = [
  "ransomware",
  "zero-day",
  "supply-chain",
  "malware",
];

const BOOST_KEYWORDS = [
  "actively exploited",
  "zero-day",
  "0-day",
  "nation-state",
  "state-sponsored",
  "mass exploitation",
  "credential theft",
  "supply chain",
  "wormable",
  "emergency",
];

const LOW_PRIORITY_PATTERNS = [
  /\btop \d+ tips\b/i,
  /\bbest practices\b/i,
  /\bawareness month\b/i,
  /\bhow to stay safe\b/i,
  /\bpassword hygiene\b/i,
  /\bcybersecurity 101\b/i,
];

export function computeOperationalScore(article: ThreatArticle): number {
  let score = article.threatScore ?? 20;

  if (article.severity === "critical") score += 40;
  else if (article.severity === "high") score += 28;
  else if (article.severity === "medium") score += 12;

  const tags = article.tags ?? [];
  for (const tag of BOOST_TAGS) {
    if (tags.includes(tag)) score += 15;
  }

  const text = `${article.title} ${article.summary}`.toLowerCase();
  for (const kw of BOOST_KEYWORDS) {
    if (text.includes(kw)) score += 8;
  }

  score += Math.min((article.iocs?.length ?? 0) * 3, 15);
  score += Math.min((article.sourceReliability ?? 70) / 10, 10);

  if (LOW_PRIORITY_PATTERNS.some((p) => p.test(text))) score -= 20;

  return Math.max(0, Math.min(100, score));
}

export function prioritizeArticles(articles: ThreatArticle[]): ThreatArticle[] {
  return [...articles].sort((a, b) => {
    const scoreA = computeOperationalScore(a);
    const scoreB = computeOperationalScore(b);
    if (scoreB !== scoreA) return scoreB - scoreA;

    return (
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  });
}
