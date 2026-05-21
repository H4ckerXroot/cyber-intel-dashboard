import Parser from "rss-parser";
import { categorizeArticle } from "./categorize";
import { RSS_FEEDS } from "./feeds";
import { classifySeverity } from "./severity";
import type { FeedSource, ThreatArticle } from "./types";

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1200;

const parser = new Parser({
  timeout: 28000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (compatible; KanviCTIPortal/2.0; ThreatIntelAggregator)",
    Accept:
      "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
  },
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: true }],
      ["media:thumbnail", "mediaThumbnail", { keepArray: true }],
    ],
  },
});

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < retries) {
        await delay(RETRY_DELAY_MS * (attempt + 1));
      }
    }
  }

  throw lastError ?? new Error("Feed fetch failed");
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractImage(item: Parser.Item): string | undefined {
  if (item.enclosure?.url) {
    const type = item.enclosure.type ?? "";
    if (!type || type.startsWith("image")) return item.enclosure.url;
  }

  const mediaContent = (item as Record<string, unknown>)["mediaContent"] as
    | { $?: { url?: string } }[]
    | undefined;
  if (mediaContent?.[0]?.$?.url) return mediaContent[0].$.url;

  const mediaThumbnail = (item as Record<string, unknown>)["mediaThumbnail"] as
    | { $?: { url?: string } }[]
    | undefined;
  if (mediaThumbnail?.[0]?.$?.url) return mediaThumbnail[0].$.url;

  const itemExt = item as Parser.Item & { "content:encoded"?: string };
  const content =
    item.content || itemExt["content:encoded"] || item.summary || "";
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch?.[1]) return imgMatch[1];

  return undefined;
}

function toArticleId(link: string, title: string): string {
  const base = `${link}-${title}`;
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    hash = (hash << 5) - hash + base.charCodeAt(i);
    hash |= 0;
  }
  return `article-${Math.abs(hash).toString(36)}`;
}

function parseDate(item: Parser.Item): string {
  const raw = item.isoDate || item.pubDate;
  if (raw) {
    const d = new Date(raw);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  return new Date().toISOString();
}

function normalizeItem(
  item: Parser.Item,
  feed: FeedSource
): ThreatArticle | null {
  const title = item.title?.trim();
  const link = item.link?.trim() || item.guid?.trim();
  if (!title || !link) return null;

  const itemExt = item as Parser.Item & { "content:encoded"?: string };
  const rawSummary =
    item.contentSnippet ||
    stripHtml(
      item.content || itemExt["content:encoded"] || item.summary || ""
    );
  const summary = rawSummary.slice(0, 400);
  const publishedAt = parseDate(item);
  const category = categorizeArticle(title, summary, feed.name);
  const severity = classifySeverity(title, summary);
  const image = extractImage(item);

  return {
    id: toArticleId(link, title),
    title,
    link,
    summary,
    publishedAt,
    source: feed.name,
    feedUrl: feed.url,
    category,
    severity,
    ...(image ? { image } : {}),
  };
}

export async function fetchFeedArticles(
  feed: FeedSource
): Promise<{ articles: ThreatArticle[]; error?: string }> {
  try {
    const parsed = await withRetry(() => parser.parseURL(feed.url));
    const articles = (parsed.items || [])
      .map((item) => normalizeItem(item, feed))
      .filter((a): a is ThreatArticle => a !== null);

    return { articles };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown feed error";
    return { articles: [], error: message };
  }
}

export async function fetchAllFeeds(): Promise<{
  articles: ThreatArticle[];
  errors: { feed: string; message: string }[];
  feedSuccessCount: number;
  feedTotalCount: number;
}> {
  const results = await Promise.all(
    RSS_FEEDS.map((feed) =>
      fetchFeedArticles(feed).then((result) => ({ feed, ...result }))
    )
  );

  const errors: { feed: string; message: string }[] = [];
  const allArticles: ThreatArticle[] = [];
  let feedSuccessCount = 0;

  for (const result of results) {
    if (result.error) {
      errors.push({ feed: result.feed.name, message: result.error });
    } else {
      feedSuccessCount++;
    }
    allArticles.push(...result.articles);
  }

  const seen = new Set<string>();
  const unique = allArticles.filter((article) => {
    if (seen.has(article.id)) return false;
    seen.add(article.id);
    return true;
  });

  unique.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return {
    articles: unique,
    errors,
    feedSuccessCount: RSS_FEEDS.length - errors.length,
    feedTotalCount: RSS_FEEDS.length,
  };
}
