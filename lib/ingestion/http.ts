const DEFAULT_UA =
  "Mozilla/5.0 (compatible; CTIDashboard/2.0; +https://github.com/cti-dashboard)";

const DEFAULT_HEADERS = {
  "User-Agent": DEFAULT_UA,
  Accept:
    "application/rss+xml, application/atom+xml, application/xml, text/xml, text/html, */*",
};

export async function fetchWithTimeout(
  url: string,
  timeoutMs: number,
  init?: RequestInit
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: { ...DEFAULT_HEADERS, ...init?.headers },
      redirect: "follow",
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchText(
  url: string,
  timeoutMs: number
): Promise<string | null> {
  try {
    const res = await fetchWithTimeout(url, timeoutMs);
    if (!res.ok) return null;
    const text = await res.text();
    return text.slice(0, 512_000);
  } catch {
    return null;
  }
}
