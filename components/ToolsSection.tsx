"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "./Reveal";
import { tools, statusLabel } from "@/lib/tools";

export default function ToolsSection() {
  const [activeSlug, setActiveSlug] = useState(tools[0].slug);
  const active = tools.find((t) => t.slug === activeSlug) ?? tools[0];

  return (
    <section id="tools" className="container-hud py-20">
      <Reveal>
        <span className="font-hud text-xs uppercase tracking-[0.2em] text-phosphor-dim">Core tools</span>
        <h2 className="font-display mt-3 max-w-xl text-3xl font-semibold text-ink md:text-4xl">
          A toolkit that mirrors real FPV workflows
        </h2>
        <p className="mt-3 max-w-lg text-muted">
          Six instruments, one shared data model — each one built to hand off
          straight into the next.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, i) => (
          <Reveal key={tool.slug} delay={i * 40}>
            <button
              type="button"
              onClick={() => setActiveSlug(tool.slug)}
              aria-pressed={activeSlug === tool.slug}
              className={`w-full rounded-xl border px-4 py-4 text-left transition-colors ${
                activeSlug === tool.slug
                  ? "border-phosphor bg-phosphor/10"
                  : "border-line hover:border-line-strong"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-hud text-xs tracking-[0.15em] text-phosphor-dim">{tool.badge}</span>
                <span className="font-hud text-[10px] uppercase tracking-[0.15em] text-muted">
                  {statusLabel[tool.status]}
                </span>
              </div>
              <h3 className="font-display mt-2 text-lg font-medium text-ink">{tool.title}</h3>
              <p className="mt-1 text-sm text-muted">{tool.short}</p>
            </button>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-8 rounded-2xl border border-line-strong bg-bg-panel/70 p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="font-hud text-xs uppercase tracking-[0.15em] text-phosphor-dim">
                {active.badge} · {statusLabel[active.status]}
              </span>
              <h3 className="font-display mt-2 text-2xl font-semibold text-ink">{active.title}</h3>
              <p className="mt-2 max-w-xl text-muted">{active.description}</p>
            </div>
            <Link
              href={`/tools/${active.slug}`}
              className="font-hud shrink-0 rounded-md border border-line-strong px-4 py-2 text-xs uppercase tracking-[0.15em] text-phosphor transition-colors hover:bg-phosphor hover:text-[#04140b]"
            >
              Open tool page →
            </Link>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {active.chips.map((chip) => (
              <span
                key={chip}
                className="font-hud rounded-full border border-line px-3 py-1 text-[11px] text-muted"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
