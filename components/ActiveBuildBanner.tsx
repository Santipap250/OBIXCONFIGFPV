"use client";

import Link from "next/link";
import { useBuildProfiles } from "@/lib/useBuildProfiles";
import { flyingStyleLabels } from "@/lib/buildProfile";

export default function ActiveBuildBanner() {
  const { activeProfile } = useBuildProfiles();

  if (!activeProfile) {
    return (
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line px-5 py-3">
        <p className="text-sm text-muted">ยังไม่ได้เลือก Active Build — ตอนนี้เครื่องมือนี้ใช้ค่าที่กรอกเองด้านล่าง</p>
        <Link href="/dashboard" className="font-hud shrink-0 text-[11px] uppercase tracking-[0.15em] text-phosphor hover:text-phosphor">
          ไปตั้ง Build Profile →
        </Link>
      </div>
    );
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-phosphor/40 bg-phosphor/5 px-5 py-3">
      <p className="text-sm text-ink">
        <span className="font-hud text-phosphor">Active Build:</span> {activeProfile.name}
        {activeProfile.flyingStyle && (
          <span className="font-hud text-muted"> · {flyingStyleLabels[activeProfile.flyingStyle]}</span>
        )}
      </p>
      <Link href="/dashboard" className="font-hud shrink-0 text-[11px] uppercase tracking-[0.15em] text-muted hover:text-phosphor">
        เปลี่ยน build →
      </Link>
    </div>
  );
}
