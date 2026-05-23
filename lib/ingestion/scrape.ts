import type { CTISource } from "@/lib/types";
import { fetchText } from "./http";

export interface ScrapedItem {
  title: string;
  link: string;
  publishedAt: string | null;
  summary: string;
}

const SKIP_PATH =
  /\/(tag|tags|category|categories|author|authors|page|search|login|signup|contact|about|privacy|terms|feed|rss|wp-content|#)/i;

const CYBER_PATH =
  /\/(blog|news|research|threat|security|advisory|advisories|resource|post|article|intel|report|cve|malware|ransomware)/i;

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseDateFromHtml(html: string): string | null {
  const patterns = [
    /<time[^>]+datetime=["']([^"']+)["']/i,
    /<meta[^>]+property=["']article:published_time["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+name=["']date["'][^>]+content=["']([^"']+)["']/i,
  ];

  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) {
      const d = new Date(m[1]);
      if (!Number.isNaN(d.getTime())) return d.toISOString();
    }
  }
  return null;
}

function extractListingItems(html: string, baseUrl: string): ScrapedItem[] {
  const items: ScrapedItem[] = [];
  const seen = new Set<string>();
  let origin: string;
  try {
    origin = new URL(baseUrl).origin;
  } catch {
    return items;
  }

  const anchorRe = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match: RegExpExecArray | null;

  while ((match = anchorRe.exec(html)) !== null && items.length < 12) {
    const href = match[1];
    const inner = stripHtml(match[2]);
    if (!href || inner.length < 12 || inner.length > 200) continue;

    let link: string;
    try {
      link = new URL(href, baseUrl).href;
    } catch {
      continue;
    }

    if (!link.startsWith(origin)) continue;
    if (SKIP_PATH.test(link)) continue;
    if (!CYBER_PATH.test(link) && !link.includes(baseUrl.replace(/\/$/, "")))
      continue;

    const norm = link.split("#")[0].replace(/\/$/, "");
    if (seen.has(norm)) continue;
    seen.add(norm);

    items.push({
      title: inner.slice(0, 240),
      link: norm,
      publishedAt: null,
      summary: inner.slice(0, 400),
    });
  }

  return items;
}

export async function scrapeBlogFallback(
  source: CTISource,
  timeoutMs: number
): Promise<ScrapedItem[]> {
  const html = await fetchText(source.siteUrl, timeoutMs);
  if (!html) return [];

  const listing = extractListingItems(html, source.siteUrl);

  const enriched: ScrapedItem[] = [];
  const maxDetailFetches = 3;

  for (let i = 0; i < listing.length; i++) {
    const item = listing[i];
    if (i < maxDetailFetches) {
      const page = await fetchText(item.link, Math.min(timeoutMs, 5000));
      if (page) {
        const date = parseDateFromHtml(page);
        const ogTitle = page.match(
          /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i
        );
        const ogDesc = page.match(
          /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i
        );
        enriched.push({
          title: ogTitle?.[1]?.trim() || item.title,
          link: item.link,
          publishedAt: date,
          summary: ogDesc?.[1]?.trim() || item.summary,
        });
        continue;
      }
    }
    enriched.push(item);
  }

  return enriched.filter((i) => i.title.length >= 8);
}
