import Link from "next/link";
import Image from "next/image";
import { siteHost } from "@/lib/site";

const toolColors = ["pid", "blackbox", "build", "rates", "flight", "presets"] as const;

export default function SiteFooter() {
  return (
    <footer className="border-t border-line py-8">
      <div className="container-hud flex flex-col gap-6">
        <div className="flex items-center gap-1" aria-hidden="true">
          {toolColors.map((c) => (
            <span key={c} className="h-1 w-8 rounded-full opacity-70" style={{ background: `var(--tool-${c})` }} />
          ))}
        </div>

        <div className="flex flex-col gap-4 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Image src="/brand/obix-symbol.png" alt="" width={20} height={20} className="h-5 w-5 object-contain opacity-90" />
            <p>© {new Date().getFullYear()} OBIXCONFIG FPV — built for pilots, creators, and future app expansion.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="font-hud uppercase tracking-[0.15em] hover:text-phosphor">
              About
            </Link>
            <Link href="/roadmap" className="font-hud uppercase tracking-[0.15em] hover:text-phosphor">
              Roadmap
            </Link>
            <Link href="/faq" className="font-hud uppercase tracking-[0.15em] hover:text-phosphor">
              FAQ
            </Link>
            <Link href="/settings" className="font-hud uppercase tracking-[0.15em] hover:text-phosphor">
              Settings
            </Link>
            <p className="font-hud uppercase tracking-[0.15em]">{siteHost}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
