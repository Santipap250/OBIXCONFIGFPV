export interface BuildInputs {
  auwGrams: number;
  cells: number;
  escAmpRating: number; // continuous, per ESC
  motorMaxAmp: number; // continuous, from motor datasheet, per motor
  motorCount: number;
}

export type PowerClass = "long-range" | "all-round" | "freestyle";

export interface BuildResult {
  nominalVoltage: number;
  maxVoltage: number;
  effectiveCurrentPerMotor: number;
  totalPowerWatts: number;
  powerToWeight: number; // W/g
  powerClass: PowerClass;
  powerClassLabel: string;
  warnings: string[];
  notes: string[];
}

const NOMINAL_CELL_VOLTAGE = 3.7;
const MAX_CELL_VOLTAGE = 4.2;

// Community-cited power-to-weight benchmarks (W/g of AUW). These are
// widely-referenced FPV guideline thresholds, not a claim of precise
// per-motor thrust — thrust depends on prop/motor curves we don't have data
// for here, so we only compute what's directly derivable from electrical
// inputs (voltage × current ÷ mass).
const THRESHOLD_FREESTYLE = 5.5;
const THRESHOLD_ALL_ROUND = 3.5;

export function calculateBuild(input: BuildInputs): BuildResult {
  const nominalVoltage = input.cells * NOMINAL_CELL_VOLTAGE;
  const maxVoltage = input.cells * MAX_CELL_VOLTAGE;

  const effectiveCurrentPerMotor = Math.min(input.escAmpRating, input.motorMaxAmp);
  const totalPowerWatts = nominalVoltage * effectiveCurrentPerMotor * input.motorCount;
  const powerToWeight = totalPowerWatts / input.auwGrams;

  let powerClass: PowerClass = "long-range";
  let powerClassLabel = "Long range / efficiency";
  if (powerToWeight >= THRESHOLD_FREESTYLE) {
    powerClass = "freestyle";
    powerClassLabel = "Freestyle / racing ready";
  } else if (powerToWeight >= THRESHOLD_ALL_ROUND) {
    powerClass = "all-round";
    powerClassLabel = "All-round / cinematic";
  }

  const warnings: string[] = [];
  const notes: string[] = [];

  if (input.escAmpRating < input.motorMaxAmp * 0.9) {
    warnings.push(
      `ESC continuous ${input.escAmpRating}A ต่ำกว่าที่มอเตอร์ต้องการ (${input.motorMaxAmp}A) — เสี่ยง ESC ร้อนหรือ throttle ถูกจำกัดเมื่อบินหนัก`
    );
  }
  if (input.motorMaxAmp < input.escAmpRating * 0.5) {
    notes.push(`ESC มี headroom เหลือเยอะเทียบกับมอเตอร์ (${input.escAmpRating}A vs ${input.motorMaxAmp}A) — ไม่เป็นปัญหา แค่ยังไม่ได้ใช้เต็มความสามารถ ESC`);
  }
  if (maxVoltage > 25.5 && input.escAmpRating > 0) {
    notes.push(`แรงดันสูงสุดที่ ${input.cells}S (~${maxVoltage.toFixed(1)}V) ควรเช็คว่า ESC/มอเตอร์รองรับแรงดันนี้ตามสเปกจริงของอุปกรณ์`);
  }

  return {
    nominalVoltage,
    maxVoltage,
    effectiveCurrentPerMotor,
    totalPowerWatts,
    powerToWeight,
    powerClass,
    powerClassLabel,
    warnings,
    notes,
  };
}
