"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { parseBlackboxCsv, derivePidSuggestion, buildSavedAnalysis, type BlackboxResult, type SavedAnalysis } from "@/lib/blackboxAnalyzer";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useBuildProfiles } from "@/lib/useBuildProfiles";
import ActiveBuildBanner from "./ActiveBuildBanner";

const STORAGE_KEY = "saved-blackbox-analyses-v1";

const AXIS_LABELS = { roll: "Roll", pitch: "Pitch", yaw: "Yaw" } as const;

export default function BlackboxAnalyzerTool() {
  const { activeProfile } = useBuildProfiles();
  const [result, setResult] = useState<BlackboxResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedAnalyses, setSavedAnalyses] = useLocalStorage<SavedAnalysis[]>(STORAGE_KEY, []);
  const [savedNotice, setSavedNotice] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestion = useMemo(() => (result ? derivePidSuggestion(result) : null), [result]);

  const handleSaveAnalysis = () => {
    if (!result || !fileName) return;
    const entry = buildSavedAnalysis(result, fileName, activeProfile?.name, suggestion?.label);
    setSavedAnalyses([entry, ...savedAnalyses].slice(0, 10));
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleDeleteAnalysis = (id: string) => setSavedAnalyses(savedAnalyses.filter((a) => a.id !== id));

  const handleFile = useCallback((file: File) => {
    setError(null);
    setResult(null);
    setFileName(file.name);
    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result ?? "");
        const parsed = parseBlackboxCsv(text);
        setResult(parsed);
      } catch (e) {
        setError(e instanceof Error ? e.message : "อ่านไฟล์ไม่สำเร็จ");
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setError("อ่านไฟล์ไม่สำเร็จ");
      setIsLoading(false);
    };
    reader.readAsText(file);
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="mt-10">
      <ActiveBuildBanner />
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="rounded-2xl border border-dashed border-line-strong bg-bg-panel/70 p-8 text-center"
      >
        <p className="font-hud text-xs uppercase tracking-[0.15em] text-phosphor-dim">
          ลากไฟล์มาวาง หรือเลือกไฟล์
        </p>
        <p className="font-display mt-2 text-lg text-ink">อัปโหลด Blackbox CSV</p>
        <p className="mt-2 text-sm text-muted">
          ต้องเป็นไฟล์ .csv ที่ decode แล้วจาก Blackbox Explorer หรือ blackbox_decode
          (ยังไม่รองรับไฟล์ .bbl ดิบ — ต้อง export เป็น CSV ก่อน)
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="font-hud mt-4 rounded-md border border-line-strong px-5 py-2.5 text-xs uppercase tracking-[0.15em] text-phosphor hover:bg-phosphor hover:text-[#04140b]"
        >
          เลือกไฟล์ .csv
        </button>
        <input ref={inputRef} type="file" accept=".csv,text/csv" onChange={onInputChange} className="hidden" />
        {fileName && <p className="font-hud mt-3 text-xs text-muted">ไฟล์: {fileName}</p>}
        <p className="mt-4 text-xs text-muted">
          ไฟล์ถูกวิเคราะห์ในเบราว์เซอร์ของคุณเท่านั้น ไม่มีการอัปโหลดขึ้น server
        </p>
      </div>

      {isLoading && <p className="mt-6 font-hud text-sm text-phosphor-dim">กำลังวิเคราะห์...</p>}

      {error && (
        <div className="mt-6 rounded-xl border border-danger/40 bg-danger/5 px-5 py-4 text-sm text-danger">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <span className="font-hud text-xs uppercase tracking-[0.15em] text-phosphor-dim">Results</span>
            <div className="flex items-center gap-3">
              {savedNotice && <span className="font-hud text-xs text-phosphor">Saved</span>}
              <button
                type="button"
                onClick={handleSaveAnalysis}
                className="font-hud rounded-md border border-line-strong px-4 py-2 text-xs uppercase tracking-[0.15em] text-phosphor hover:bg-phosphor hover:text-[#04140b]"
              >
                Save analysis
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 font-hud sm:grid-cols-4">
            <div className="rounded-lg border border-line px-3 py-3">
              <p className="text-[10px] uppercase tracking-[0.15em] text-phosphor-dim">Samples</p>
              <p className="mt-1 text-lg text-ink">{result.sampleCount.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-line px-3 py-3">
              <p className="text-[10px] uppercase tracking-[0.15em] text-phosphor-dim">Duration</p>
              <p className="mt-1 text-lg text-ink">
                {result.durationSeconds !== null ? `${result.durationSeconds.toFixed(1)}s` : "—"}
              </p>
            </div>
            <div className="rounded-lg border border-line px-3 py-3">
              <p className="text-[10px] uppercase tracking-[0.15em] text-phosphor-dim">Motor sat.</p>
              <p className="mt-1 text-lg text-amber">
                {result.motorSaturationPercent !== null ? `${result.motorSaturationPercent.toFixed(1)}%` : "—"}
              </p>
            </div>
            <div className="rounded-lg border border-line px-3 py-3">
              <p className="text-[10px] uppercase tracking-[0.15em] text-phosphor-dim">Battery sag</p>
              <p className="mt-1 text-lg text-amber">
                {result.battery ? `${result.battery.sagPercent.toFixed(1)}%` : "—"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-line-strong bg-bg-panel/70 p-6">
            <span className="font-hud text-xs uppercase tracking-[0.15em] text-phosphor-dim">
              Tracking error & jitter ต่อแกน
            </span>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {(["roll", "pitch", "yaw"] as const).map((axis) => {
                const stats = result.axisStats[axis];
                return (
                  <div key={axis} className="rounded-lg border border-line px-4 py-3">
                    <p className="font-display text-sm font-medium text-ink">{AXIS_LABELS[axis]}</p>
                    <p className="font-hud mt-2 text-xs text-muted">RMS tracking error</p>
                    <p className="font-hud text-lg text-phosphor">
                      {stats.rmsTrackingError !== null ? `${stats.rmsTrackingError.toFixed(1)}°/s` : "—"}
                    </p>
                    <p className="font-hud mt-2 text-xs text-muted">Jitter (avg Δ)</p>
                    <p className="font-hud text-lg text-ink">
                      {stats.jitter !== null ? `${stats.jitter.toFixed(2)}°/s` : "—"}
                    </p>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-muted">
              Tracking error = setpoint − gyro (ยิ่งต่ำยิ่งดี) · Jitter = ค่าเฉลี่ยความต่างระหว่างตัวอย่างติดกัน
              (ประเมิน high-frequency noise แบบหยาบ ไม่ใช่ noise spectrum เต็มรูปแบบ)
            </p>
          </div>

          {result.battery && (
            <div className="rounded-2xl border border-line-strong bg-bg-panel/70 p-6">
              <span className="font-hud text-xs uppercase tracking-[0.15em] text-phosphor-dim">แรงดันแบต</span>
              <div className="mt-3 grid grid-cols-3 gap-3 font-hud text-sm">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-muted">Min</p>
                  <p className="text-lg text-ink">{result.battery.min.toFixed(2)}v</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-muted">Avg</p>
                  <p className="text-lg text-ink">{result.battery.avg.toFixed(2)}v</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-muted">Max</p>
                  <p className="text-lg text-ink">{result.battery.max.toFixed(2)}v</p>
                </div>
              </div>
            </div>
          )}

          {suggestion && (
            <div className="rounded-2xl border border-line-strong bg-bg-panel/70 p-6">
              <span className="font-hud text-xs uppercase tracking-[0.15em] text-phosphor-dim">
                ส่งต่อไป PID Advisor
              </span>
              <p className="mt-2 text-sm text-ink">{suggestion.label}</p>
              {suggestion.direction !== "balanced" && (
                <Link
                  href={`/tools/pid?${[
                    suggestion.pAdjustPercent ? `pAdj=${suggestion.pAdjustPercent}` : null,
                    suggestion.dAdjustPercent ? `dAdj=${suggestion.dAdjustPercent}` : null,
                  ]
                    .filter(Boolean)
                    .join("&")}`}
                  className="font-hud mt-4 inline-block rounded-md border border-line-strong px-4 py-2 text-xs uppercase tracking-[0.15em] text-phosphor hover:bg-phosphor hover:text-[#04140b]"
                >
                  เปิดใน PID Advisor พร้อมคำแนะนำนี้ →
                </Link>
              )}
            </div>
          )}

          {result.warnings.length > 0 && (
            <div className="space-y-2">
              {result.warnings.map((w) => (
                <div key={w} className="rounded-lg border border-amber/40 bg-amber/5 px-4 py-3 text-sm text-amber">
                  {w}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {savedAnalyses.length > 0 && (
        <div className="mt-8 rounded-2xl border border-line-strong bg-bg-panel/70 p-6">
          <span className="font-hud text-xs uppercase tracking-[0.15em] text-phosphor-dim">
            Saved analyses ({savedAnalyses.length})
          </span>
          <ul className="mt-3 space-y-2">
            {savedAnalyses.map((a) => (
              <li key={a.id} className="rounded-lg border border-line px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-ink">
                      {a.fileName}
                      {a.buildProfileName && (
                        <span className="font-hud ml-2 text-[10px] uppercase tracking-[0.15em] text-muted">
                          · {a.buildProfileName}
                        </span>
                      )}
                    </p>
                    <p className="font-hud mt-1 text-[11px] text-muted">
                      {a.durationSeconds !== null ? `${a.durationSeconds.toFixed(1)}s` : "—"} ·{" "}
                      {a.motorSaturationPercent !== null ? `${a.motorSaturationPercent.toFixed(1)}% sat.` : "—"} ·{" "}
                      {new Date(a.createdAt).toLocaleDateString("th-TH")}
                    </p>
                    {a.suggestionLabel && <p className="mt-1 text-xs text-muted">{a.suggestionLabel}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteAnalysis(a.id)}
                    className="font-hud shrink-0 text-[11px] uppercase tracking-[0.15em] text-muted hover:text-danger"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">
            บันทึกเฉพาะสรุปผล (ไม่ใช่ไฟล์ log ดิบ) ไว้ในเครื่องนี้เท่านั้น เก็บล่าสุด 10 รายการ
          </p>
        </div>
      )}
    </div>
  );
}
