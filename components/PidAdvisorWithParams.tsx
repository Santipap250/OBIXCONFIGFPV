"use client";

import { useSearchParams } from "next/navigation";
import PidAdvisorTool from "./PidAdvisorTool";
import type { PidAdjustment } from "@/lib/pidAdvisor";

export default function PidAdvisorWithParams() {
  const searchParams = useSearchParams();
  const pAdj = searchParams.get("pAdj");
  const dAdj = searchParams.get("dAdj");

  let initialAdjustment: PidAdjustment | undefined;
  if (pAdj || dAdj) {
    const pAdjustPercent = pAdj ? Number(pAdj) : undefined;
    const dAdjustPercent = dAdj ? Number(dAdj) : undefined;
    const parts: string[] = [];
    if (pAdjustPercent) parts.push(`P ${pAdjustPercent > 0 ? "+" : ""}${pAdjustPercent}%`);
    if (dAdjustPercent) parts.push(`D ${dAdjustPercent > 0 ? "+" : ""}${dAdjustPercent}%`);
    initialAdjustment = {
      pAdjustPercent,
      dAdjustPercent,
      label: parts.join(", ") || "custom adjustment",
    };
  }

  return <PidAdvisorTool initialAdjustment={initialAdjustment} />;
}
