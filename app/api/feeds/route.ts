import { NextResponse } from "next/server";
import { MAX_ARTICLE_AGE_HOURS } from "@/lib/freshness";
import { RSS_FEEDS } from "@/lib/feeds";
import { fetchAllFeeds } from "@/lib/rss";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 60;

export async function GET() {
  try {
    const {
      articles,
      errors,
      feedSuccessCount,
      feedTotalCount,
      filteredOutCount,
    } = await fetchAllFeeds();

    return NextResponse.json({
      articles,
      fetchedAt: new Date().toISOString(),
      totalCount: articles.length,
      feedSuccessCount,
      feedTotalCount,
      maxAgeHours: MAX_ARTICLE_AGE_HOURS,
      filteredOutCount,
      ...(errors.length > 0 ? { errors } : {}),
    });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to fetch threat intelligence feeds";

    return NextResponse.json(
      {
        articles: [],
        fetchedAt: new Date().toISOString(),
        totalCount: 0,
        feedSuccessCount: 0,
        feedTotalCount: RSS_FEEDS.length,
        maxAgeHours: MAX_ARTICLE_AGE_HOURS,
        filteredOutCount: 0,
        errors: [{ feed: "all", message }],
      },
      { status: 500 }
    );
  }
}
