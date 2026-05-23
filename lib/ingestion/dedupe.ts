import type { ThreatArticle } from "@/lib/types";

export function normalizeLink(link: string): string {
  try {
    const u = new URL(link);
    u.hash = "";
    u.search = "";
    return u.href.replace(/\/$/, "").toLowerCase();
  } catch {
    return link.trim().toLowerCase();
  }
}

export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleTokens(title: string): Set<string> {
  const words = normalizeTitle(title).split(" ").filter((w) => w.length > 2);
  return new Set(words);
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const w of a) {
    if (b.has(w)) inter++;
  }
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

function contentHash(title: string, summary: string): string {
  const base = `${normalizeTitle(title)}|${summary.slice(0, 200).toLowerCase()}`;
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    hash = (hash << 5) - hash + base.charCodeAt(i);
    hash |= 0;
  }
  return `ch-${Math.abs(hash).toString(36)}`;
}

const TITLE_SIMILARITY_THRESHOLD = 0.82;

export function dedupeArticles(articles: ThreatArticle[]): ThreatArticle[] {
  const unique: ThreatArticle[] = [];
  const seenLinks = new Set<string>();
  const seenHashes = new Set<string>();
  const titleTokenList: Set<string>[] = [];

  const sorted = [...articles].sort((a, b) => {
    const scoreA = (a.threatScore ?? 0) + (a.severity === "critical" ? 50 : 0);
    const scoreB = (b.threatScore ?? 0) + (b.severity === "critical" ? 50 : 0);
    if (scoreB !== scoreA) return scoreB - scoreA;
    return (
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  });

  for (const article of sorted) {
    const linkKey = normalizeLink(article.link);
    const hash = contentHash(article.title, article.summary);

    if (seenLinks.has(linkKey) || seenHashes.has(hash)) continue;

    const tokens = titleTokens(article.title);
    let duplicate = false;
    for (const existing of titleTokenList) {
      if (jaccardSimilarity(tokens, existing) >= TITLE_SIMILARITY_THRESHOLD) {
        duplicate = true;
        break;
      }
    }
    if (duplicate) continue;

    seenLinks.add(linkKey);
    seenHashes.add(hash);
    titleTokenList.push(tokens);
    unique.push(article);
  }

  return unique;
}
