import { calculatePid, type FlyingStyle } from "./pidAdvisor";
import { applyRatesCurve } from "./ratesEngine";

export interface StarterPreset {
  id: string;
  style: FlyingStyle;
  label: string;
  propSizeInches: number;
  motorKv: number;
  cells: number;
  rcRate: number;
  superRate: number;
  expo: number;
}

// Representative builds per style — these feed the same calculatePid /
// applyRatesCurve engines used in the PID Advisor and Rates Visualizer
// tools, so a preset here is never a separate, disconnected set of numbers.
export const starterPresets: StarterPreset[] = [
  { id: "freestyle-5in", style: "freestyle", label: "Freestyle 5\"", propSizeInches: 5, motorKv: 1700, cells: 4, rcRate: 1.0, superRate: 0.7, expo: 0.3 },
  { id: "cinematic-5in", style: "cinematic", label: "Cinematic 5\"", propSizeInches: 5, motorKv: 1600, cells: 4, rcRate: 0.8, superRate: 0.5, expo: 0.4 },
  { id: "longrange-7in", style: "longrange", label: "Long range 7\"", propSizeInches: 7, motorKv: 1300, cells: 6, rcRate: 0.7, superRate: 0.4, expo: 0.35 },
  { id: "micro-3in", style: "micro", label: "Micro 3\"", propSizeInches: 3, motorKv: 2400, cells: 4, rcRate: 1.1, superRate: 0.75, expo: 0.25 },
];

export interface SavedPreset {
  id: string;
  name: string;
  createdAt: string;
  cliSnippet: string;
  buildProfileName?: string;
}

export function buildPresetCli(preset: StarterPreset): string {
  const pid = calculatePid({
    propSizeInches: preset.propSizeInches,
    motorKv: preset.motorKv,
    cells: preset.cells,
    style: preset.style,
  });
  const peak = Math.round(applyRatesCurve(1, preset));

  return [
    `# ${preset.label} — generated from OBIXCONFIG FPV`,
    `set p_pitch = ${pid.pitch.p}`,
    `set i_pitch = ${pid.pitch.i}`,
    `set d_pitch = ${pid.pitch.d}`,
    `set p_roll = ${pid.roll.p}`,
    `set i_roll = ${pid.roll.i}`,
    `set d_roll = ${pid.roll.d}`,
    `set p_yaw = ${pid.yaw.p}`,
    `set i_yaw = ${pid.yaw.i}`,
    `set d_min_roll = ${pid.dMin}`,
    `set d_min_pitch = ${pid.dMin}`,
    `set ff_pitch = ${pid.feedforward}`,
    `set ff_roll = ${pid.feedforward}`,
    `set rc_rate = ${preset.rcRate}`,
    `set rates_type = ACTUAL`,
    `set roll_rate = ${preset.superRate}`,
    `set pitch_rate = ${preset.superRate}`,
    `set rc_expo = ${preset.expo}`,
    `# peak rate ~${peak} deg/s at full stick`,
    `save`,
  ].join("\n");
}
