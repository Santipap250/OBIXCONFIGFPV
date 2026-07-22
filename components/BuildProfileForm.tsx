"use client";

import { useState } from "react";
import type { BuildProfileInput } from "@/lib/buildProfile";
import { emptyBuildProfileInput, flyingStyleLabels } from "@/lib/buildProfile";
import type { FlyingStyle } from "@/lib/pidAdvisor";

const TEXT_FIELDS: { key: keyof BuildProfileInput; label: string }[] = [
  { key: "frame", label: "Frame" },
  { key: "motor", label: "Motor" },
  { key: "propeller", label: "Propeller" },
  { key: "esc", label: "ESC" },
  { key: "fc", label: "Flight Controller" },
  { key: "firmware", label: "Firmware" },
  { key: "receiver", label: "Receiver" },
  { key: "vtx", label: "VTX" },
  { key: "camera", label: "Camera" },
];

export default function BuildProfileForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: BuildProfileInput;
  onSubmit: (input: BuildProfileInput) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<BuildProfileInput>(initial ?? emptyBuildProfileInput);

  const setField = <K extends keyof BuildProfileInput>(key: K, value: BuildProfileInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-line-strong bg-bg-panel/70 p-6">
      <label className="block text-sm text-muted">
        ชื่อ build (จำเป็น)
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
          placeholder="เช่น Freestyle 5in หลัก"
          className="mt-1 w-full rounded-md border border-line bg-transparent px-3 py-2 text-sm text-ink placeholder:text-muted"
        />
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {TEXT_FIELDS.map((field) => (
          <label key={field.key} className="block text-sm text-muted">
            {field.label}
            <input
              type="text"
              value={(form[field.key] as string) ?? ""}
              onChange={(e) => setField(field.key, e.target.value)}
              className="mt-1 w-full rounded-md border border-line bg-transparent px-3 py-2 text-sm text-ink"
            />
          </label>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <label className="block text-sm text-muted">
          Frame size (นิ้ว)
          <input
            type="number"
            step={0.5}
            value={form.frameSizeInches ?? ""}
            onChange={(e) => setField("frameSizeInches", Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-line bg-transparent px-3 py-2 text-sm text-ink"
          />
        </label>
        <label className="block text-sm text-muted">
          Motor KV
          <input
            type="number"
            value={form.motorKv ?? ""}
            onChange={(e) => setField("motorKv", Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-line bg-transparent px-3 py-2 text-sm text-ink"
          />
        </label>
        <label className="block text-sm text-muted">
          แบต (S)
          <input
            type="number"
            value={form.batteryCells ?? ""}
            onChange={(e) => setField("batteryCells", Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-line bg-transparent px-3 py-2 text-sm text-ink"
          />
        </label>
        <label className="block text-sm text-muted">
          แบต capacity (mAh)
          <input
            type="number"
            value={form.batteryCapacityMah ?? ""}
            onChange={(e) => setField("batteryCapacityMah", Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-line bg-transparent px-3 py-2 text-sm text-ink"
          />
        </label>
        <label className="block text-sm text-muted sm:col-span-2">
          สไตล์การบิน
          <select
            value={form.flyingStyle}
            onChange={(e) => setField("flyingStyle", e.target.value as FlyingStyle)}
            className="mt-1 w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-ink"
          >
            {(Object.keys(flyingStyleLabels) as FlyingStyle[]).map((style) => (
              <option key={style} value={style}>
                {flyingStyleLabels[style]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 block text-sm text-muted">
        Notes
        <textarea
          value={form.notes ?? ""}
          onChange={(e) => setField("notes", e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-md border border-line bg-transparent px-3 py-2 text-sm text-ink"
        />
      </label>

      <div className="mt-5 flex gap-3">
        <button
          type="submit"
          className="font-hud rounded-md border border-line-strong px-4 py-2 text-xs uppercase tracking-[0.15em] text-phosphor hover:bg-phosphor hover:text-[#04140b]"
        >
          บันทึก
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="font-hud rounded-md border border-line px-4 py-2 text-xs uppercase tracking-[0.15em] text-muted hover:text-ink"
        >
          ยกเลิก
        </button>
      </div>
    </form>
  );
}
