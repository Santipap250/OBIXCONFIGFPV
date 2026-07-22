"use client";

import { useMemo, useState } from "react";
import { calculateBuild } from "@/lib/buildHelper";
import { useBuildProfiles } from "@/lib/useBuildProfiles";
import ActiveBuildBanner from "./ActiveBuildBanner";

export default function BuildHelperTool() {
  const { activeProfile } = useBuildProfiles();
  const [auwGrams, setAuwGrams] = useState(650);
  const [cells, setCells] = useState(4);
  const [escAmpRating, setEscAmpRating] = useState(45);
  const [motorMaxAmp, setMotorMaxAmp] = useState(38);

  const loadFromActiveBuild = () => {
    if (!activeProfile) return;
    if (activeProfile.auwGrams) setAuwGrams(activeProfile.auwGrams);
    if (activeProfile.batteryCells) setCells(activeProfile.batteryCells);
    if (activeProfile.escAmpRating) setEscAmpRating(activeProfile.escAmpRating);
    if (activeProfile.motorMaxAmp) setMotorMaxAmp(activeProfile.motorMaxAmp);
  };

  const result = useMemo(
    () => calculateBuild({ auwGrams, cells, escAmpRating, motorMaxAmp, motorCount: 4 }),
    [auwGrams, cells, escAmpRating, motorMaxAmp]
  );

  const classColor =
    result.powerClass === "freestyle" ? "text-phosphor" : result.powerClass === "all-round" ? "text-amber" : "text-ink";

  return (
    <>
      <ActiveBuildBanner />
    <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="rounded-2xl border border-line-strong bg-bg-panel/70 p-6">
        <div className="flex items-center justify-between">
          <span className="font-hud text-xs uppercase tracking-[0.15em] text-phosphor-dim">Build inputs</span>
          {activeProfile && (
            <button
              type="button"
              onClick={loadFromActiveBuild}
              className="font-hud text-[11px] uppercase tracking-[0.15em] text-phosphor-dim hover:text-phosphor"
            >
              โหลดจาก Active Build
            </button>
          )}
        </div>

        <label className="mt-5 block text-sm text-muted">
          น้ำหนักรวม AUW (กรัม): <span className="font-hud text-ink">{auwGrams}g</span>
          <input
            type="range"
            min={150}
            max={1500}
            step={10}
            value={auwGrams}
            onChange={(e) => setAuwGrams(Number(e.target.value))}
            className="mt-2 w-full accent-phosphor"
          />
        </label>

        <fieldset className="mt-5">
          <legend className="text-sm text-muted">แบตเตอรี่</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {[3, 4, 6, 8].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setCells(s)}
                aria-pressed={cells === s}
                className={`font-hud rounded-md border px-3 py-1.5 text-xs ${
                  cells === s ? "border-phosphor bg-phosphor/10 text-phosphor" : "border-line text-muted"
                }`}
              >
                {s}S
              </button>
            ))}
          </div>
        </fieldset>

        <label className="mt-5 block text-sm text-muted">
          ESC continuous rating ต่อตัว (A): <span className="font-hud text-ink">{escAmpRating}A</span>
          <input
            type="range"
            min={10}
            max={80}
            step={1}
            value={escAmpRating}
            onChange={(e) => setEscAmpRating(Number(e.target.value))}
            className="mt-2 w-full accent-phosphor"
          />
        </label>

        <label className="mt-5 block text-sm text-muted">
          มอเตอร์ continuous max (A, จาก datasheet): <span className="font-hud text-ink">{motorMaxAmp}A</span>
          <input
            type="range"
            min={10}
            max={80}
            step={1}
            value={motorMaxAmp}
            onChange={(e) => setMotorMaxAmp(Number(e.target.value))}
            className="mt-2 w-full accent-phosphor"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-line-strong bg-bg-panel/70 p-6">
        <span className="font-hud text-xs uppercase tracking-[0.15em] text-phosphor-dim">Power profile</span>

        <div className="mt-4 grid grid-cols-2 gap-3 font-hud text-sm sm:grid-cols-4">
          <div className="rounded-lg border border-line px-3 py-2">
            <p className="text-[10px] uppercase tracking-[0.15em] text-phosphor-dim">Nominal V</p>
            <p className="mt-1 text-lg text-ink">{result.nominalVoltage.toFixed(1)}v</p>
          </div>
          <div className="rounded-lg border border-line px-3 py-2">
            <p className="text-[10px] uppercase tracking-[0.15em] text-phosphor-dim">Max V</p>
            <p className="mt-1 text-lg text-ink">{result.maxVoltage.toFixed(1)}v</p>
          </div>
          <div className="rounded-lg border border-line px-3 py-2">
            <p className="text-[10px] uppercase tracking-[0.15em] text-phosphor-dim">Total power</p>
            <p className="mt-1 text-lg text-phosphor">{Math.round(result.totalPowerWatts)}W</p>
          </div>
          <div className="rounded-lg border border-line px-3 py-2">
            <p className="text-[10px] uppercase tracking-[0.15em] text-phosphor-dim">Power/weight</p>
            <p className="mt-1 text-lg text-amber">{result.powerToWeight.toFixed(1)} W/g</p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-line-strong px-5 py-4">
          <p className="font-hud text-[11px] uppercase tracking-[0.15em] text-phosphor-dim">Suitability</p>
          <p className={`font-display mt-1 text-xl font-medium ${classColor}`}>{result.powerClassLabel}</p>
          <p className="mt-2 text-xs text-muted">
            อ้างอิงเกณฑ์ community: ≥5.5 W/g = freestyle/racing, 3.5–5.5 W/g = all-round/cinematic, ต่ำกว่านั้น = เน้นความทนทาน/long range
          </p>
        </div>

        {(result.warnings.length > 0 || result.notes.length > 0) && (
          <div className="mt-5 space-y-2">
            {result.warnings.map((w) => (
              <div key={w} className="rounded-lg border border-danger/40 bg-danger/5 px-4 py-3 text-sm text-danger">
                ⚠ {w}
              </div>
            ))}
            {result.notes.map((n) => (
              <div key={n} className="rounded-lg border border-line px-4 py-3 text-sm text-muted">
                {n}
              </div>
            ))}
          </div>
        )}

        <p className="mt-5 text-xs text-muted">
          คำนวณจากไฟฟ้าจริง (แรงดัน × กระแส ÷ น้ำหนัก) ไม่ใช่แรงขับจริงของมอเตอร์ตัวใดตัวหนึ่ง
          เพราะแรงขับขึ้นกับกราฟ thrust curve เฉพาะของมอเตอร์+ใบพัดแต่ละรุ่นซึ่งต้องอ้างอิงจาก datasheet โดยตรง
        </p>
      </div>
    </div>
    </>
  );
}
