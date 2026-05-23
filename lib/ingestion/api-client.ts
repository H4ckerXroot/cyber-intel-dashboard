import type { FeedsApiResponse } from "@/lib/types";

export async function parseFeedsApiResponse(
  res: Response
): Promise<FeedsApiResponse> {
  const contentType = res.headers.get("content-type") ?? "";
  const raw = await res.text();

  if (!raw.trim()) {
    throw new Error("Feed API returned an empty response");
  }

  const trimmed = raw.trimStart();
  if (
    trimmed.startsWith("<") ||
    trimmed.toLowerCase().startsWith("<!doctype")
  ) {
    throw new Error(
      "Feed API returned HTML instead of JSON — check server logs or deployment"
    );
  }

  if (!contentType.includes("json") && !trimmed.startsWith("{")) {
    throw new Error(
      `Unexpected feed API response (${contentType || "unknown type"})`
    );
  }

  try {
    return JSON.parse(raw) as FeedsApiResponse;
  } catch {
    const preview = trimmed.slice(0, 80).replace(/\s+/g, " ");
    throw new Error(
      `Feed API returned invalid JSON: ${preview}${trimmed.length > 80 ? "…" : ""}`
    );
  }
}
