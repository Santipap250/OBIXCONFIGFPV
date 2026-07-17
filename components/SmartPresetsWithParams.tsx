"use client";

import { useSearchParams } from "next/navigation";
import SmartPresetsTool from "./SmartPresetsTool";
import { decodeSharedPreset } from "@/lib/shareEncoding";

export default function SmartPresetsWithParams() {
  const searchParams = useSearchParams();
  const shared = searchParams.get("shared");
  const incomingShared = shared ? decodeSharedPreset(shared) ?? undefined : undefined;

  return <SmartPresetsTool incomingShared={incomingShared} />;
}
