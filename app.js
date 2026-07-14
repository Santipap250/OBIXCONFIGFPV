const toolData = {
  pid: {
    badge: "◎",
    title: "PID Advisor",
    desc: "แนะนำทิศทางการจูนจากสไตล์การบิน เพื่อให้เริ่ม tuning ได้เร็วและแม่นขึ้น",
    chips: [
      "เริ่มจาก baseline ที่เหมาะ",
      "รองรับ freestyle / cinematic / long range",
      "อ่านค่าที่ควรปรับก่อน-หลัง",
    ],
  },
  blackbox: {
    badge: "▣",
    title: "Blackbox Analyzer",
    desc: "ช่วยอ่านอาการสั่น แกว่ง และ noise จากข้อมูลจริงให้เข้าใจง่าย",
    chips: [
      "โฟกัสอาการหลักที่ควรแก้",
      "แยกปัญหาจาก PID vs filter",
      "เหมาะกับการ debug อย่างเป็นระบบ",
    ],
  },
  build: {
    badge: "⟡",
    title: "Build Helper",
    desc: "วางภาพรวมการประกอบโดรนให้เข้ากับเฟรม มอเตอร์ แบต และฟีลบิน",
    chips: [
      "เลือกชิ้นส่วนให้เข้ากัน",
      "เช็กความเหมาะสมของชุดขับ",
      "ลดการซื้อผิดสเปก",
    ],
  },
  rates: {
    badge: "◌",
    title: "Rates Visualizer",
    desc: "ทดลองฟีลคันเร่งและสติ๊กก่อนลงสนามจริง เพื่อหา setup ที่ถนัดที่สุด",
    chips: [
      "ดูกราฟการตอบสนอง",
      "เทียบฟีลแบบง่าย",
      "ช่วยเลือกเรตที่มั่นใจ",
    ],
  },
  flight: {
    badge: "◆",
    title: "Flight Readiness",
    desc: "เช็กลิสต์ก่อนบินที่ช่วยลดความผิดพลาดและเพิ่มความปลอดภัย",
    chips: [
      "ตรวจแบต / prop / screws",
      "เช็ก VTX / RX / arming",
      "เตือนจุดเสี่ยงก่อนบิน",
    ],
  },
  presets: {
    badge: "✦",
    title: "Smart Presets",
    desc: "พรีเซ็ตพื้นฐานสำหรับ freestyle, cinematic และ long range พร้อมต่อยอดได้",
    chips: [
      "ใช้เป็นจุดเริ่มต้นได้",
      "จัดหมวดชัดเจน",
      "พร้อมขยายเป็นคลัง preset",
    ],
  },
};

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const toolCards = document.querySelectorAll(".tool-card");

const toolBadge = document.getElementById("toolBadge");
const toolTitle = document.getElementById("toolTitle");
const toolDesc = document.getElementById("toolDesc");
const toolChips = document.getElementById("toolChips");

function setTool(key) {
  const tool = toolData[key];
  if (!tool) return;

  toolBadge.textContent = tool.badge;
  toolTitle.textContent = tool.title;
  toolDesc.textContent = tool.desc;
  toolChips.innerHTML = tool.chips.map((chip) => `<span>${chip}</span>`).join("");

  toolCards.forEach((card) => {
    card.classList.toggle("active", card.dataset.tool === key);
  });
}

toolCards.forEach((card) => {
  card.addEventListener("click", () => setTool(card.dataset.tool));
});

setTool("pid");

menuBtn?.addEventListener("click", () => {
  const open = mobileMenu.hasAttribute("hidden") ? false : true;
  if (open) {
    mobileMenu.setAttribute("hidden", "");
    menuBtn.setAttribute("aria-expanded", "false");
  } else {
    mobileMenu.removeAttribute("hidden");
    menuBtn.setAttribute("aria-expanded", "true");
  }
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.setAttribute("hidden", "");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

const revealItems = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((el) => observer.observe(el));

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
