import { FEED_INGEST_CONFIG } from "@/lib/feeds/config";
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
import { dedupeArticles } from "./dedupe";
import { filterRelevantArticles } from "./filter";
import { fetchValidated } from "./http";
import { parseFeedXml } from "./parse";
import { prioritizeArticles } from "./prioritize";
import { classifyResponse } from "./validate";

const {
  feedTimeoutMs: FEED_TIMEOUT_MS,
  concurrentFeeds: BATCH_SIZE,
  maxSyncMs: MAX_SYNC_MS,
  cacheTtlMs: CACHE_TTL_MS,
} = FEED_INGEST_CONFIG;

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
  return /abort|timeout|timed out|deadline/i.test(message);
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
    sourceUrl: source.feedUrl,
    lastSync: new Date().toISOString(),
    durationMs: Date.now() - startMs,
  };
}

function failureHealth(
  source: CTISource,
  startMs: number,
  status: FeedHealthStatus,
  responseType: string,
  errorReason: string
): FeedHealthRecord {
  return {
    ...buildHealthBase(source, startMs),
    status,
    method: "none",
    articleCount: 0,
    responseType,
    errorReason,
    message: errorReason,
  };
}

async function ingestRssSource(source: CTISource): Promise<IngestResult> {
  const start = Date.now();
  const base = buildHealthBase(source, start);
  const url = source.feedUrl;

  let fetched;
  try {
    fetched = await fetchValidated(url, FEED_TIMEOUT_MS);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const status: FeedHealthStatus = isTimeoutError(msg) ? "timeout" : "failed";
    return {
      articles: [],
      health: failureHealth(source, start, status, "error_text", msg),
    };
  }

  if (!fetched) {
    return {
      articles: [],
      health: failureHealth(
        source,
        start,
        "timeout",
        "empty",
        "Request timed out or network error"
      ),
    };
  }

  const classified = classifyResponse(fetched);

  if (!classified.feedType) {
    const status: FeedHealthStatus =
      classified.kind === "cloudflare"
        ? "blocked"
        : classified.kind === "html" || classified.kind === "json"
          ? "unsupported"
          : "invalid";

    return {
      articles: [],
      health: failureHealth(
        source,
        start,
        status,
        classified.kind,
        classified.reason ?? "Not a valid RSS/Atom feed"
      ),
    };
  }

  const method: FeedIngestMethod =
    classified.feedType === "atom" ? "atom" : "rss";

  try {
    const articles = await parseFeedXml(fetched.text, url, source, method);

    return {
      articles,
      health: {
        ...base,
        status: "online",
        method,
        articleCount: articles.length,
        resolvedUrl: url,
        responseType: method === "atom" ? "atom" : "rss",
      },
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      articles: [],
      health: failureHealth(
        source,
        start,
        "parsing_failed",
        classified.kind,
        msg
      ),
    };
  }
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
  const deadline = Date.now() + MAX_SYNC_MS;
  let syncTruncated = false;

  for (let i = 0; i < CTI_SOURCES.length; i += BATCH_SIZE) {
    if (Date.now() > deadline) {
      syncTruncated = true;
      break;
    }

    const batch = CTI_SOURCES.slice(i, i + BATCH_SIZE);
    const settled = await Promise.allSettled(
      batch.map((source) => ingestRssSource(source))
    );

    for (let j = 0; j < settled.length; j++) {
      const result = settled[j];
      const source = batch[j];

      if (result.status === "fulfilled") {
        const { health, articles } = result.value;
        const record = {
          ...health,
          name: health.name || source.name,
          reliability: health.reliability || source.reliability,
          sourceUrl: health.sourceUrl || source.feedUrl,
          lastSync: health.lastSync ?? syncedAt,
        };

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
          sourceUrl: source.feedUrl,
          lastSync: syncedAt,
          responseType: "error_text",
          errorReason: message,
          message,
        });
        errors.push({ feed: source.name, message });
      }
    }
  }

  if (syncTruncated) {
    const syncedNames = new Set(healthRecords.map((r) => r.name));
    for (const source of CTI_SOURCES) {
      if (!syncedNames.has(source.name)) {
        healthRecords.push({
          name: source.name,
          status: "timeout",
          method: "none",
          articleCount: 0,
          reliability: source.reliability,
          sourceUrl: source.feedUrl,
          lastSync: syncedAt,
          responseType: "skipped",
          errorReason: "Skipped — sync time limit reached",
          message: "Sync deadline",
        });
      }
    }
  }

  const deduped = dedupeArticles(allArticles);
  const { kept, marketingFiltered } = filterRelevantArticles(deduped);
  const fresh = filterFreshArticles(kept);
  const prioritized = prioritizeArticles(fresh);
  const health = summarizeHealth(healthRecords);

  return {
    articles: prioritized,
    errors,
    feedSuccessCount: health.online,
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
    syncTruncated,
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
  syncTruncated?: boolean;
}> {
  const now = Date.now();
  if (ingestCache && ingestCache.expires > now) {
    return ingestCache.payload;
  }

  try {
    const payload = await runIngestion();
    ingestCache = { expires: now + CACHE_TTL_MS, payload };
    return payload;
  } catch {
    return {
      articles: [],
      errors: [{ feed: "aggregation", message: "Ingestion engine failure" }],
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
