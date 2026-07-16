import Reveal from "./Reveal";

export default function PageHeader({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <Reveal>
      <span className="font-hud text-xs uppercase tracking-[0.2em] text-phosphor-dim">{eyebrow}</span>
      <h1 className="font-display mt-3 max-w-2xl text-4xl font-semibold text-ink md:text-5xl">{title}</h1>
      {lead && <p className="mt-4 max-w-xl text-lg text-muted">{lead}</p>}
    </Reveal>
  );
}
