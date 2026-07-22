"use client";

import { useMemo, useState } from "react";
import { buildRatesCurve, peakRate, type RatesInputs } from "@/lib/ratesEngine";
import { useBuildProfiles } from "@/lib/useBuildProfiles";
import { starterPresets } from "@/lib/presets";
import ActiveBuildBanner from "./ActiveBuildBanner";

const VIEW_W = 560;
const VIEW_H = 280;
const PAD = 28;
const MAX_RATE = 1400; // deg/s, chart ceiling for scaling

function toPath(inputs: RatesInputs) {
  const points = buildRatesCurve(inputs, 61);
  return points
    .map((p, i) => {
      const x = PAD + ((p.stick + 1) / 2) * (VIEW_W - PAD * 2);
      const clamped = Math.max(-MAX_RATE, Math.min(MAX_RATE, p.rate));
      const y = VIEW_H / 2 - (clamped / MAX_RATE) * (VIEW_H / 2 - PAD);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

const defaultInputs: RatesInputs = { rcRate: 1.0, superRate: 0.7, expo: 0.3 };

export default function RatesVisualizerTool() {
  const { activeProfile } = useBuildProfiles();
  const [inputs, setInputs] = useState<RatesInputs>(defaultInputs);
  const [snapshot, setSnapshot] = useState<RatesInputs | null>(null);

  const suggestedPreset = activeProfile?.flyingStyle
    ? starterPresets.find((p) => p.style === activeProfile.flyingStyle)
    : undefined;

  const loadSuggested = () => {
    if (!suggestedPreset) return;
    setInputs({ rcRate: suggestedPreset.rcRate, superRate: suggestedPreset.superRate, expo: suggestedPreset.expo });
  };

  const path = useMemo(() => toPath(inputs), [inputs]);
  const snapshotPath = useMemo(() => (snapshot ? toPath(snapshot) : null), [snapshot]);
  const peak = useMemo(() => peakRate(inputs), [inputs]);

  const update = (key: keyof RatesInputs) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputs((prev) => ({ ...prev, [key]: Number(e.target.value) }));

  return (
    <>
      <ActiveBuildBanner />
      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="rounded-2xl border border-line-strong bg-bg-panel/70 p-6">
        <div className="flex items-center justify-between">
          <span className="font-hud text-xs uppercase tracking-[0.15em] text-phosphor-dim">Rates</span>
          {suggestedPreset && (
            <button
              type="button"
              onClick={loadSuggested}
              className="font-hud text-[11px] uppercase tracking-[0.15em] text-phosphor-dim hover:text-phosphor"
            >
              โหลด rates สำหรับ {activeProfile?.flyingStyle}
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {starterPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setInputs({ rcRate: preset.rcRate, superRate: preset.superRate, expo: preset.expo })}
              className="font-hud rounded-full border border-line px-3 py-1.5 text-[11px] text-muted hover:border-phosphor hover:text-phosphor"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <label className="mt-5 block text-sm text-muted">
          RC Rate: <span className="font-hud text-ink">{inputs.rcRate.toFixed(2)}</span>
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.01}
            value={inputs.rcRate}
            onChange={update("rcRate")}
            className="mt-2 w-full accent-phosphor"
          />
        </label>

        <label className="mt-5 block text-sm text-muted">
          Super Rate: <span className="font-hud text-ink">{inputs.superRate.toFixed(2)}</span>
          <input
            type="range"
            min={0}
            max={0.95}
            step={0.01}
            value={inputs.superRate}
            onChange={update("superRate")}
            className="mt-2 w-full accent-phosphor"
          />
        </label>

        <label className="mt-5 block text-sm text-muted">
          Expo: <span className="font-hud text-ink">{inputs.expo.toFixed(2)}</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={inputs.expo}
            onChange={update("expo")}
            className="mt-2 w-full accent-phosphor"
          />
        </label>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSnapshot(inputs)}
            className="font-hud rounded-md border border-line-strong px-4 py-2 text-xs uppercase tracking-[0.15em] text-phosphor hover:bg-phosphor hover:text-[#04140b]"
          >
            Snapshot ไว้เทียบ
          </button>
          {snapshot && (
            <button
              type="button"
              onClick={() => setSnapshot(null)}
              className="font-hud rounded-md border border-line px-4 py-2 text-xs uppercase tracking-[0.15em] text-muted hover:border-danger hover:text-danger"
            >
              ล้าง snapshot
            </button>
          )}
        </div>

        <div className="mt-6 rounded-lg border border-line px-4 py-3">
          <p className="font-hud text-[10px] uppercase tracking-[0.15em] text-phosphor-dim">Peak rate (full stick)</p>
          <p className="font-hud mt-1 text-2xl text-phosphor">{Math.round(peak)}°/s</p>
        </div>
      </div>

      <div className="rounded-2xl border border-line-strong bg-bg-panel/70 p-6">
        <div className="flex items-center justify-between">
          <span className="font-hud text-xs uppercase tracking-[0.15em] text-phosphor-dim">Stick → rotation rate</span>
          <div className="font-hud flex items-center gap-3 text-[11px] text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 bg-phosphor" /> current
            </span>
            {snapshotPath && (
              <span className="flex items-center gap-1.5">
                <span className="h-0.5 w-4 bg-amber" style={{ backgroundImage: "repeating-linear-gradient(to right, var(--amber) 0 4px, transparent 4px 7px)" }} />
                snapshot
              </span>
            )}
          </div>
        </div>

        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="mt-4 w-full" role="img" aria-label="Rates curve chart: stick position versus rotation rate in degrees per second">
          <line x1={PAD} y1={VIEW_H / 2} x2={VIEW_W - PAD} y2={VIEW_H / 2} stroke="var(--line-strong)" strokeWidth={1} />
          <line x1={VIEW_W / 2} y1={PAD} x2={VIEW_W / 2} y2={VIEW_H - PAD} stroke="var(--line)" strokeWidth={1} />
          {snapshotPath && (
            <path d={snapshotPath} fill="none" stroke="var(--amber)" strokeWidth={2} strokeDasharray="4 4" opacity={0.8} />
          )}
          <path d={path} fill="none" stroke="var(--phosphor)" strokeWidth={2.5} />
        </svg>

        <div className="font-hud mt-2 flex justify-between text-[10px] uppercase tracking-[0.15em] text-muted">
          <span>full left</span>
          <span>center</span>
          <span>full right</span>
        </div>

        <p className="mt-5 text-xs text-muted">
          กราฟคำนวณจากสูตร Actual Rates ของ Betaflight จริง (RC Rate × Expo × Super Rate)
          ลองปรับแล้วเทียบ feel ก่อนเอาไปตั้งในเครื่องบินจริง
        </p>
      </div>
    </div>
    </>
  );
}
