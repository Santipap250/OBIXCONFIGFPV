"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    href: "/dashboard",
    label: "Home",
    icon: (
      <path d="M4 12l8-8 8 8M6 10v10h5v-6h2v6h5V10" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    href: "/#tools",
    label: "Tools",
    icon: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" strokeLinejoin="round" />,
  },
  {
    href: "/tools/presets",
    label: "Presets",
    icon: <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />,
  },
  {
    href: "/tools/flight",
    label: "Flight",
    icon: <path d="M4 12h4l3-8 3 16 3-8h3" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19 12a7 7 0 0 0-.1-1.1l2-1.5-2-3.4-2.3.9a7 7 0 0 0-1.9-1.1L14.3 3H9.7l-.4 2.4a7 7 0 0 0-1.9 1.1l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12a7 7 0 0 0 .1 1.1l-2 1.5 2 3.4 2.3-.9c.6.5 1.2.8 1.9 1.1l.4 2.4h4.6l.4-2.4a7 7 0 0 0 1.9-1.1l2.3.9 2-3.4-2-1.5c.1-.4.1-.7.1-1.1z" />
      </>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Bottom navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-bg/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-5 justify-items-center">
        {items.map((item) => {
          const isActive = item.href === "/#tools" ? false : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex w-full flex-col items-center gap-1 whitespace-nowrap py-2.5 text-[10px] uppercase tracking-[0.1em] ${
                isActive ? "text-phosphor" : "text-muted"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                {item.icon}
              </svg>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
