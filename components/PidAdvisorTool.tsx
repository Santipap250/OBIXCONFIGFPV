"use client";

import { useMemo, useState } from "react";
import { calculatePid, type FlyingStyle } from "@/lib/pidAdvisor";

const styles: { value: FlyingStyle; label: string }[] = [
  { value: "freestyle", label: "Freestyle" },
  { value: "cinematic", label: "Cinematic" },
  { value: "longrange", label: "Long range" },
  { value: "micro", label: "Micro" },
];

export default function PidAdvisorTool() {
  const [propSizeInches, setPropSizeInches] = useState(5);
  const [motorKv, setMotorKv] = useState(1700);
  const [cells, setCells] = useState(4);
  const [style, setStyle] = useState<FlyingStyle>("freestyle");
  const [copied, setCopied] = useState(false);

  const result = useMemo(
    () => calculatePid({ propSizeInches, motorKv, cells, style }),
    [propSizeInches, motorKv, cells, style]
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.cliSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      {/* Inputs */}
      <div className="rounded-2xl border border-line-strong bg-bg-panel/70 p-6">
        <span className="font-hud text-xs uppercase tracking-[0.15em] text-phosphor-dim">Build inputs</span>

        <label className="mt-5 block text-sm text-muted">
          ขนาด Prop: <span className="font-hud text-ink">{propSizeInches}&quot;</span>
          <input
            type="range"
            min={2.5}
            max={7}
            step={0.5}
            value={propSizeInches}
            onChange={(e) => setPropSizeInches(Number(e.target.value))}
            className="mt-2 w-full accent-phosphor"
          />
        </label>

        <label className="mt-5 block text-sm text-muted">
          มอเตอร์ KV: <span className="font-hud text-ink">{motorKv}</span>
          <input
            type="range"
            min={900}
            max={3000}
            step={50}
            value={motorKv}
            onChange={(e) => setMotorKv(Number(e.target.value))}
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

        <fieldset className="mt-5">
          <legend className="text-sm text-muted">สไตล์การบิน</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {styles.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setStyle(s.value)}
                aria-pressed={style === s.value}
                className={`font-hud rounded-md border px-3 py-1.5 text-xs ${
                  style === s.value ? "border-phosphor bg-phosphor/10 text-phosphor" : "border-line text-muted"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Results */}
      <div className="rounded-2xl border border-line-strong bg-bg-panel/70 p-6">
        <span className="font-hud text-xs uppercase tracking-[0.15em] text-phosphor-dim">Suggested baseline</span>

        <div className="mt-4 grid grid-cols-3 gap-3 font-hud text-center text-sm">
          {(["roll", "pitch"] as const).map((axis) => (
            <div key={axis} className="col-span-3 grid grid-cols-3 gap-3 sm:col-span-1">
              <div className="rounded-lg border border-line px-2 py-2">
                <p className="text-[10px] uppercase tracking-[0.15em] text-phosphor-dim">{axis} P</p>
                <p className="mt-1 text-lg text-phosphor">{result[axis].p}</p>
              </div>
              <div className="rounded-lg border border-line px-2 py-2">
                <p className="text-[10px] uppercase tracking-[0.15em] text-phosphor-dim">{axis} I</p>
                <p className="mt-1 text-lg text-ink">{result[axis].i}</p>
              </div>
              <div className="rounded-lg border border-line px-2 py-2">
                <p className="text-[10px] uppercase tracking-[0.15em] text-phosphor-dim">{axis} D</p>
                <p className="mt-1 text-lg text-amber">{result[axis].d}</p>
              </div>
            </div>
          ))}
          <div className="col-span-3 grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-line px-2 py-2">
              <p className="text-[10px] uppercase tracking-[0.15em] text-phosphor-dim">yaw P</p>
              <p className="mt-1 text-lg text-phosphor">{result.yaw.p}</p>
            </div>
            <div className="rounded-lg border border-line px-2 py-2">
              <p className="text-[10px] uppercase tracking-[0.15em] text-phosphor-dim">D_min</p>
              <p className="mt-1 text-lg text-amber">{result.dMin}</p>
            </div>
            <div className="rounded-lg border border-line px-2 py-2">
              <p className="text-[10px] uppercase tracking-[0.15em] text-phosphor-dim">FF</p>
              <p className="mt-1 text-lg text-ink">{result.feedforward}</p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <span className="font-hud text-[11px] uppercase tracking-[0.15em] text-phosphor-dim">เหตุผลของค่าเหล่านี้</span>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted">
            {result.reasons.map((reason) => (
              <li key={reason}>· {reason}</li>
            ))}
          </ul>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <span className="font-hud text-[11px] uppercase tracking-[0.15em] text-phosphor-dim">Betaflight CLI</span>
            <button
              type="button"
              onClick={handleCopy}
              className="font-hud rounded-md border border-line-strong px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-phosphor hover:bg-phosphor hover:text-[#04140b]"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="font-hud mt-2 overflow-x-auto rounded-lg border border-line bg-[#04120b] p-4 text-xs leading-relaxed text-phosphor">
{result.cliSnippet}
          </pre>
        </div>

        <p className="mt-4 text-xs text-muted">
          ค่านี้คือจุดเริ่มต้นจาก heuristic ที่อ้างอิงความสัมพันธ์จริงของ prop/มอเตอร์/เซลล์แบต
          ไม่ใช่คำตอบสุดท้าย — ควรทดลองบินและปรับตาม feel จริงหรือใช้ร่วมกับ Blackbox Analyzer เมื่อพร้อมใช้งาน
        </p>
      </div>
    </div>
  );
}
