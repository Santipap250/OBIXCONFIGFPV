"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/#tools", label: "Tools" },
  { href: "/about", label: "About" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/faq", label: "FAQ" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-bg/85 backdrop-blur-md">
      <div className="container-hud flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="OBIXCONFIG FPV, home">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-md border border-line-strong text-phosphor">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="8" />
              <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
              <path d="M12 4v2M12 18v2M4 12h2M18 12h2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="font-display leading-tight">
            <span className="block text-sm font-semibold tracking-wide text-ink">OBIXCONFIG FPV</span>
            <span className="font-hud block text-[10px] uppercase tracking-[0.2em] text-muted">
              tuning console
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="font-hud hidden items-center gap-8 text-xs uppercase tracking-[0.15em] text-muted md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-phosphor">
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/download"
          className="font-hud hidden rounded-md border border-line-strong px-4 py-2 text-xs uppercase tracking-[0.15em] text-phosphor transition-colors hover:bg-phosphor hover:text-[#04140b] md:block"
        >
          Get the build
        </Link>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-md border border-line-strong text-ink md:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="font-hud border-t border-line bg-bg-panel px-6 py-4 text-sm uppercase tracking-[0.15em] text-muted md:hidden"
        >
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setOpen(false)} className="block hover:text-phosphor">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/download"
                onClick={() => setOpen(false)}
                className="block text-phosphor"
              >
                Get the build
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
