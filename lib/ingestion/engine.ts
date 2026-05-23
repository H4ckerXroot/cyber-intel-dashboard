import { CTI_SOURCES } from "@/lib/feeds/sources";
import { filterFreshArticles, MAX_ARTICLE_AGE_HOURS } from "@/lib/freshness";
import type {
  CTISource,
  FeedHealthRecord,
  FeedHealthSummary,
  FeedIngestMethod,
  ThreatArticle,
} from "@/lib/types";
import { buildCandidateUrls, discoverFeedUrl } from "./discover";
import { dedupeArticles } from "./dedupe";
import { filterRelevantArticles } from "./filter";
import { fetchText } from "./http";
import { parseFeedUrl, scrapedToArticles } from "./parse";
import { prioritizeArticles } from "./prioritize";
import { scrapeBlogFallback } from "./scrape";
import { detectFeedType } from "./validate";

const FEED_TIMEOUT_MS = 9_000;
const DISCOVERY_TIMEOUT_MS = 6_000;
const SCRAPE_TIMEOUT_MS = 8_000;
const BATCH_SIZE = 12;
const CACHE_TTL_MS = 3 * 60 * 1000;

interface IngestResult {
  health: FeedHealthRecord;
  articles: ThreatArticle[];
}

interface CacheEntry {
  expires: number;
  payload: Awaited<ReturnType<typeof runIngestion>>;
}

let ingestCache: CacheEntry | null = null;

function isTimeoutError(message: string): boolean {
  return /abort|timeout|timed out/i.test(message);
}

async function tryParseFeed(
  url: string,
  source: CTISource,
  method: FeedIngestMethod
): Promise<{ articles: ThreatArticle[]; method: FeedIngestMethod } | null> {
  const text = await fetchText(url, FEED_TIMEOUT_MS);
  if (!text) return null;

  const detected = detectFeedType(text);
  if (!detected) return null;

  const finalMethod: FeedIngestMethod =
    detected === "atom"
      ? "atom"
      : method === "discovered"
        ? "discovered"
        : "rss";

  const articles = await parseFeedUrl(url, source, finalMethod);
  if (articles.length === 0) return null;

  return { articles, method: finalMethod };
}

