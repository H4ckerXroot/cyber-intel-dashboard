"use client";

import { AnalystProfile } from "@/components/dashboard/AnalystProfile";
import { IntelWidgets } from "@/components/dashboard/IntelWidgets";
import { PersonalSection } from "@/components/dashboard/PersonalSection";
import { PriorityIntel } from "@/components/dashboard/PriorityIntel";
import { ReportsSection } from "@/components/dashboard/ReportsSection";
import { ThreatLevelWidget } from "@/components/dashboard/ThreatLevelWidget";
import { ThreatStats } from "@/components/dashboard/ThreatStats";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { ThreatSection } from "@/components/sections/ThreatSection";
import { ArticleModal } from "@/components/ui/ArticleModal";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { NewsCard } from "@/components/ui/NewsCard";
import { SeverityFilter } from "@/components/ui/SeverityFilter";
import { BRAND } from "@/lib/brand";
import { ALL_CATEGORY_ID } from "@/lib/categories";
import type { ThreatArticle, ThreatCategory } from "@/lib/types";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useThreatFeeds } from "@/hooks/useThreatFeeds";
import { useCallback, useMemo, useState } from "react";

const SECONDARY_SECTIONS: ThreatCategory[] = [
  "malware-analysis",
  "threat-actors",
  "government-advisories",
];

