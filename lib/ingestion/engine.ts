import { CTI_SOURCES } from "@/lib/feeds/sources";
import { filterFreshArticles, MAX_ARTICLE_AGE_HOURS } from "@/lib/freshness";
import type {
  CTISource,
  FeedHealthRecord,
  FeedHealthStatus,
  FeedHealthSummary,
  FeedIngestMethod,
  ThreatArticle,
} from "@/lib/types";
import { buildCandidateUrls, discoverFeedUrl } from "./discover";
import { dedupeArticles } from "./dedupe";
import { filterRelevantArticles } from "./filter";
import { fetchValidated } from "./http";
import { parseFeedXml, scrapedToArticles } from "./parse";
import { prioritizeArticles } from "./prioritize";
import { scrapeBlogFallback } from "./scrape";
import {
  classifyResponse,
  type ClassifiedResponse,
  type ResponseKind,
} from "./validate";

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

interface FeedAttemptFailure {
  status: FeedHealthStatus;
  responseType: ResponseKind;
  errorReason: string;
}

let ingestCache: CacheEntry | null = null;

function isTimeoutError(message: string): boolean {
  return /abort|timeout|timed out/i.test(message);
}

function sourceUrl(source: CTISource): string {
  return source.feedUrl ?? source.siteUrl;
}

function statusFromClassification(
  classified: ClassifiedResponse,
  httpOk: boolean
): FeedHealthStatus {
  if (classified.kind === "cloudflare") return "blocked";
  if (classified.kind === "html") return "unsupported";
  if (classified.kind === "json") return "unsupported";
  if (classified.kind === "empty" || classified.kind === "error_text")
    return httpOk ? "invalid" : "invalid";
  if (classified.kind === "unknown") return "unsupported";
  return "unsupported";
}

function buildHealthBase(
  source: CTISource,
  startMs: number
): Pick<
  FeedHealthRecord,
  "name" | "reliability" | "sourceUrl" | "lastSync" | "durationMs"
> {
  return {
    name: source.name,
    reliability: source.reliability,
    sourceUrl: sourceUrl(source),
    lastSync: new Date().toISOString(),
    durationMs: Date.now() - startMs,
  };
}

async function tryParseFeed(
  url: string,
  source: CTISource,
  method: FeedIngestMethod,
  startMs: number
): Promise<
  | { ok: true; articles: ThreatArticle[]; method: FeedIngestMethod; url: string }
  | { ok: false; failure: FeedAttemptFailure }
> {
  let fetched;
  try {
    fetched = await fetchValidated(url, FEED_TIMEOUT_MS);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      failure: {
        status: isTimeoutError(msg) ? "timeout" : "failed",
        responseType: "error_text",
        errorReason: msg,
      },
    };
  }

  if (!fetched) {
    return {
      ok: false,
      failure: {
        status: "timeout",
        responseType: "empty",
        errorReason: "Request timed out or network error",
      },
    };
  }

  const classified = classifyResponse(fetched);

  if (!classified.feedType) {
    return {
      ok: false,
      failure: {
        status: statusFromClassification(classified, fetched.ok),
        responseType: classified.kind,
        errorReason:
          classified.reason ??
          (fetched.redirected
            ? `Redirected to non-feed content (${fetched.finalUrl})`
            : "Not a valid RSS/Atom feed"),
      },
    };
  }

  const finalMethod: FeedIngestMethod =
    classified.feedType === "atom"
      ? "atom"
      : method === "discovered"
        ? "discovered"
        : "rss";

  try {
    const articles = await parseFeedXml(
      fetched.text,
      url,
      source,
      finalMethod
    );
    if (articles.length === 0) {
      return {
        ok: false,
        failure: {
          status: "invalid",
          responseType: classified.kind,
          errorReason: "Feed parsed but contained no recent dated items",
        },
      };
    }

    return { ok: true, articles, method: finalMethod, url };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      failure: {
        status: "parsing_failed",
        responseType: classified.kind,
        errorReason: msg,
      },
    };
  }
}

function pickWorstFailure(
  failures: FeedAttemptFailure[]
): FeedAttemptFailure | null {
  if (failures.length === 0) return null;

  const priority: FeedHealthStatus[] = [
    "blocked",
    "timeout",
    "parsing_failed",
    "invalid",
    "unsupported",
    "failed",
  ];

  for (const status of priority) {
    const match = failures.find((f) => f.status === status);
    if (match) return match;
  }

  return failures[failures.length - 1];
}

