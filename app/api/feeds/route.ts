import { NextResponse } from "next/server";
import { CTI_SOURCE_COUNT } from "@/lib/feeds/sources";
import { MAX_ARTICLE_AGE_HOURS } from "@/lib/freshness";
import { fetchAllFeeds } from "@/lib/ingestion/engine";

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
      feedHealth,
      healthSummary,
      marketingFiltered,
      duplicateFiltered,
      syncedAt,
    } = await fetchAllFeeds();

    return NextResponse.json(
      {
        articles,
        fetchedAt: new Date().toISOString(),
        syncedAt,
        totalCount: articles.length,
        feedSuccessCount,
        feedTotalCount,
        maxAgeHours: MAX_ARTICLE_AGE_HOURS,
        filteredOutCount,
        feedHealth,
        healthSummary,
        marketingFiltered,
        duplicateFiltered,
        ...(errors.length > 0 ? { errors } : {}),
      },
      {
        headers: {
          "Cache-Control": "private, max-age=60, stale-while-revalidate=120",
        },
      }
    );
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
        feedTotalCount: CTI_SOURCE_COUNT,
        maxAgeHours: MAX_ARTICLE_AGE_HOURS,
        filteredOutCount: 0,
        errors: [{ feed: "aggregation", message }],
      },
      { status: 500 }
    );
  }
}
