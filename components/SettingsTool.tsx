"use client";

import { useRef, useState } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { exportAllData, importAllData, clearAllData } from "@/lib/storage";
import type { SavedPreset } from "@/lib/presets";
import ToolIcon from "./icons/ToolIcon";

export default function SettingsTool() {
  const [checklist] = useLocalStorage<Record<string, boolean>>("flight-readiness-v1", {});
  const [savedPresets] = useLocalStorage<SavedPreset[]>("saved-presets-v1", []);
  const [status, setStatus] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const checklistCheckedCount = Object.values(checklist).filter(Boolean).length;

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `obixconfigfpv-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus("ดาวน์โหลดไฟล์สำรองข้อมูลแล้ว");
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result ?? "{}"));
        importAllData(data);
        setStatus("นำเข้าข้อมูลสำเร็จ");
      } catch {
        setStatus("ไฟล์ไม่ถูกต้อง นำเข้าไม่สำเร็จ");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    clearAllData();
    setConfirmClear(false);
    setStatus("ล้างข้อมูลในเครื่องนี้ทั้งหมดแล้ว");
  };

  return (
    <div className="mt-10 space-y-6">
      <div className="tool-card hud-corners rounded-2xl border border-line-strong p-6">
        <span className="font-hud text-xs uppercase tracking-[0.15em] text-phosphor-dim">
          ข้อมูลที่เก็บไว้ในเครื่องนี้
        </span>
        <div className="mt-4 grid grid-cols-2 gap-3 font-hud text-sm">
          <div
            style={{ "--tool-color": "var(--tool-flight)" } as React.CSSProperties}
            className="flex items-center gap-3 rounded-lg border border-line px-4 py-3"
          >
            <ToolIcon tool="flight" size={26} />
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted">Flight checklist</p>
              <p className="mt-1 text-lg text-ink">{checklistCheckedCount} ข้อที่เช็คไว้</p>
            </div>
          </div>
          <div
            style={{ "--tool-color": "var(--tool-presets)" } as React.CSSProperties}
            className="flex items-center gap-3 rounded-lg border border-line px-4 py-3"
          >
            <ToolIcon tool="presets" size={26} />
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted">Saved presets</p>
              <p className="mt-1 text-lg text-ink">{savedPresets.length} รายการ</p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-xs text-muted">
          ข้อมูลทั้งหมดเก็บใน localStorage ของเบราว์เซอร์นี้เท่านั้น ยังไม่มีระบบบัญชีผู้ใช้หรือ cloud sync
          ถ้าเปลี่ยนเครื่อง/เบราว์เซอร์ ต้อง export แล้วนำไป import เอง
        </p>
      </div>

      <div className="tool-card hud-corners rounded-2xl border border-line-strong p-6">
        <span className="font-hud text-xs uppercase tracking-[0.15em] text-phosphor-dim">สำรอง / ย้ายข้อมูล</span>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="font-hud rounded-md border border-line-strong px-4 py-2 text-xs uppercase tracking-[0.15em] text-phosphor hover:bg-phosphor hover:text-[#04140b]"
          >
            Export เป็นไฟล์ .json
          </button>
          <button
            type="button"
            onClick={handleImportClick}
            className="font-hud rounded-md border border-line-strong px-4 py-2 text-xs uppercase tracking-[0.15em] text-ink hover:border-phosphor hover:text-phosphor"
          >
            Import จากไฟล์ .json
          </button>
          <input ref={fileInputRef} type="file" accept=".json,application/json" onChange={handleImportFile} className="hidden" />
        </div>
      </div>

      <div
        style={{ "--tool-color": "var(--danger)" } as React.CSSProperties}
        className="tool-card hud-corners rounded-2xl border border-danger/40 bg-danger/5 p-6"
      >
        <span className="font-hud text-xs uppercase tracking-[0.15em] text-danger">ล้างข้อมูลทั้งหมด</span>
        <p className="mt-2 text-sm text-muted">
          ลบเช็คลิสต์และพรีเซ็ตที่บันทึกไว้ในเครื่องนี้ทั้งหมด แนะนำให้ export สำรองไว้ก่อน — กู้คืนไม่ได้หลังลบ
        </p>
        <button
          type="button"
          onClick={handleClear}
          className={`font-hud mt-4 rounded-md border px-4 py-2 text-xs uppercase tracking-[0.15em] ${
            confirmClear ? "border-danger bg-danger/10 text-danger" : "border-line-strong text-muted hover:text-danger"
          }`}
        >
          {confirmClear ? "ยืนยันอีกครั้ง — ลบถาวร" : "ล้างข้อมูลทั้งหมด"}
        </button>
      </div>

      {status && <p className="font-hud text-xs text-phosphor-dim">{status}</p>}
    </div>
  );
}
