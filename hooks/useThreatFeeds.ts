"use client";

import { ALL_CATEGORY_ID, type FilterValue } from "@/lib/categories";
import { parseFeedsApiResponse } from "@/lib/ingestion/api-client";
import { prioritizeArticles } from "@/lib/ingestion/prioritize";
import type {
  FeedsApiResponse,
  ThreatArticle,
  ThreatCategory,
  ThreatSeverity,
} from "@/lib/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const AUTO_REFRESH_MS = 5 * 60 * 1000;

function sortArticles(articles: ThreatArticle[]): ThreatArticle[] {
  return prioritizeArticles(articles);
}

export function useThreatFeeds() {
  const [articles, setArticles] = useState<ThreatArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedErrors, setFeedErrors] = useState<FeedsApiResponse["errors"]>();
  const [feedHealth, setFeedHealth] = useState<FeedsApiResponse["feedHealth"]>();
  const [healthSummary, setHealthSummary] =
    useState<FeedsApiResponse["healthSummary"]>();
  const [fetchedAt, setFetchedAt] = useState<string>();
  const [syncedAt, setSyncedAt] = useState<string>();
  const [feedStats, setFeedStats] = useState({ success: 0, total: 0 });
  const [filteredOutCount, setFilteredOutCount] = useState(0);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<FilterValue>(ALL_CATEGORY_ID);
  const [severityFilter, setSeverityFilter] = useState<ThreatSeverity | "all">(
    "all"
  );
  const initialLoad = useRef(true);

  const fetchFeeds = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const res = await fetch(`/api/feeds?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
      });
      const data = await parseFeedsApiResponse(res);

      if (!res.ok && data.articles.length === 0) {
        throw new Error(
          data.errors?.[0]?.message ??
            "Failed to load threat intelligence feeds"
        );
      }

      setArticles(sortArticles(data.articles));
      setFetchedAt(data.fetchedAt);
      setSyncedAt(data.syncedAt ?? data.fetchedAt);
      setFeedErrors(data.errors);
      setFeedHealth(data.feedHealth);
      setHealthSummary(data.healthSummary);
      setFilteredOutCount(data.filteredOutCount ?? 0);
      setFeedStats({
        success: data.feedSuccessCount ?? 0,
        total: data.feedTotalCount ?? 0,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Network error";
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
      initialLoad.current = false;
    }
  }, []);

  const refresh = useCallback(() => fetchFeeds(true), [fetchFeeds]);

  useEffect(() => {
    fetchFeeds(false);
  }, [fetchFeeds]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchFeeds(true);
      }
    };

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchFeeds(true);
      }
    }, AUTO_REFRESH_MS);

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [fetchFeeds]);

  const filteredArticles = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = articles.filter((article) => {
      const matchesCategory =
        categoryFilter === ALL_CATEGORY_ID ||
        article.category === categoryFilter;

      const matchesSeverity =
        severityFilter === "all" || article.severity === severityFilter;

      if (!matchesCategory || !matchesSeverity) return false;

      if (!query) return true;

      const haystack =
        `${article.title} ${article.summary} ${article.aiSummary ?? ""} ${article.source} ${article.severity} ${(article.tags ?? []).join(" ")} ${(article.iocs ?? []).map((i) => i.value).join(" ")}`.toLowerCase();
      return haystack.includes(query);
    });

    return sortArticles(filtered);
  }, [articles, search, categoryFilter, severityFilter]);

  const articlesByCategory = useMemo(() => {
    const map = {} as Record<ThreatCategory, ThreatArticle[]>;

    for (const cat of [
      "latest-threat-news",
      "cve-alerts",
      "malware-analysis",
      "ransomware-updates",
      "threat-actors",
      "government-advisories",
    ] as ThreatCategory[]) {
      map[cat] = filteredArticles.filter((a) => a.category === cat);
    }

    return map;
  }, [filteredArticles]);

  const categoryCounts = useMemo(() => {
    const counts = {} as Partial<Record<ThreatCategory, number>>;
    for (const article of articles) {
      counts[article.category] = (counts[article.category] ?? 0) + 1;
    }
    return counts;
  }, [articles]);

  const severityCounts = useMemo(() => {
    const counts: Record<ThreatSeverity, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };
    for (const article of articles) {
      counts[article.severity]++;
    }
    return counts;
  }, [articles]);

  const isBusy = loading || refreshing;

  return {
    articles: filteredArticles,
    allArticles: articles,
    articlesByCategory,
    loading,
    refreshing,
    isBusy,
    error,
    feedErrors,
    feedHealth,
    healthSummary,
    fetchedAt,
    syncedAt,
    feedStats,
    filteredOutCount,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    severityFilter,
    setSeverityFilter,
    categoryCounts,
    severityCounts,
    refresh,
  };
}
