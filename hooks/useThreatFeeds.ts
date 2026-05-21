"use client";

import { ALL_CATEGORY_ID, type FilterValue } from "@/lib/categories";
import type {
  FeedsApiResponse,
  ThreatArticle,
  ThreatCategory,
  ThreatSeverity,
} from "@/lib/types";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useThreatFeeds() {
  const [articles, setArticles] = useState<ThreatArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedErrors, setFeedErrors] = useState<FeedsApiResponse["errors"]>();
  const [fetchedAt, setFetchedAt] = useState<string>();
  const [feedStats, setFeedStats] = useState({ success: 0, total: 0 });
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<FilterValue>(ALL_CATEGORY_ID);
  const [severityFilter, setSeverityFilter] = useState<ThreatSeverity | "all">(
    "all"
  );

  const fetchFeeds = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/feeds", { cache: "no-store" });
      const data: FeedsApiResponse = await res.json();

      if (!res.ok && data.articles.length === 0) {
        throw new Error(
          data.errors?.[0]?.message ??
            "Failed to load threat intelligence feeds"
        );
      }

      setArticles(data.articles);
      setFetchedAt(data.fetchedAt);
      setFeedErrors(data.errors);
      setFeedStats({
        success: data.feedSuccessCount ?? 0,
        total: data.feedTotalCount ?? 0,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Network error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds]);

  const filteredArticles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesCategory =
        categoryFilter === ALL_CATEGORY_ID ||
        article.category === categoryFilter;

      const matchesSeverity =
        severityFilter === "all" || article.severity === severityFilter;

      if (!matchesCategory || !matchesSeverity) return false;

      if (!query) return true;

      const haystack =
        `${article.title} ${article.summary} ${article.source} ${article.severity}`.toLowerCase();
      return haystack.includes(query);
    });
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

  return {
    articles: filteredArticles,
    allArticles: articles,
    articlesByCategory,
    loading,
    error,
    feedErrors,
    fetchedAt,
    feedStats,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    severityFilter,
    setSeverityFilter,
    categoryCounts,
    severityCounts,
    refresh: fetchFeeds,
  };
}
