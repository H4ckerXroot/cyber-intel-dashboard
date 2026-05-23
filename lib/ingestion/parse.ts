import Parser from "rss-parser";
import { categorizeArticle } from "@/lib/categorize";
import { enrichArticle } from "@/lib/enrichment";
import type { CTISource, FeedIngestMethod, ThreatArticle } from "@/lib/types";
import { fetchValidated } from "./http";
import { classifyResponse, detectFeedType } from "./validate";
import type { ScrapedItem } from "./scrape";

const parser = new Parser({
  timeout: 12_000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (compatible; CTIDashboard/2.0; +https://github.com/cti-dashboard)",
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
    /* ignore */
  }
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

function parsePublishedDate(raw?: string): string | null {
  if (!raw) return null;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function buildArticle(
  source: CTISource,
  feedUrl: string,
  method: FeedIngestMethod,
  fields: {
    title: string;
    link: string;
    summary: string;
    publishedAt: string;
    image?: string;
  }
): ThreatArticle {
  const category = categorizeArticle(
    fields.title,
    fields.summary,
    source.name
  );
  const base: ThreatArticle = {
    id: toArticleId(fields.link, fields.title),
    title: fields.title,
    link: fields.link,
    summary: fields.summary.slice(0, 400),
    publishedAt: fields.publishedAt,
    source: source.name,
    feedUrl,
    category,
    severity: "low",
    sourceReliability: source.reliability,
    ingestMethod: method,
    ...(fields.image ? { image: fields.image } : {}),
  };
  return enrichArticle(base);
}

export async function parseFeedXml(
  xml: string,
  feedUrl: string,
  source: CTISource,
  method: FeedIngestMethod
): Promise<ThreatArticle[]> {
  if (!xml.trim()) return [];

  let parsed: Awaited<ReturnType<typeof parser.parseString>>;
  try {
    parsed = await parser.parseString(xml);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "XML parse failed";
    throw new Error(`Feed XML parse error: ${msg}`);
  }

  const articles: ThreatArticle[] = [];

  for (const item of parsed.items ?? []) {
    const title = item.title?.trim();
    const link = item.link?.trim() || item.guid?.trim();
    if (!title || !link) continue;

    const publishedAt =
      parsePublishedDate(item.isoDate || item.pubDate) ?? null;
    if (!publishedAt) continue;

    const itemExt = item as Parser.Item & { "content:encoded"?: string };
    const rawSummary =
      item.contentSnippet ||
      stripHtml(
        item.content || itemExt["content:encoded"] || item.summary || ""
      );

    articles.push(
      buildArticle(source, feedUrl, method, {
        title,
        link,
        summary: rawSummary,
        publishedAt,
        image: extractImage(item),
      })
    );
  }

  return articles;
}

/** Fetches and parses — prefer parseFeedXml with a pre-validated body in ingestion. */
export async function parseFeedUrl(
  url: string,
  source: CTISource,
  method: FeedIngestMethod
): Promise<ThreatArticle[]> {
  const fetched = await fetchValidated(url, 12_000);
  if (!fetched) return [];

  const classified = classifyResponse(fetched);
  if (!classified.feedType && !detectFeedType(fetched.text)) return [];

  return parseFeedXml(fetched.text, url, source, method);
}

export function scrapedToArticles(
  items: ScrapedItem[],
  source: CTISource,
  feedUrl: string
): ThreatArticle[] {
  const articles: ThreatArticle[] = [];
  const now = Date.now();

  for (const item of items) {
    if (!item.publishedAt) continue;
    const published = new Date(item.publishedAt).getTime();
    if (Number.isNaN(published) || published > now + 5 * 60 * 1000) continue;

    articles.push(
      buildArticle(source, feedUrl, "scrape", {
        title: item.title,
        link: item.link,
        summary: item.summary,
        publishedAt: item.publishedAt,
      })
    );
  }

  return articles;
}
