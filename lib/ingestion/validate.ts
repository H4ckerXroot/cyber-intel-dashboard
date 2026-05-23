import { fetchValidated, type FetchResult } from "./http";

export type FeedXmlType = "rss" | "atom";

export type ResponseKind =
  | "rss"
  | "atom"
  | "html"
  | "cloudflare"
  | "json"
  | "empty"
  | "error_text"
  | "unknown";

export interface ClassifiedResponse {
  kind: ResponseKind;
  feedType: FeedXmlType | null;
  reason?: string;
}

export function looksLikeFeedXml(text: string): boolean {
  const sample = text.slice(0, 4000).toLowerCase();
  return (
    sample.includes("<rss") ||
    sample.includes("<feed") ||
    sample.includes("<rdf:rdf") ||
    (sample.includes("<?xml") &&
      (sample.includes("rss") || sample.includes("atom") || sample.includes("feed")))
  );
}

export function detectFeedType(text: string): FeedXmlType | null {
  const sample = text.slice(0, 8000).toLowerCase();
  if (sample.includes("<feed") && (sample.includes("xmlns") || sample.includes("<entry")))
    return "atom";
  if (sample.includes("<rss") || sample.includes("<rdf:rdf")) return "rss";
  return looksLikeFeedXml(text) ? "rss" : null;
}

export function isCloudflareBlock(text: string): boolean {
  const sample = text.slice(0, 16_000).toLowerCase();
  return (
    sample.includes("cf-browser-verification") ||
    sample.includes("cloudflare ray id") ||
    sample.includes("attention required! | cloudflare") ||
    sample.includes("checking your browser before accessing") ||
    sample.includes("just a moment...</title>") ||
    sample.includes("enable javascript and cookies to continue") ||
    (sample.includes("cloudflare") && sample.includes("ray id"))
  );
}

export function isHtmlDocument(text: string): boolean {
  const start = text.trimStart().slice(0, 200).toLowerCase();
  return (
    start.startsWith("<!doctype html") ||
    start.startsWith("<html") ||
    start.startsWith("<head") ||
    (start.startsWith("<") && start.includes("<body"))
  );
}

function looksLikeJson(text: string): boolean {
  const t = text.trimStart();
  return t.startsWith("{") || t.startsWith("[");
}

export function classifyResponse(
  fetched: FetchResult
): ClassifiedResponse {
  const { text, contentType, ok, status } = fetched;
  const trimmed = text.trim();

  if (!trimmed) {
    return { kind: "empty", feedType: null, reason: "Empty response body" };
  }

  if (isCloudflareBlock(trimmed)) {
    return {
      kind: "cloudflare",
      feedType: null,
      reason: "Cloudflare challenge or access block",
    };
  }

  const feedType = detectFeedType(trimmed);
  if (feedType) {
    return {
      kind: feedType,
      feedType,
    };
  }

  const ct = contentType.toLowerCase();
  if (
    ct.includes("json") ||
    ct.includes("application/javascript") ||
    looksLikeJson(trimmed)
  ) {
    return {
      kind: "json",
      feedType: null,
      reason: "JSON response is not a supported RSS/Atom feed",
    };
  }

  if (isHtmlDocument(trimmed) || ct.includes("text/html")) {
    return {
      kind: "html",
      feedType: null,
      reason: ok
        ? "HTML page returned (not RSS/Atom XML)"
        : `HTML error page (HTTP ${status})`,
    };
  }

  if (!ok) {
    const snippet = trimmed.slice(0, 120).replace(/\s+/g, " ");
    return {
      kind: "error_text",
      feedType: null,
      reason: `HTTP ${status}${snippet ? `: ${snippet}` : ""}`,
    };
  }

  if (ct.includes("xml") || trimmed.startsWith("<?xml")) {
    return {
      kind: "unknown",
      feedType: null,
      reason: "XML document is not a recognized RSS or Atom feed",
    };
  }

  return {
    kind: "unknown",
    feedType: null,
    reason: "Unrecognized or unsupported response format",
  };
}

export async function validateFeedUrl(
  url: string,
  timeoutMs: number
): Promise<FeedXmlType | null> {
  const fetched = await fetchValidated(url, timeoutMs);
  if (!fetched) return null;
  const classified = classifyResponse(fetched);
  return classified.feedType;
}
