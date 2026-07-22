"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

const KEY = "recent-tools-v1";
const MAX_RECENT = 5;

export function useRecentTools() {
  const [recentSlugs, setRecentSlugs] = useLocalStorage<string[]>(KEY, []);

  const recordVisit = useCallback(
    (slug: string) => {
      setRecentSlugs([slug, ...recentSlugs.filter((s) => s !== slug)].slice(0, MAX_RECENT));
    },
    [recentSlugs, setRecentSlugs]
  );

  return { recentSlugs, recordVisit };
}
