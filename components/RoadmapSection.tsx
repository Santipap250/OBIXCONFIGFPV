import Reveal from "./Reveal";

const phases = [
  {
    phase: "Phase 1",
    title: "Foundation rebuild",
    copy: "วางโครงหน้าแรก, navigation, design system, และ component หลักทั้งหมด — สถานะ: เสร็จแล้วในรุ่นนี้",
    done: true,
  },
  {
    phase: "Phase 2",
    title: "Tool ecosystem",
    copy: "ต่อ PID Advisor, Blackbox Analyzer และ Build Helper เข้ากับ shared data model และ backend จริง",
    done: false,
  },
  {
    phase: "Phase 3",
    title: "Product polish",
    copy: "เก็บ motion, performance budget, contrast audit, และ social share preview ให้ครบทุกหน้า",
    done: false,
  },
  {
    phase: "Phase 4",
    title: "App expansion",
    copy: "เพิ่ม PWA install flow เต็มรูปแบบ, saved presets, บัญชีผู้ใช้ และ cloud sync",
    done: false,
  },
];

export default function RoadmapSection() {
  return (
    <section id="roadmap" className="container-hud py-20">
      <Reveal>
        <span className="font-hud text-xs uppercase tracking-[0.2em] text-phosphor-dim">Build roadmap</span>
        <h2 className="font-display mt-3 max-w-xl text-3xl font-semibold text-ink md:text-4xl">
          From landing page to a real product foundation
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {phases.map((item, i) => (
          <Reveal key={item.phase} delay={i * 60}>
            <article className="h-full rounded-xl border border-line px-5 py-6">
              <div className="flex items-center justify-between">
                <span className="font-hud text-xs uppercase tracking-[0.15em] text-phosphor-dim">{item.phase}</span>
                {item.done && (
                  <span className="font-hud rounded-full bg-phosphor/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-phosphor">
                    Shipped
                  </span>
                )}
              </div>
              <h3 className="font-display mt-2 text-lg font-medium text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.copy}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
