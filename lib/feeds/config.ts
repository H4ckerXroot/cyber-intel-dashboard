/** Server-side ingestion limits for stable Vercel operation. */
export const FEED_INGEST_CONFIG = {
  /** Per-feed HTTP + parse timeout (ms). */
  feedTimeoutMs: 5_000,
  /** Max feeds fetched in parallel per batch. */
  concurrentFeeds: 4,
  /** Hard cap on total ingestion wall time (ms). */
  maxSyncMs: 22_000,
  /** In-memory cache TTL for repeat API hits (ms). */
  cacheTtlMs: 5 * 60 * 1000,
} as const;

/** Client-side fetch timeout for /api/feeds (ms). */
export const CLIENT_FEED_FETCH_TIMEOUT_MS = 28_000;

/** Background auto-refresh interval (ms). */
export const CLIENT_AUTO_REFRESH_MS = 5 * 60 * 1000;
