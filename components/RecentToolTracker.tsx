"use client";

import { useEffect } from "react";
import { useRecentTools } from "@/lib/useRecentTools";

export default function RecentToolTracker({ slug }: { slug: string }) {
  const { recordVisit } = useRecentTools();

  useEffect(() => {
    recordVisit(slug);
    // Only re-run when the visited slug changes — recordVisit's identity
    // changes on every write (it captures the latest list), so including it
    // here would re-record on every render instead of once per visit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return null;
}