async function ingestSource(source: CTISource): Promise<IngestResult> {
  const start = Date.now();
  const candidates = buildCandidateUrls(source.siteUrl, source.feedUrl);

  for (const url of candidates) {
    try {
      const result = await tryParseFeed(
        url,
        source,
        source.feedUrl === url ? "rss" : "discovered"
      );
      if (result) {
        return {
          articles: result.articles,
          health: {
            name: source.name,
            status: "online",
            method: result.method,
            articleCount: result.articles.length,
            reliability: source.reliability,
            resolvedUrl: url,
            durationMs: Date.now() - start,
          },
        };
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (isTimeoutError(msg)) {
        return {
          articles: [],
          health: {
            name: source.name,
            status: "timeout",
            method: "none",
            articleCount: 0,
            reliability: source.reliability,
            message: msg,
            durationMs: Date.now() - start,
          },
        };
      }
    }
  }

  try {
    const discovered = await discoverFeedUrl(source.siteUrl, DISCOVERY_TIMEOUT_MS);
    if (discovered) {
      const result = await tryParseFeed(
        discovered.url,
        source,
        discovered.type === "atom" ? "atom" : "discovered"
      );
      if (result) {
        return {
          articles: result.articles,
          health: {
            name: source.name,
            status: "online",
            method: result.method,
            articleCount: result.articles.length,
            reliability: source.reliability,
            resolvedUrl: discovered.url,
            durationMs: Date.now() - start,
            message: "Auto-discovered feed",
          },
        };
      }
    }
  } catch {
    /* discovery failed */
  }

  try {
    const scraped = await scrapeBlogFallback(source, SCRAPE_TIMEOUT_MS);
    const withDates = scraped.filter((s) => s.publishedAt);
    if (withDates.length > 0) {
      const articles = scrapedToArticles(withDates, source, source.siteUrl);
      if (articles.length > 0) {
        return {
          articles,
          health: {
            name: source.name,
            status: "degraded",
            method: "scrape",
            articleCount: articles.length,
            reliability: source.reliability,
            resolvedUrl: source.siteUrl,
            durationMs: Date.now() - start,
            message: "HTML fallback extraction",
          },
        };
      }
    }
  } catch {
    /* scrape failed */
  }

  return {
    articles: [],
    health: {
      name: source.name,
      status: "failed",
      method: "none",
      articleCount: 0,
      reliability: source.reliability,
      message: "No RSS/Atom feed or fallback content",
      durationMs: Date.now() - start,
    },
  };
}

function summarizeHealth(records: FeedHealthRecord[]): FeedHealthSummary {
  const summary: FeedHealthSummary = {
    online: 0,
    degraded: 0,
    failed: 0,
    timeout: 0,
    unsupported: 0,
    total: records.length,
  };

  for (const r of records) {
    if (r.status === "online") summary.online++;
    else if (r.status === "degraded") summary.degraded++;
    else if (r.status === "timeout") summary.timeout++;
    else if (r.status === "unsupported") summary.unsupported++;
    else summary.failed++;
  }

  return summary;
}

async function runIngestion() {
  const allArticles: ThreatArticle[] = [];
  const healthRecords: FeedHealthRecord[] = [];
  const errors: { feed: string; message: string }[] = [];

  for (let i = 0; i < CTI_SOURCES.length; i += BATCH_SIZE) {
    const batch = CTI_SOURCES.slice(i, i + BATCH_SIZE);
    const settled = await Promise.allSettled(
      batch.map((source) => ingestSource(source))
    );

    for (let j = 0; j < settled.length; j++) {
      const result = settled[j];
      const source = batch[j];

      if (result.status === "fulfilled") {
        const { health, articles } = result.value;
        if (articles.length) allArticles.push(...articles);
        healthRecords.push(health);

        if (health.status === "failed" || health.status === "timeout") {
          errors.push({
            feed: source.name,
            message: health.message ?? health.status,
          });
        }
      } else {
        const message =
          result.reason instanceof Error
            ? result.reason.message
            : "Ingest failed";
        healthRecords.push({
          name: source.name,
          status: isTimeoutError(message) ? "timeout" : "failed",
          method: "none",
          articleCount: 0,
          reliability: source.reliability,
          message,
        });
        errors.push({ feed: source.name, message });
      }
    }
  }

  const deduped = dedupeArticles(allArticles);
  const { kept, marketingFiltered } = filterRelevantArticles(deduped);
  const fresh = filterFreshArticles(kept);
  const prioritized = prioritizeArticles(fresh);

  const health = summarizeHealth(healthRecords);
  const operational = health.online + health.degraded;

  return {
    articles: prioritized,
    errors,
    feedSuccessCount: operational,
    feedTotalCount: CTI_SOURCES.length,
    filteredOutCount:
      deduped.length -
      fresh.length +
      marketingFiltered +
      (allArticles.length - deduped.length),
    feedHealth: healthRecords,
    healthSummary: health,
    marketingFiltered,
    duplicateFiltered: allArticles.length - deduped.length,
  };
}

export async function fetchAllFeeds(): Promise<{
  articles: ThreatArticle[];
  errors: { feed: string; message: string }[];
  feedSuccessCount: number;
  feedTotalCount: number;
  filteredOutCount: number;
  feedHealth: FeedHealthRecord[];
  healthSummary: FeedHealthSummary;
  marketingFiltered: number;
  duplicateFiltered: number;
}> {
  const now = Date.now();
  if (ingestCache && ingestCache.expires > now) {
    return ingestCache.payload;
  }

  const payload = await runIngestion();
  ingestCache = { expires: now + CACHE_TTL_MS, payload };
  return payload;
}

export { MAX_ARTICLE_AGE_HOURS };
