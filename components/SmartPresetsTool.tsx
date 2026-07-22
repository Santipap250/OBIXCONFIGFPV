"use client";

import { useState } from "react";
import { starterPresets, buildPresetCli, type SavedPreset } from "@/lib/presets";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { encodeSharedPreset, type SharedPresetPayload } from "@/lib/shareEncoding";
import { useBuildProfiles } from "@/lib/useBuildProfiles";
import ActiveBuildBanner from "./ActiveBuildBanner";

const STORAGE_KEY = "saved-presets-v1";

export default function SmartPresetsTool({ incomingShared }: { incomingShared?: SharedPresetPayload }) {
  const { activeProfile } = useBuildProfiles();
  const [activeId, setActiveId] = useState(starterPresets[0].id);
  const [saved, setSaved] = useLocalStorage<SavedPreset[]>(STORAGE_KEY, []);
  const [copied, setCopied] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [importedNotice, setImportedNotice] = useState(false);

  const active = starterPresets.find((p) => p.id === activeId) ?? starterPresets[0];
  const cli = buildPresetCli(active);

  const suggestedForBuild = activeProfile?.flyingStyle
    ? starterPresets.find((p) => p.style === activeProfile.flyingStyle)
    : undefined;

  const handleShare = () => {
    const encoded = encodeSharedPreset({ name: nameDraft.trim() || active.label, cliSnippet: cli, style: active.style });
    setShareUrl(`${window.location.origin}/tools/presets?shared=${encoded}`);
    setLinkCopied(false);
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 1800);
    } catch {
      setLinkCopied(false);
    }
  };

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
      buildProfileName: activeProfile?.name,
    };
    setSaved([entry, ...saved].slice(0, 20));
    setNameDraft("");
  };

  const handleDelete = (id: string) => setSaved(saved.filter((p) => p.id !== id));

  const handleImportShared = () => {
    if (!incomingShared) return;
    const entry: SavedPreset = {
      id: `${Date.now()}`,
      name: incomingShared.name,
      createdAt: new Date().toISOString(),
      cliSnippet: incomingShared.cliSnippet,
    };
    setSaved([entry, ...saved].slice(0, 20));
    setImportedNotice(true);
    setTimeout(() => setImportedNotice(false), 2500);
  };

  return (
    <div className="mt-10 space-y-6">
      <ActiveBuildBanner />
      {incomingShared && (
        <div className="rounded-2xl border border-phosphor/40 bg-phosphor/5 p-6">
          <span className="font-hud text-xs uppercase tracking-[0.15em] text-phosphor-dim">
            พรีเซ็ตที่มีคนแชร์มาให้ (จากลิงก์)
          </span>
          <p className="font-display mt-2 text-lg font-medium text-ink">{incomingShared.name}</p>
          <p className="font-hud mt-1 text-[11px] uppercase tracking-[0.15em] text-muted">{incomingShared.style}</p>
          <pre className="font-hud mt-3 overflow-x-auto rounded-lg border border-line bg-[#04120b] p-4 text-xs leading-relaxed text-phosphor">
{incomingShared.cliSnippet}
          </pre>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleImportShared}
              className="font-hud rounded-md border border-line-strong px-4 py-2 text-xs uppercase tracking-[0.15em] text-phosphor hover:bg-phosphor hover:text-[#04140b]"
            >
              บันทึกเข้าพรีเซ็ตของฉัน
            </button>
            {importedNotice && <span className="font-hud text-xs text-phosphor">บันทึกแล้ว</span>}
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-2xl border border-line-strong bg-bg-panel/70 p-6">
          <div className="flex items-center justify-between">
            <span className="font-hud text-xs uppercase tracking-[0.15em] text-phosphor-dim">Starter presets</span>
            {suggestedForBuild && (
              <button
                type="button"
                onClick={() => setActiveId(suggestedForBuild.id)}
                className="font-hud text-[11px] uppercase tracking-[0.15em] text-phosphor-dim hover:text-phosphor"
              >
                ใช้ที่แนะนำสำหรับ build นี้
              </button>
            )}
          </div>
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="font-hud rounded-md border border-line-strong px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-phosphor hover:bg-phosphor hover:text-[#04140b]"
              >
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="font-hud rounded-md border border-line-strong px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-ink hover:border-phosphor hover:text-phosphor"
              >
                Share
              </button>
            </div>
          </div>
          <pre className="font-hud mt-3 overflow-x-auto rounded-lg border border-line bg-[#04120b] p-4 text-xs leading-relaxed text-phosphor">
{cli}
          </pre>

          {shareUrl && (
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-phosphor/40 bg-phosphor/5 px-3 py-2">
              <span className="font-hud break-all text-xs text-phosphor">{shareUrl}</span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="font-hud shrink-0 text-[11px] uppercase tracking-[0.15em] text-phosphor-dim hover:text-phosphor"
              >
                {linkCopied ? "Copied" : "Copy link"}
              </button>
            </div>
          )}

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
                    <span className="text-sm text-ink">
                      {preset.name}
                      {preset.buildProfileName && (
                        <span className="font-hud ml-2 text-[10px] uppercase tracking-[0.15em] text-muted">
                          · {preset.buildProfileName}
                        </span>
                      )}
                    </span>
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
            บันทึกไว้ในเครื่องนี้เท่านั้น (localStorage) — กด &quot;Share&quot; เพื่อสร้างลิงก์ที่ข้อมูลทั้งหมดฝังอยู่ในตัวลิงก์เอง
            ไม่มี server เก็บอะไรเลย ไม่ต้องมีบัญชี
          </p>
        </div>
      </div>
    </div>
  );
}
