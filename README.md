# OBIXCONFIG FPV

Tuning and build console for FPV pilots — PID guidance, blackbox reading,
build matching, rates visualization, flight readiness, and smart presets,
under one shared design system.

## Stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 (CSS-token based theme, see `app/globals.css`)
- Self-hosted variable fonts (Inter, Space Grotesk, JetBrains Mono — OFL licensed, no external font fetch at build or runtime)
- Manual PWA: `public/manifest.webmanifest` + `public/sw.js`, registered from `components/ServiceWorkerRegister.tsx`

## Structure
```
app/
  layout.tsx          root layout, fonts, metadata
  page.tsx             landing page composition
  globals.css          design tokens (OSD/telemetry theme)
  robots.ts            robots.txt (Next.js metadata route)
  sitemap.ts           sitemap.xml, generated from lib/tools.ts
  icon.svg             favicon (Next.js file convention)
  tools/[slug]/page.tsx  per-tool status page, statically generated
components/            landing sections + shared UI (Reveal, HudPanel, SiteHeader, ...)
lib/tools.ts           single source of truth for all 6 tools (fixes original's
                        HTML/JS duplication — landing grid, detail panel, and
                        /tools/[slug] pages all read from here)
public/                manifest, service worker, icons, og image
```

## Run locally
```bash
npm install
npm run dev       # http://localhost:3000
```

## Verify before shipping
```bash
npx tsc --noEmit
npx eslint .
npm run build
```
All three pass as of this delivery. `npm run build` statically generates the
landing page and all 6 tool pages.

## Deploy (Render)
Same pattern as OBIXCORE: Node web service.
- Build command: `npm install && npm run build`
- Start command: `npm start`
- No `output: "export"` needed — this ships as a Node server, not a static export.

## Honest status of each tool
Only **Flight Readiness** is marked `beta`; the other five are `planned`.
`/tools/[slug]` pages state this plainly instead of showing a fake working
calculator. Update `lib/tools.ts` status field as real logic ships.

## What changed vs. the original static repo
- Single-page static HTML/CSS/JS (9 files, no routing, no build step) →
  Next.js app with real per-tool routes, static generation, and metadata.
- Tool content was duplicated between `index.html` and `app.js` → now lives
  once in `lib/tools.ts`.
- No PNG icons (SVG-only manifest, would fail install on several Android/iOS
  versions) → generated 192/512/maskable PNGs from the source mark.
- Orphaned, unused `style.css` (leftover dead file, unrelated card/button
  styles never linked from `index.html`) → removed.
- Mobile menu open/close was manual DOM attribute toggling → React state.
- No SEO files → `robots.ts` and `sitemap.ts` added.

## Not built yet (by design, not oversight)
Real calculators (PID math, blackbox parsing, build matching, rates curves),
authentication, cloud sync, and the dashboard shell are Phase 2+. This
delivery is the foundation phase: information architecture, design system,
routing, and PWA plumbing that those features will sit on top of.
