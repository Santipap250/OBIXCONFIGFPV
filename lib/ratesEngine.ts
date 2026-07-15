export interface RatesInputs {
  rcRate: number; // 0.5 - 2.0, Betaflight rc_rate
  superRate: number; // 0 - 1, Betaflight rates (super rate)
  expo: number; // 0 - 1, Betaflight rcExpo
}

export interface RatesCurvePoint {
  stick: number; // -1..1
  rate: number; // deg/s
}

/**
 * Reimplements Betaflight's "Actual Rates" curve (the default rates type
 * since BF 3.x). Formula (independently re-derived from the public,
 * open-source rates math used across the FPV community):
 *
 *   expoAdjusted = stick * |stick|^3 * expo + stick * (1 - expo)
 *   rate         = 200 * rcRate * expoAdjusted
 *   superFactor  = 1 / clamp(1 - |stick| * superRate, 0.01, 1)
 *   rate        *= superFactor
 */
export function applyRatesCurve(stick: number, { rcRate, superRate, expo }: RatesInputs): number {
  const absStick = Math.abs(stick);
  let adjusted = stick;

  if (expo) {
    adjusted = stick * Math.pow(absStick, 3) * expo + stick * (1 - expo);
  }

  let rate = 200 * rcRate * adjusted;

  if (superRate) {
    const superFactor = 1 / clamp(1 - absStick * superRate, 0.01, 1);
    rate *= superFactor;
  }

  return rate;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function buildRatesCurve(inputs: RatesInputs, samples = 41): RatesCurvePoint[] {
  const points: RatesCurvePoint[] = [];
  for (let i = 0; i < samples; i++) {
    const stick = (i / (samples - 1)) * 2 - 1; // -1..1
    points.push({ stick, rate: applyRatesCurve(stick, inputs) });
  }
  return points;
}

export function peakRate(inputs: RatesInputs): number {
  return applyRatesCurve(1, inputs);
}

export function midStickRate(inputs: RatesInputs, at = 0.5): number {
  return applyRatesCurve(at, inputs);
}
