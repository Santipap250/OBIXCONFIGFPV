export interface ChecklistItem {
  id: string;
  label: string;
  critical: boolean;
}

export interface ChecklistCategory {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export const checklist: ChecklistCategory[] = [
  {
    id: "power",
    title: "แบตเตอรี่ & พลังงาน",
    items: [
      { id: "battery-voltage", label: "เช็คแรงดันแบตก่อนบิน (ไม่ต่ำกว่า storage voltage)", critical: true },
      { id: "battery-secure", label: "แบตยึดแน่น ไม่ขยับตอนบิน", critical: true },
      { id: "battery-connector", label: "connector ไม่หลวม ไม่มีรอยไหม้", critical: false },
    ],
  },
  {
    id: "airframe",
    title: "เฟรม & ใบพัด",
    items: [
      { id: "props-tight", label: "น็อตใบพัดแน่น ไม่มีตัวไหนหลวม", critical: true },
      { id: "props-orientation", label: "ใบพัดใส่ถูกด้าน (CW/CCW ตรงตำแหน่ง)", critical: true },
      { id: "props-damage", label: "ไม่มีใบพัดร้าวหรือบิ่น", critical: true },
      { id: "frame-screws", label: "น็อตเฟรมแน่น ไม่มีตัวไหนหาย", critical: false },
    ],
  },
  {
    id: "rf",
    title: "RX / VTX / Failsafe",
    items: [
      { id: "failsafe-set", label: "ตั้ง failsafe ไว้แล้วและทดสอบแล้วว่าทำงาน", critical: true },
      { id: "rx-bind", label: "RX bind กับ TX ตัวที่ถืออยู่ตอนนี้", critical: true },
      { id: "vtx-power", label: "กำลังส่ง VTX ถูกต้องตามกฎสนาม/ประเทศ", critical: false },
      { id: "vtx-channel", label: "ช่อง VTX ไม่ชนกับคนอื่นในสนาม", critical: false },
    ],
  },
  {
    id: "arming",
    title: "ก่อนอาร์ม",
    items: [
      { id: "props-off-bench", label: "ถ้าเทสบนโต๊ะ ถอดใบพัดออกก่อน", critical: true },
      { id: "arm-switch", label: "สวิตช์ arm อยู่ตำแหน่งปิดก่อนเปิดเครื่อง", critical: true },
      { id: "area-clear", label: "พื้นที่รอบตัวปลอดคนและสัตว์เลี้ยง", critical: true },
    ],
  },
];

export const totalItems = checklist.reduce((sum, c) => sum + c.items.length, 0);
export const criticalItemIds = checklist.flatMap((c) => c.items.filter((i) => i.critical).map((i) => i.id));
