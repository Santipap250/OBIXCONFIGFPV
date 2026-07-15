export type ToolStatus = "live" | "beta" | "planned";

export interface Tool {
  slug: string;
  badge: string;
  title: string;
  short: string;
  description: string;
  status: ToolStatus;
  chips: string[];
  detail: string[];
}

export const tools: Tool[] = [
  {
    slug: "pid",
    badge: "PID",
    title: "PID Advisor",
    short: "Tuning direction from your flying style",
    description:
      "แนะนำทิศทางการจูนจากสไตล์การบิน เพื่อให้เริ่ม tuning ได้เร็วและแม่นขึ้น",
    status: "beta",
    chips: ["Baseline ตาม frame + prop", "Freestyle / Cinematic / Long range", "Export เป็น Betaflight CLI"],
    detail: [
      "ป้อนสเปกเฟรม มอเตอร์ prop และสไตล์การบิน แล้วรับ baseline P/I/D/D_min ที่ควรเริ่มจูนจากตรงนั้น",
      "อธิบายเหตุผลของแต่ละค่าแบบอ่านง่าย พร้อมสูตรที่ตรวจสอบได้ ไม่ใช่ตัวเลขลอย ๆ",
      "เชื่อมกับ Blackbox Analyzer เพื่อวนรอบจูนจากข้อมูลจริง (เร็ว ๆ นี้)",
    ],
  },
  {
    slug: "blackbox",
    badge: "BBX",
    title: "Blackbox Analyzer",
    short: "Read oscillation and noise from real logs",
    description: "ช่วยอ่านอาการสั่น แกว่ง และ noise จากข้อมูลจริงให้เข้าใจง่าย",
    status: "planned",
    chips: ["อัปโหลด .bbl / .csv", "แยกปัญหา PID vs filter", "สรุปเป็นภาษาที่เข้าใจง่าย"],
    detail: [
      "อ่านไฟล์ blackbox แล้ววิเคราะห์ noise spectrum, step response และ motor saturation",
      "ชี้จุดที่น่าจะเป็นสาเหตุ เช่น prop wash, filter latency หรือ PID สูงเกินไป",
      "ส่งต่อผลไปเป็นคำแนะนำใน PID Advisor ได้ทันที",
    ],
  },
  {
    slug: "build",
    badge: "BLD",
    title: "Build Helper",
    short: "Match frame, motor, battery, and feel",
    description: "วางภาพรวมการประกอบโดรนให้เข้ากับเฟรม มอเตอร์ แบต และฟีลบิน",
    status: "beta",
    chips: ["Power-to-weight จากไฟฟ้าจริง", "เตือน ESC/มอเตอร์ไม่เข้ากัน", "จัดกลุ่มตามสไตล์การบิน"],
    detail: [
      "กรอก AUW เซลล์แบต และ current rating ของ ESC/มอเตอร์ แล้วดู power-to-weight (W/g) ที่คำนวณจากไฟฟ้าจริง",
      "เตือนคู่อุปกรณ์ที่ไม่เข้ากัน เช่น ESC amp rating ต่ำกว่าที่มอเตอร์ต้องการ",
      "จัดกลุ่มผลลัพธ์ตามเกณฑ์ community: freestyle / all-round / long range",
    ],
  },
  {
    slug: "rates",
    badge: "RTE",
    title: "Rates Visualizer",
    short: "Feel your stick response before the field",
    description: "ทดลองฟีลคันเร่งและสติ๊กก่อนลงสนามจริง เพื่อหา setup ที่ถนัดที่สุด",
    status: "beta",
    chips: ["กราฟ response แบบ real-time", "เทียบ rates หลายชุดพร้อมกัน", "สูตร Actual Rates ของ Betaflight จริง"],
    detail: [
      "ปรับ RC rate, super rate และ expo แล้วเห็นกราฟ stick-to-rotation ทันที",
      "เทียบ curve เดิมกับ curve ใหม่แบบซ้อนกันบนกราฟเดียว",
      "บันทึกเป็น preset ส่วนตัวเพื่อใช้ซ้ำหรือแชร์ต่อ",
    ],
  },
  {
    slug: "flight",
    badge: "CHK",
    title: "Flight Readiness",
    short: "Pre-flight checklist that reduces mistakes",
    description: "เช็กลิสต์ก่อนบินที่ช่วยลดความผิดพลาดและเพิ่มความปลอดภัย",
    status: "beta",
    chips: ["แบต / prop / screws", "VTX / RX / arming", "เตือนจุดเสี่ยงก่อนบิน"],
    detail: [
      "เช็กลิสต์แบบ tap-to-confirm ก่อนบินทุกครั้ง แยกตามสนามบิน indoor/outdoor",
      "จำสถานะล่าสุดไว้ในเครื่อง เพื่อบินซ้ำได้เร็วขึ้นในเซสชันเดียวกัน",
      "แจ้งเตือนจุดที่มักถูกมองข้าม เช่น failsafe หรือ prop ที่ใส่สลับด้าน",
    ],
  },
  {
    slug: "presets",
    badge: "PRE",
    title: "Smart Presets",
    short: "Starting points for every flying style",
    description: "พรีเซ็ตพื้นฐานสำหรับ freestyle, cinematic และ long range พร้อมต่อยอดได้",
    status: "planned",
    chips: ["จัดหมวดตามสไตล์การบิน", "Export เป็นไฟล์ CLI", "พร้อมขยายเป็นคลังพรีเซ็ตชุมชน"],
    detail: [
      "คลังพรีเซ็ตเริ่มต้นสำหรับ freestyle, cinematic, long range และ micro",
      "Export ตรงเป็นคำสั่ง Betaflight CLI พร้อมวางใช้ได้ทันที",
      "รองรับการแชร์พรีเซ็ตในชุมชนเมื่อระบบบัญชีผู้ใช้พร้อมใช้งาน",
    ],
  },
];

export const statusLabel: Record<ToolStatus, string> = {
  live: "Live",
  beta: "Beta",
  planned: "In development",
};
