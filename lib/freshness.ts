/** Maximum article age shown in the dashboard (48 hours). */
export const MAX_ARTICLE_AGE_HOURS = 48;

export const MAX_ARTICLE_AGE_MS = MAX_ARTICLE_AGE_HOURS * 60 * 60 * 1000;

export function isArticleFresh(
  publishedAt: string,
  nowMs: number = Date.now()
): boolean {
  const published = new Date(publishedAt).getTime();
  if (Number.isNaN(published)) return false;
  // Reject future-dated items beyond 5 minutes (bad feed data)
  if (published > nowMs + 5 * 60 * 1000) return false;
  return nowMs - published <= MAX_ARTICLE_AGE_MS;
}

export function filterFreshArticles<T extends { publishedAt: string }>(
  articles: T[]
): T[] {
  const now = Date.now();
  return articles.filter((a) => isArticleFresh(a.publishedAt, now));
}
