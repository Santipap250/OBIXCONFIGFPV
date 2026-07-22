export type FlyingStyle = "beginner" | "freestyle" | "cinematic" | "racing" | "longrange" | "micro";

export interface PidInputs {
  propSizeInches: number;
  motorKv: number;
  cells: number;
  style: FlyingStyle;
}

export interface AxisGains {
  p: number;
  i: number;
  d: number;
}

export interface PidResult {
  roll: AxisGains;
  pitch: AxisGains;
  yaw: { p: number; i: number };
  dMin: number;
  feedforward: number;
  reasons: string[];
  cliSnippet: string;
}

// Reference baseline: 5" freestyle quad on 4S — close to widely-used community
// starting points, not a claim of exact Betaflight factory defaults.
const BASE = { p: 45, i: 80, d: 30 };
const BASE_YAW = { p: 45, i: 80 };
const BASE_FEEDFORWARD = 90;

const STYLE_MULTIPLIER: Record<FlyingStyle, { gain: number; ff: number; note: string }> = {
  beginner: { gain: 0.65, ff: 0.7, note: "Beginner: ลด gain ลงมากเพื่อความนิ่งและคาดเดาง่าย เหมาะกับการฝึกควบคุม" },
  freestyle: { gain: 1.0, ff: 1.0, note: "Freestyle: ใช้ baseline ตรง ๆ เน้นตอบสนองไว" },
  cinematic: { gain: 0.85, ff: 0.85, note: "Cinematic: ลด gain ~15% ให้ภาพนิ่งและนุ่มขึ้น" },
  racing: { gain: 1.1, ff: 1.05, note: "Racing: เพิ่ม gain และ feedforward ให้ตอบสนองไวที่สุดสำหรับการแข่ง" },
  longrange: { gain: 0.75, ff: 0.8, note: "Long range: ลด gain ~25% เพื่อประหยัดพลังงานและลดความร้อนมอเตอร์" },
  micro: { gain: 1.15, ff: 1.1, note: "Micro: เพิ่ม gain ~15% ชดเชยเฟรมเบาที่สั่นไวกว่า" },
};

export interface PidAdjustment {
  pAdjustPercent?: number;
  dAdjustPercent?: number;
  label: string;
}

export function applyAdjustment(base: PidResult, adjustment: PidAdjustment): PidResult {
  const pFactor = 1 + (adjustment.pAdjustPercent ?? 0) / 100;
  const dFactor = 1 + (adjustment.dAdjustPercent ?? 0) / 100;

  const roll: AxisGains = { p: Math.round(base.roll.p * pFactor), i: base.roll.i, d: Math.round(base.roll.d * dFactor) };
  const pitch: AxisGains = { p: Math.round(base.pitch.p * pFactor), i: base.pitch.i, d: Math.round(base.pitch.d * dFactor) };
  const yaw = { p: Math.round(base.yaw.p * pFactor), i: base.yaw.i };
  const dMin = Math.round(roll.d * 0.7);

  const reasons = [...base.reasons, `ปรับเพิ่มเติมจาก Blackbox Analyzer: ${adjustment.label}`];

  const cliSnippet = [
    `set p_pitch = ${pitch.p}`,
    `set i_pitch = ${pitch.i}`,
    `set d_pitch = ${pitch.d}`,
    `set p_roll = ${roll.p}`,
    `set i_roll = ${roll.i}`,
    `set d_roll = ${roll.d}`,
    `set p_yaw = ${yaw.p}`,
    `set i_yaw = ${yaw.i}`,
    `set d_min_roll = ${dMin}`,
    `set d_min_pitch = ${dMin}`,
    `set ff_pitch = ${base.feedforward}`,
    `set ff_roll = ${base.feedforward}`,
    `save`,
  ].join("\n");

  return { roll, pitch, yaw, dMin, feedforward: base.feedforward, reasons, cliSnippet };
}

