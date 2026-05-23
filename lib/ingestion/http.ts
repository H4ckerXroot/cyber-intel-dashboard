const DEFAULT_UA =
  "Mozilla/5.0 (compatible; CTIDashboard/2.0; +https://github.com/cti-dashboard)";

const DEFAULT_HEADERS = {
  "User-Agent": DEFAULT_UA,
  Accept:
    "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
};

const MAX_BODY_BYTES = 512_000;

export interface FetchResult {
  ok: boolean;
  status: number;
  statusText: string;
  contentType: string;
  finalUrl: string;
  requestedUrl: string;
  text: string;
  redirected: boolean;
}

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

export async function fetchValidated(
  url: string,
  timeoutMs: number
): Promise<FetchResult | null> {
  try {
    const res = await fetchWithTimeout(url, timeoutMs);
    const contentType = res.headers.get("content-type") ?? "";
    const text = (await res.text()).slice(0, MAX_BODY_BYTES);

    return {
      ok: res.ok,
      status: res.status,
      statusText: res.statusText,
      contentType,
      finalUrl: res.url,
      requestedUrl: url,
      text,
      redirected: res.redirected,
    };
  } catch (err) {
    if (err instanceof Error && /abort/i.test(err.message)) {
      throw err;
    }
    return null;
  }
}

/** @deprecated Prefer fetchValidated for feed ingestion */
export async function fetchText(
  url: string,
  timeoutMs: number
): Promise<string | null> {
  const result = await fetchValidated(url, timeoutMs);
  if (!result || !result.ok) return null;
  return result.text;
}
