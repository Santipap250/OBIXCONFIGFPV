import Link from "next/link";
import { siteHost } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line py-8">
      <div className="container-hud flex flex-col gap-3 text-xs text-muted md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} OBIXCONFIG FPV — built for pilots, creators, and future app expansion.</p>
        <div className="flex items-center gap-4">
          <Link href="/settings" className="font-hud uppercase tracking-[0.15em] hover:text-phosphor">
            Settings
          </Link>
          <p className="font-hud uppercase tracking-[0.15em]">{siteHost}</p>
        </div>
      </div>
    </footer>
  );
}
