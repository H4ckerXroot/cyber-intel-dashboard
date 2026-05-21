"use client";

import { useCallback, useEffect, useState } from "react";

const SAVED_KEY = "kanvi-cti-saved";
const WATCHLIST_KEY = "kanvi-cti-watchlist";

function readStorage(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(key: string, ids: string[]) {
  localStorage.setItem(key, JSON.stringify(ids));
}

export function useBookmarks() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSavedIds(readStorage(SAVED_KEY));
    setWatchlistIds(readStorage(WATCHLIST_KEY));
    setHydrated(true);
  }, []);

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      writeStorage(SAVED_KEY, next);
      return next;
    });
  }, []);

  const toggleWatchlist = useCallback((id: string) => {
    setWatchlistIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      writeStorage(WATCHLIST_KEY, next);
      return next;
    });
  }, []);

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);
  const isWatchlisted = useCallback(
    (id: string) => watchlistIds.includes(id),
    [watchlistIds]
  );

  return {
    savedIds,
    watchlistIds,
    hydrated,
    toggleSaved,
    toggleWatchlist,
    isSaved,
    isWatchlisted,
  };
}
