import { fetchText } from "./http";
import { validateFeedUrl } from "./validate";

const COMMON_FEED_PATHS = [
  "/feed",
  "/rss",
  "/rss.xml",
  "/feed.xml",
  "/atom.xml",
  "/index.xml",
  "/blog/feed",
  "/blog/rss",
  "/blog/feed.xml",
  "/blog/rss.xml",
  "/resources/feed",
  "/resources/blog/feed",
];

function resolveUrl(base: string, href: string): string {
  try {
    return new URL(href, base).href;
  } catch {
    return href;
  }
}

function extractAlternateFeeds(html: string, baseUrl: string): string[] {
  const urls: string[] = [];
  const linkRe =
    /<link[^>]+rel=["']alternate["'][^>]*>/gi;
  const matches = html.match(linkRe) ?? [];

  for (const tag of matches) {
    const typeMatch = tag.match(/type=["']([^"']+)["']/i);
    const hrefMatch = tag.match(/href=["']([^"']+)["']/i);
    if (!hrefMatch) continue;
    const type = typeMatch?.[1]?.toLowerCase() ?? "";
    if (
      type.includes("rss") ||
      type.includes("atom") ||
      type.includes("xml")
    ) {
      urls.push(resolveUrl(baseUrl, hrefMatch[1]));
    }
  }

  return urls;
}

export async function discoverFeedUrl(
  siteUrl: string,
  timeoutMs: number
): Promise<{ url: string; type: "rss" | "atom" } | null> {
  let origin: string;
  try {
    origin = new URL(siteUrl).origin;
  } catch {
    return null;
  }

  const candidates = new Set<string>();

  const html = await fetchText(siteUrl, timeoutMs);
  if (html) {
    for (const u of extractAlternateFeeds(html, siteUrl)) {
      candidates.add(u);
    }
  }

  for (const path of COMMON_FEED_PATHS) {
    candidates.add(resolveUrl(origin, path));
  }

  for (const url of candidates) {
    const type = await validateFeedUrl(url, timeoutMs);
    if (type) return { url, type };
  }

  return null;
}

export function buildCandidateUrls(
  siteUrl: string,
  knownFeed?: string
): string[] {
  const urls = new Set<string>();
  if (knownFeed) urls.add(knownFeed);

  try {
    const origin = new URL(siteUrl).origin;
    for (const path of COMMON_FEED_PATHS) {
      urls.add(new URL(path, origin).href);
    }
  } catch {
    /* invalid site url */
  }

  return [...urls];
}