export function calculatePid(input: PidInputs): PidResult {
  const reasons: string[] = [];

  // Prop size scaling: larger prop = more rotational inertia = needs lower
  // P/D to avoid overshoot; smaller prop = can safely run higher gains.
  const propFactor = 5 / input.propSizeInches;
  reasons.push(
    `เฟรม/prop ${input.propSizeInches}" เทียบกับ baseline 5" → prop factor ${propFactor.toFixed(2)}x ${
      input.propSizeInches > 5 ? "(prop ใหญ่กว่า ลดแรงเหวี่ยงด้วย gain ที่ต่ำลง)" : input.propSizeInches < 5 ? "(prop เล็กกว่า รับ gain สูงขึ้นได้)" : "(ตรงกับ baseline)"
    }`
  );

  const style = STYLE_MULTIPLIER[input.style];
  reasons.push(style.note);

  // Battery cell count: more cells → more motor torque/faster spool → trim
  // D down slightly to control heat and avoid high-frequency oscillation.
  const cellFactor = input.cells >= 6 ? 0.9 : input.cells <= 3 ? 1.05 : 1.0;
  if (input.cells >= 6) reasons.push(`${input.cells}S: แรงบิดสูงขึ้น ลด D ลง ~10% กันความร้อนและอาการสั่นความถี่สูง`);
  else if (input.cells <= 3) reasons.push(`${input.cells}S: แรงบิดต่ำกว่า เพิ่ม D เล็กน้อยชดเชยการตอบสนอง`);

  // Motor KV relative to a rough "expected" KV for the given prop size —
  // used only as a secondary nudge, not a primary driver (Build Helper
  // owns the full motor/prop/battery compatibility check).
  const expectedKv = 6200 / input.propSizeInches; // rough inverse relationship
  const kvRatio = input.motorKv / expectedKv;
  const kvNudge = Math.min(1.08, Math.max(0.92, kvRatio));
  if (kvNudge > 1.02) reasons.push(`มอเตอร์ ${input.motorKv}KV สูงกว่าค่าทั่วไปของ prop ขนาดนี้ → ตอบสนองไวกว่าปกติ ปรับ gain ขึ้นเล็กน้อย`);
  else if (kvNudge < 0.98) reasons.push(`มอเตอร์ ${input.motorKv}KV ต่ำกว่าค่าทั่วไปของ prop ขนาดนี้ → ตอบสนองช้ากว่าปกติ ปรับ gain ลงเล็กน้อย`);

  const totalGainFactor = propFactor * style.gain * cellFactor * kvNudge;

  const scaleAxis = (base: AxisGains): AxisGains => ({
    p: Math.round(base.p * totalGainFactor),
    i: Math.round(base.i * totalGainFactor),
    d: Math.round(base.d * totalGainFactor),
  });

  const roll = scaleAxis(BASE);
  const pitch = scaleAxis(BASE);
  const yaw = {
    p: Math.round(BASE_YAW.p * propFactor * style.gain),
    i: Math.round(BASE_YAW.i * propFactor * style.gain),
  };
  const feedforward = Math.round(BASE_FEEDFORWARD * style.ff * propFactor);
  const dMin = Math.round(roll.d * 0.7);

  const cliSnippet = [
    `set p_pitch = ${pitch.p}`,
    `set i_pitch = ${pitch.i}`,
    `set d_pitch = ${pitch.d}`,
    `set p_roll = ${roll.p}`,
    `set i_roll = ${roll.i}`,
    `set d_roll = ${roll.d}`,
    `set p_yaw = ${yaw.p}`,
    `set i_yaw = ${yaw.i}`,
    `set d_min_roll = ${dMin}`,
    `set d_min_pitch = ${dMin}`,
    `set ff_pitch = ${feedforward}`,
    `set ff_roll = ${feedforward}`,
    `save`,
  ].join("\n");

  return { roll, pitch, yaw, dMin, feedforward, reasons, cliSnippet };
}
