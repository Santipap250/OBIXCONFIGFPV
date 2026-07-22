"use client";

import { useState } from "react";
import { useBuildProfiles } from "@/lib/useBuildProfiles";
import { flyingStyleLabels } from "@/lib/buildProfile";
import type { BuildProfile, BuildProfileInput } from "@/lib/buildProfile";
import BuildProfileForm from "./BuildProfileForm";

export default function BuildProfileManager() {
  const { profiles, activeId, create, update, remove, setActive } = useBuildProfiles();
  const [mode, setMode] = useState<{ type: "list" } | { type: "create" } | { type: "edit"; profile: BuildProfile }>({
    type: "list",
  });

  const handleCreate = (input: BuildProfileInput) => {
    create(input);
    setMode({ type: "list" });
  };

  const handleEdit = (input: BuildProfileInput) => {
    if (mode.type === "edit") update(mode.profile.id, input);
    setMode({ type: "list" });
  };

  if (mode.type === "create") {
    return <BuildProfileForm onSubmit={handleCreate} onCancel={() => setMode({ type: "list" })} />;
  }
  if (mode.type === "edit") {
    return (
      <BuildProfileForm
        initial={mode.profile}
        onSubmit={handleEdit}
        onCancel={() => setMode({ type: "list" })}
      />
    );
  }

  return (
    <div className="rounded-2xl border border-line-strong bg-bg-panel/70 p-6">
      <div className="flex items-center justify-between">
        <span className="font-hud text-xs uppercase tracking-[0.15em] text-phosphor-dim">My Builds ({profiles.length})</span>
        <button
          type="button"
          onClick={() => setMode({ type: "create" })}
          className="font-hud rounded-md border border-line-strong px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] text-phosphor hover:bg-phosphor hover:text-[#04140b]"
        >
          + New build
        </button>
      </div>

      {profiles.length === 0 ? (
        <p className="mt-4 text-sm text-muted">
          ยังไม่มี build profile — สร้างชุดแรกแล้วเครื่องมือต่าง ๆ จะเริ่มใช้ข้อมูลชุดเดียวกัน
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {profiles.map((profile) => (
            <li
              key={profile.id}
              className={`rounded-lg border px-4 py-3 ${
                activeId === profile.id ? "border-phosphor bg-phosphor/10" : "border-line"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-display text-sm font-medium text-ink">
                    {profile.name}
                    {activeId === profile.id && (
                      <span className="font-hud ml-2 rounded-full border border-phosphor/40 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-phosphor">
                        Active
                      </span>
                    )}
                  </p>
                  <p className="font-hud mt-1 text-[11px] text-muted">
                    {[
                      profile.frameSizeInches ? `${profile.frameSizeInches}"` : null,
                      profile.motorKv ? `${profile.motorKv}KV` : null,
                      profile.batteryCells ? `${profile.batteryCells}S` : null,
                      profile.flyingStyle ? flyingStyleLabels[profile.flyingStyle] : null,
                    ]
                      .filter(Boolean)
                      .join(" · ") || "ยังไม่มีรายละเอียด"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {activeId !== profile.id && (
                    <button
                      type="button"
                      onClick={() => setActive(profile.id)}
                      className="font-hud text-[11px] uppercase tracking-[0.15em] text-phosphor-dim hover:text-phosphor"
                    >
                      Set active
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setMode({ type: "edit", profile })}
                    className="font-hud text-[11px] uppercase tracking-[0.15em] text-muted hover:text-ink"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(profile.id)}
                    className="font-hud text-[11px] uppercase tracking-[0.15em] text-muted hover:text-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