export function CyberDashboard() {
  const {
    articles,
    allArticles,
    articlesByCategory,
    loading,
    refreshing,
    error,
    feedErrors,
    fetchedAt,
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
  } = useThreatFeeds();

  const {
    savedIds,
    watchlistIds,
    hydrated,
    toggleSaved,
    toggleWatchlist,
    isSaved,
    isWatchlisted,
  } = useBookmarks();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedArticle, setSelectedArticle] = useState<ThreatArticle | null>(
    null
  );

  const scrollToSection = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const savedArticles = useMemo(
    () => (hydrated ? allArticles.filter((a) => savedIds.includes(a.id)) : []),
    [allArticles, savedIds, hydrated]
  );

  const watchlistArticles = useMemo(
    () =>
      hydrated ? allArticles.filter((a) => watchlistIds.includes(a.id)) : [],
    [allArticles, watchlistIds, hydrated]
  );

  const showPriorityLayout =
    categoryFilter === ALL_CATEGORY_ID &&
    severityFilter === "all" &&
    !search.trim();

  const hasActiveFilter =
    categoryFilter !== ALL_CATEGORY_ID ||
    severityFilter !== "all" ||
    !!search.trim();

  return (
    <div className="cyber-bg relative flex min-h-screen">
      <Sidebar
        activeSection={activeSection}
        onNavigate={scrollToSection}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <Header
          search={search}
          onSearchChange={setSearch}
          onRefresh={refresh}
          loading={loading}
          refreshing={refreshing}
          articleCount={articles.length}
          fetchedAt={fetchedAt}
          feedSuccess={feedStats.success}
          feedTotal={feedStats.total}
          onMenuToggle={() => setSidebarOpen(true)}
        />

        <main className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-4 lg:px-5 lg:py-3.5">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-3">
            {error && (
              <div
                className="rounded-lg border border-red-500/25 bg-red-500/5 px-3 py-2 text-sm text-red-300"
                role="alert"
              >
                {error}
                <button
                  type="button"
                  onClick={refresh}
                  className="ml-2 underline hover:text-red-200"
                >
                  Retry
                </button>
              </div>
            )}

            {feedErrors && feedErrors.length > 0 && (
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-200/80">
                {feedErrors.length} feed source(s) unavailable — showing available
                intelligence.
              </div>
            )}

            {!loading && filteredOutCount > 0 && (
              <p className="text-xs text-slate-600">
                {filteredOutCount.toLocaleString()} older article
                {filteredOutCount === 1 ? "" : "s"} hidden (outside last{" "}
                {BRAND.maxArticleAgeHours} hours).
              </p>
            )}

            {/* Overview: compact ops header */}
            <section
              id="overview"
              className="scroll-mt-16 grid gap-2 lg:grid-cols-12 lg:items-start"
            >
              <div className="lg:col-span-8">
                <WelcomeSection
                  fetchedAt={fetchedAt}
                  loading={loading}
                  refreshing={refreshing}
                  articleCount={allArticles.length}
                />
              </div>
              <div className="flex flex-col gap-2 lg:col-span-4">
                <ThreatLevelWidget severityCounts={severityCounts} />
                <AnalystProfile />
              </div>
              <div className="lg:col-span-12">
                <ThreatStats
                  total={allArticles.length}
                  severityCounts={severityCounts}
                  feedSuccess={feedStats.success}
                  feedTotal={feedStats.total}
                  loading={loading}
                />
              </div>
            </section>

            {/* Filters toolbar */}
            <div className="soc-card flex flex-col gap-2 px-3 py-2.5">
              <CategoryFilter
                active={categoryFilter}
                onChange={setCategoryFilter}
                counts={categoryCounts}
              />
              <SeverityFilter
                active={severityFilter}
                onChange={setSeverityFilter}
                counts={severityCounts}
              />
            </div>

            {hasActiveFilter ? (
              <section className="flex flex-col gap-3">
                <h2 className="text-sm font-semibold text-slate-300">
                  Search Results ({articles.length})
                </h2>
                {loading ? (
                  <LoadingSkeleton count={6} />
                ) : articles.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-800 py-10 text-center">
                    <p className="text-sm text-slate-500">
                      No articles match your search or filters.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {articles.slice(0, 24).map((article) => (
                      <NewsCard
                        key={article.id}
                        article={article}
                        saved={isSaved(article.id)}
                        watchlisted={isWatchlisted(article.id)}
                        onToggleSave={() => toggleSaved(article.id)}
                        onToggleWatchlist={() => toggleWatchlist(article.id)}
                        onSelect={() => setSelectedArticle(article)}
                      />
                    ))}
                  </div>
                )}
              </section>
            ) : showPriorityLayout ? (
              <div className="flex flex-col gap-3">
                <PriorityIntel
                  latestNews={articlesByCategory["latest-threat-news"]}
                  cveAlerts={articlesByCategory["cve-alerts"]}
                  ransomware={articlesByCategory["ransomware-updates"]}
                  loading={loading}
                  onSelect={setSelectedArticle}
                  isSaved={isSaved}
                  isWatchlisted={isWatchlisted}
                  onToggleSave={toggleSaved}
                  onToggleWatchlist={toggleWatchlist}
                />

                <IntelWidgets
                  severityCounts={severityCounts}
                  totalArticles={allArticles.length}
                />

                <div className="flex flex-col gap-3 border-t border-slate-800/50 pt-3">
                  {SECONDARY_SECTIONS.map((category) => (
                    <ThreatSection
                      key={category}
                      category={category}
                      articles={articlesByCategory[category]}
                      loading={loading}
                      isSaved={isSaved}
                      isWatchlisted={isWatchlisted}
                      onToggleSave={toggleSaved}
                      onToggleWatchlist={toggleWatchlist}
                      onSelect={setSelectedArticle}
                    />
                  ))}

                  <ReportsSection
                    severityCounts={severityCounts}
                    totalArticles={allArticles.length}
                    loading={loading}
                  />

                  <PersonalSection
                    id="saved-articles"
                    title="Saved Articles"
                    description="Bookmarked intelligence for quick review"
                    icon="★"
                    articles={savedArticles}
                    loading={loading}
                    emptyMessage="Save articles using the bookmark icon on any card."
                    isSaved={isSaved}
                    isWatchlisted={isWatchlisted}
                    onToggleSave={toggleSaved}
                    onToggleWatchlist={toggleWatchlist}
                    onSelect={setSelectedArticle}
                  />

                  <PersonalSection
                    id="watchlist"
                    title="Watchlist"
                    description="Items you are actively monitoring"
                    icon="◎"
                    articles={watchlistArticles}
                    loading={loading}
                    emptyMessage="Add articles to your watchlist using the eye icon on any card."
                    isSaved={isSaved}
                    isWatchlisted={isWatchlisted}
                    onToggleSave={toggleSaved}
                    onToggleWatchlist={toggleWatchlist}
                    onSelect={setSelectedArticle}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </main>

        <footer className="shrink-0 border-t border-slate-800/80 px-3 py-2 sm:px-4">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-0.5 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-[11px] text-slate-600">{BRAND.footer}</p>
            <p className="text-[11px] text-slate-500">{BRAND.footerPersonal}</p>
          </div>
        </footer>
      </div>

      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </div>
  );
}