async function ingestSource(source: CTISource): Promise<IngestResult> {
  const start = Date.now();
  const base = buildHealthBase(source, start);
  const candidates = buildCandidateUrls(source.siteUrl, source.feedUrl);
  const failures: FeedAttemptFailure[] = [];

  for (const url of candidates) {
    try {
      const result = await tryParseFeed(
        url,
        source,
        source.feedUrl === url ? "rss" : "discovered",
        start
      );

      if (result.ok) {
        return {
          articles: result.articles,
          health: {
            ...base,
            status: "online",
            method: result.method,
            articleCount: result.articles.length,
            resolvedUrl: result.url,
            responseType: result.method === "atom" ? "atom" : "rss",
            message: result.method === "discovered" ? "Discovered feed path" : undefined,
          },
        };
      }

      failures.push(result.failure);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (isTimeoutError(msg)) {
        return {
          articles: [],
          health: {
            ...base,
            status: "timeout",
            method: "none",
            articleCount: 0,
            responseType: "error_text",
            errorReason: msg,
            message: msg,
          },
        };
      }
      failures.push({
        status: "failed",
        responseType: "error_text",
        errorReason: msg,
      });
    }
  }

  try {
    const discovered = await discoverFeedUrl(
      source.siteUrl,
      DISCOVERY_TIMEOUT_MS
    );
    if (discovered) {
      const result = await tryParseFeed(
        discovered.url,
        source,
        discovered.type === "atom" ? "atom" : "discovered",
        start
      );
      if (result.ok) {
        return {
          articles: result.articles,
          health: {
            ...base,
            status: "online",
            method: result.method,
            articleCount: result.articles.length,
            resolvedUrl: discovered.url,
            responseType: discovered.type,
            message: "Auto-discovered feed",
          },
        };
      }
      failures.push(result.failure);
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
            ...base,
            status: "degraded",
            method: "scrape",
            articleCount: articles.length,
            resolvedUrl: source.siteUrl,
            responseType: "html",
            message: "HTML fallback extraction",
          },
        };
      }
    }
  } catch {
    /* scrape failed */
  }

  const worst = pickWorstFailure(failures);
  const status: FeedHealthStatus = worst?.status ?? "failed";
  const errorReason =
    worst?.errorReason ?? "No RSS/Atom feed or fallback content";

  return {
    articles: [],
    health: {
      ...base,
      status,
      method: "none",
      articleCount: 0,
      responseType: worst?.responseType ?? "unknown",
      errorReason,
      message: errorReason,
    },
  };
}

function summarizeHealth(records: FeedHealthRecord[]): FeedHealthSummary {
  const summary: FeedHealthSummary = {
    online: 0,
    degraded: 0,
    failed: 0,
    timeout: 0,
    blocked: 0,
    invalid: 0,
    unsupported: 0,
    parsing_failed: 0,
    total: records.length,
  };

  for (const r of records) {
    if (r.status === "online") summary.online++;
    else if (r.status === "degraded") summary.degraded++;
    else if (r.status === "timeout") summary.timeout++;
    else if (r.status === "blocked") summary.blocked++;
    else if (r.status === "invalid") summary.invalid++;
    else if (r.status === "unsupported") summary.unsupported++;
    else if (r.status === "parsing_failed") summary.parsing_failed++;
    else summary.failed++;
  }

  return summary;
}

const ERROR_STATUSES: FeedHealthStatus[] = [
  "failed",
  "timeout",
  "blocked",
  "invalid",
  "unsupported",
  "parsing_failed",
];

async function runIngestion() {
  const allArticles: ThreatArticle[] = [];
  const healthRecords: FeedHealthRecord[] = [];
  const errors: { feed: string; message: string }[] = [];
  const syncedAt = new Date().toISOString();

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
        const record = { ...health, lastSync: health.lastSync ?? syncedAt };
        if (articles.length) allArticles.push(...articles);
        healthRecords.push(record);

        if (ERROR_STATUSES.includes(record.status)) {
          errors.push({
            feed: source.name,
            message: record.errorReason ?? record.message ?? record.status,
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
          sourceUrl: sourceUrl(source),
          lastSync: syncedAt,
          responseType: "error_text",
          errorReason: message,
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
    syncedAt,
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
  syncedAt: string;
}> {
  const now = Date.now();
  if (ingestCache && ingestCache.expires > now) {
    return ingestCache.payload;
  }

  try {
    const payload = await runIngestion();
    ingestCache = { expires: now + CACHE_TTL_MS, payload };
    return payload;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Ingestion engine failure";
    return {
      articles: [],
      errors: [{ feed: "aggregation", message }],
      feedSuccessCount: 0,
      feedTotalCount: CTI_SOURCES.length,
      filteredOutCount: 0,
      feedHealth: [],
      healthSummary: {
        online: 0,
        degraded: 0,
        failed: CTI_SOURCES.length,
        timeout: 0,
        blocked: 0,
        invalid: 0,
        unsupported: 0,
        parsing_failed: 0,
        total: CTI_SOURCES.length,
      },
      marketingFiltered: 0,
      duplicateFiltered: 0,
      syncedAt: new Date().toISOString(),
    };
  }
}

export { MAX_ARTICLE_AGE_HOURS };
