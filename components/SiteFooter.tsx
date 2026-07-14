import { siteHost } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line py-8">
      <div className="container-hud flex flex-col gap-2 text-xs text-muted md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} OBIXCONFIG FPV — built for pilots, creators, and future app expansion.</p>
        <p className="font-hud uppercase tracking-[0.15em]">{siteHost}</p>
      </div>
    </footer>
  );
}
