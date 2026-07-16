"use client";

import { useState } from "react";
import { starterPresets, buildPresetCli, type SavedPreset } from "@/lib/presets";
import { useLocalStorage } from "@/lib/useLocalStorage";

const STORAGE_KEY = "saved-presets-v1";

export default function SmartPresetsTool() {
  const [activeId, setActiveId] = useState(starterPresets[0].id);
  const [saved, setSaved] = useLocalStorage<SavedPreset[]>(STORAGE_KEY, []);
  const [copied, setCopied] = useState(false);
  const [nameDraft, setNameDraft] = useState("");

  const active = starterPresets.find((p) => p.id === activeId) ?? starterPresets[0];
  const cli = buildPresetCli(active);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cli);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleSave = () => {
    const name = nameDraft.trim() || active.label;
    const entry: SavedPreset = {
      id: `${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      cliSnippet: cli,
    };
    setSaved([entry, ...saved].slice(0, 20));
    setNameDraft("");
  };

  const handleDelete = (id: string) => setSaved(saved.filter((p) => p.id !== id));

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="rounded-2xl border border-line-strong bg-bg-panel/70 p-6">
        <span className="font-hud text-xs uppercase tracking-[0.15em] text-phosphor-dim">Starter presets</span>
        <div className="mt-4 flex flex-col gap-2">
          {starterPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setActiveId(preset.id)}
              aria-pressed={activeId === preset.id}
              className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                activeId === preset.id ? "border-phosphor bg-phosphor/10" : "border-line hover:border-line-strong"
              }`}
            >
              <p className="font-display text-sm font-medium text-ink">{preset.label}</p>
              <p className="font-hud mt-1 text-[11px] text-muted">
                {preset.motorKv}KV · {preset.cells}S · rcRate {preset.rcRate}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-6">
          <span className="font-hud text-[11px] uppercase tracking-[0.15em] text-phosphor-dim">บันทึกเป็นพรีเซ็ตของฉัน</span>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              placeholder={active.label}
              className="w-full rounded-md border border-line bg-transparent px-3 py-2 text-sm text-ink placeholder:text-muted"
            />
            <button
              type="button"
              onClick={handleSave}
              className="font-hud shrink-0 rounded-md border border-line-strong px-4 py-2 text-xs uppercase tracking-[0.15em] text-phosphor hover:bg-phosphor hover:text-[#04140b]"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-line-strong bg-bg-panel/70 p-6">
        <div className="flex items-center justify-between">
          <span className="font-hud text-xs uppercase tracking-[0.15em] text-phosphor-dim">{active.label} — CLI</span>
          <button
            type="button"
            onClick={handleCopy}
            className="font-hud rounded-md border border-line-strong px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-phosphor hover:bg-phosphor hover:text-[#04140b]"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre className="font-hud mt-3 overflow-x-auto rounded-lg border border-line bg-[#04120b] p-4 text-xs leading-relaxed text-phosphor">
{cli}
        </pre>

        <div className="mt-6">
          <span className="font-hud text-[11px] uppercase tracking-[0.15em] text-phosphor-dim">
            พรีเซ็ตที่บันทึกไว้ ({saved.length})
          </span>
          {saved.length === 0 ? (
            <p className="mt-2 text-sm text-muted">ยังไม่มีพรีเซ็ตที่บันทึกไว้ในเครื่องนี้</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {saved.map((preset) => (
                <li key={preset.id} className="flex items-center justify-between rounded-lg border border-line px-3 py-2">
                  <span className="text-sm text-ink">{preset.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(preset.cliSnippet).catch(() => {})}
                      className="font-hud text-[11px] uppercase tracking-[0.15em] text-phosphor-dim hover:text-phosphor"
                    >
                      Copy
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(preset.id)}
                      className="font-hud text-[11px] uppercase tracking-[0.15em] text-muted hover:text-danger"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-5 text-xs text-muted">
          พรีเซ็ตเริ่มต้นคำนวณจากเครื่องมือเดียวกับ PID Advisor และ Rates Visualizer
          บันทึกไว้ในเครื่องนี้เท่านั้น (localStorage) — cloud sync ข้ามอุปกรณ์เป็นแผนในเฟสถัดไป
        </p>
      </div>
    </div>
  );
}
