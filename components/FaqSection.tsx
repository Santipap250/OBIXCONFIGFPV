import Reveal from "./Reveal";

const faqs = [
  {
    q: "ทำไมต้องสร้างใหม่ทั้งหมด ไม่ใช่แค่ปรับเว็บเดิม?",
    a: "เว็บเดิมเป็นหน้า static เพจเดียวไม่มี routing, ไม่มี build system และข้อมูลเครื่องมือซ้ำกันระหว่าง HTML กับ JS การสร้างใหม่บน Next.js ทำให้มี routing จริง, SEO ต่อหน้า, และโครงสร้างที่พร้อมต่อยอดเป็นแอพ",
  },
  {
    q: "เว็บนี้เหมาะกับใคร?",
    a: "เหมาะกับ FPV pilots ทุกระดับ โดยเฉพาะคนที่อยากได้เครื่องมือที่เข้าใจง่ายแต่ยังลึกพอสำหรับการใช้งานจริง",
  },
  {
    q: "ตอนนี้เครื่องมือไหนใช้งานได้จริงบ้าง?",
    a: "Flight Readiness อยู่ในสถานะ beta ส่วนที่เหลืออยู่ระหว่างพัฒนา — หน้าเว็บนี้แสดงสถานะจริงของแต่ละเครื่องมือ ไม่ใช่ mockup",
  },
  {
    q: "ต่อยอดเป็นแอพได้ไหม?",
    a: "ได้ โครงสร้างปัจจุบันรองรับ PWA install อยู่แล้ว (manifest + service worker) และ routing แบบ Next.js พร้อมขยายเป็น dashboard, login และ sync ในเฟสถัดไป",
  },
];

export default function FaqSection() {
  return (
    <section id="faq" className="container-hud py-20">
      <Reveal>
        <span className="font-hud text-xs uppercase tracking-[0.2em] text-phosphor-dim">FAQ</span>
        <h2 className="font-display mt-3 max-w-xl text-3xl font-semibold text-ink md:text-4xl">
          Questions worth answering up front
        </h2>
      </Reveal>

      <div className="mt-8 divide-y divide-line rounded-2xl border border-line">
        {faqs.map((item) => (
          <details key={item.q} className="group px-5 py-4">
            <summary className="font-display flex cursor-pointer list-none items-center justify-between text-base font-medium text-ink marker:content-none">
              {item.q}
              <span className="font-hud ml-4 text-phosphor-dim transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
