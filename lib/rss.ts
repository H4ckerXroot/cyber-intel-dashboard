import Parser from "rss-parser";
import { categorizeArticle } from "./categorize";
import { filterFreshArticles } from "./freshness";
import { RSS_FEEDS } from "./feeds";
import { classifySeverity } from "./severity";
import type { FeedSource, ThreatArticle } from "./types";

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;
const FEED_TIMEOUT_MS = 14_000;
const FEED_CONCURRENCY = 4;

const parser = new Parser({
  timeout: FEED_TIMEOUT_MS,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (compatible; CTIDashboard/1.0; +https://github.com/cti-dashboard)",
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

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    delay(ms).then(() => {
      throw new Error(`Feed request timed out after ${ms}ms`);
    }),
  ]);
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
  try {
    if (item.enclosure?.url) {
      const type = item.enclosure.type ?? "";
      if (!type || type.startsWith("image")) return item.enclosure.url;
    }

    const mediaContent = (item as Record<string, unknown>)["mediaContent"] as
      | { $?: { url?: string } }[]
      | undefined;
    if (mediaContent?.[0]?.$?.url) return mediaContent[0].$.url;

    const mediaThumbnail = (item as Record<string, unknown>)[
      "mediaThumbnail"
    ] as { $?: { url?: string } }[] | undefined;
    if (mediaThumbnail?.[0]?.$?.url) return mediaThumbnail[0].$.url;

    const itemExt = item as Parser.Item & { "content:encoded"?: string };
    const content =
      item.content || itemExt["content:encoded"] || item.summary || "";
    const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch?.[1]) return imgMatch[1];
  } catch {
    /* ignore malformed media fields */
  }

  return undefined;
}

function normalizeLink(link: string): string {
  try {
    const u = new URL(link);
    u.hash = "";
    return u.href.replace(/\/$/, "");
  } catch {
    return link.trim();
  }
}

function toArticleId(link: string, title: string): string {
  const base = `${normalizeLink(link)}-${title}`;
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    hash = (hash << 5) - hash + base.charCodeAt(i);
    hash |= 0;
  }
  return `article-${Math.abs(hash).toString(36)}`;
}

function parsePublishedDate(item: Parser.Item): string | null {
  const raw = item.isoDate || item.pubDate;
  if (!raw) return null;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function normalizeItem(
  item: Parser.Item,
  feed: FeedSource
): ThreatArticle | null {
  try {
    const title = item.title?.trim();
    const link = item.link?.trim() || item.guid?.trim();
    if (!title || !link) return null;

    const publishedAt = parsePublishedDate(item);
    if (!publishedAt) return null;

    const itemExt = item as Parser.Item & { "content:encoded"?: string };
    const rawSummary =
      item.contentSnippet ||
      stripHtml(
        item.content || itemExt["content:encoded"] || item.summary || ""
      );
    const summary = rawSummary.slice(0, 400);
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
  } catch {
    return null;
  }
}

export async function fetchFeedArticles(
  feed: FeedSource
): Promise<{ articles: ThreatArticle[]; error?: string }> {
  try {
    const parsed = await withRetry(() =>
      withTimeout(parser.parseURL(feed.url), FEED_TIMEOUT_MS)
    );

    const articles: ThreatArticle[] = [];
    for (const item of parsed.items ?? []) {
      const article = normalizeItem(item, feed);
      if (article) articles.push(article);
    }

    return { articles };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown feed error";
    return { articles: [], error: message };
  }
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i]);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker())
  );
  return results;
}

function dedupeArticles(articles: ThreatArticle[]): ThreatArticle[] {
  const seenIds = new Set<string>();
  const seenLinks = new Set<string>();
  const unique: ThreatArticle[] = [];

  for (const article of articles) {
    const linkKey = normalizeLink(article.link);
    if (seenIds.has(article.id) || seenLinks.has(linkKey)) continue;
    seenIds.add(article.id);
    seenLinks.add(linkKey);
    unique.push(article);
  }

  return unique;
}

function sortByLatest(articles: ThreatArticle[]): ThreatArticle[] {
  return [...articles].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function fetchAllFeeds(): Promise<{
  articles: ThreatArticle[];
  errors: { feed: string; message: string }[];
  feedSuccessCount: number;
  feedTotalCount: number;
  filteredOutCount: number;
}> {
  const results = await mapWithConcurrency(
    RSS_FEEDS,
    FEED_CONCURRENCY,
    (feed) => fetchFeedArticles(feed).then((result) => ({ feed, ...result }))
  );

  const errors: { feed: string; message: string }[] = [];
  const allArticles: ThreatArticle[] = [];
  let feedSuccessCount = 0;

  for (const result of results) {
    if (result.error) {
      errors.push({ feed: result.feed.name, message: result.error });
    } else {
      feedSuccessCount++;
      allArticles.push(...result.articles);
    }
  }

  const deduped = dedupeArticles(allArticles);
  const fresh = filterFreshArticles(deduped);
  const filteredOutCount = deduped.length - fresh.length;
  const sorted = sortByLatest(fresh);

  return {
    articles: sorted,
    errors,
    feedSuccessCount,
    feedTotalCount: RSS_FEEDS.length,
    filteredOutCount,
  };
}
