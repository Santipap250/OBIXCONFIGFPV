import Reveal from "./Reveal";
import HudPanel from "./HudPanel";

export default function Hero() {
  return (
    <section id="home" className="container-hud grid gap-10 pt-14 pb-20 md:grid-cols-2 md:items-center md:pt-20">
      <Reveal>
        <span className="font-hud inline-block rounded-full border border-line-strong px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-phosphor">
          Tuning console for FPV pilots
        </span>
        <h1 className="font-display mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-ink md:text-5xl">
          Read your build like an OSD, not a spreadsheet.
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
          OBIXCONFIG FPV turns PID tuning, blackbox logs, and build matching into
          the same clear, instrument-panel language you already read in goggles.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#tools"
            className="font-hud rounded-md bg-phosphor px-5 py-3 text-xs uppercase tracking-[0.15em] text-[#04140b] transition-transform hover:scale-[1.02]"
          >
            Explore tools
          </a>
          <a
            href="#download"
            className="font-hud rounded-md border border-line-strong px-5 py-3 text-xs uppercase tracking-[0.15em] text-ink transition-colors hover:border-phosphor hover:text-phosphor"
          >
            Get the build
          </a>
        </div>

        <dl className="font-hud mt-10 grid grid-cols-2 gap-4 text-xs uppercase tracking-[0.15em] text-muted sm:grid-cols-4">
          <div>
            <dt>Mobile-first</dt>
            <dd className="mt-1 text-lg normal-case tracking-normal text-ink">100%</dd>
          </div>
          <div>
            <dt>App-ready</dt>
            <dd className="mt-1 text-lg normal-case tracking-normal text-ink">PWA</dd>
          </div>
          <div>
            <dt>Grounded in</dt>
            <dd className="mt-1 text-lg normal-case tracking-normal text-ink">Physics</dd>
          </div>
          <div>
            <dt>Built for</dt>
            <dd className="mt-1 text-lg normal-case tracking-normal text-ink">Pilots</dd>
          </div>
        </dl>
      </Reveal>

      <Reveal delay={120}>
        <HudPanel />
      </Reveal>
    </section>
  );
}
