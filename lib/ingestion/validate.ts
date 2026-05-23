import { fetchText } from "./http";

export function looksLikeFeedXml(text: string): boolean {
  const sample = text.slice(0, 4000).toLowerCase();
  return (
    sample.includes("<rss") ||
    sample.includes("<feed") ||
    sample.includes("<rdf:rdf") ||
    (sample.includes("<?xml") &&
      (sample.includes("rss") || sample.includes("atom")))
  );
}

export function detectFeedType(text: string): "rss" | "atom" | null {
  const sample = text.slice(0, 8000).toLowerCase();
  if (sample.includes("<feed") && sample.includes("xmlns")) return "atom";
  if (sample.includes("<rss") || sample.includes("<rdf:rdf")) return "rss";
  return looksLikeFeedXml(text) ? "rss" : null;
}

export async function validateFeedUrl(
  url: string,
  timeoutMs: number
): Promise<"rss" | "atom" | null> {
  const text = await fetchText(url, timeoutMs);
  if (!text) return null;
  return detectFeedType(text);
}
