import { NextResponse } from "next/server";
import { RSS_FEEDS } from "@/lib/feeds";
import { fetchAllFeeds } from "@/lib/rss";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const { articles, errors, feedSuccessCount, feedTotalCount } =
      await fetchAllFeeds();

    return NextResponse.json({
      articles,
      fetchedAt: new Date().toISOString(),
      totalCount: articles.length,
      feedSuccessCount,
      feedTotalCount,
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
        errors: [{ feed: "all", message }],
      },
      { status: 500 }
    );
  }
}
