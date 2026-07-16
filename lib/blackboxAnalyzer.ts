export interface AxisStats {
  rmsTrackingError: number | null;
  jitter: number | null;
}

export interface BatteryStats {
  min: number;
  max: number;
  avg: number;
  sagPercent: number;
}

export interface BlackboxResult {
  sampleCount: number;
  analyzedSampleCount: number;
  durationSeconds: number | null;
  axisStats: { roll: AxisStats; pitch: AxisStats; yaw: AxisStats };
  motorSaturationPercent: number | null;
  motorColumnsFound: number;
  battery: BatteryStats | null;
  detectedColumns: string[];
  warnings: string[];
}

const AXIS_NAMES = ["roll", "pitch", "yaw"] as const;
const MAX_ANALYZED_ROWS = 40000; // stride-sample longer logs to stay responsive on the main thread

function findColumnIndex(headers: string[], name: string): number {
  const trimmed = headers.map((h) => h.trim());
  const exact = trimmed.indexOf(name);
  if (exact !== -1) return exact;
  return trimmed.findIndex((h) => h.startsWith(name));
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function rms(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.sqrt(mean(values.map((v) => v * v)));
}

export function parseBlackboxCsv(text: string): BlackboxResult {
  const warnings: string[] = [];
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);

  if (lines.length < 2) {
    throw new Error("ไฟล์นี้ไม่มีข้อมูลพอให้วิเคราะห์ (ต้องมี header + อย่างน้อย 1 แถวข้อมูล)");
  }

  const headers = lines[0].split(",");
  const detectedColumns = headers.map((h) => h.trim());
  const dataLines = lines.slice(1);
  const sampleCount = dataLines.length;

  // Stride-sample very large logs instead of parsing every row, so the
  // browser tab doesn't lock up on multi-minute high-rate logs.
  let stride = 1;
  if (sampleCount > MAX_ANALYZED_ROWS) {
    stride = Math.ceil(sampleCount / MAX_ANALYZED_ROWS);
    warnings.push(
      `ไฟล์มี ${sampleCount.toLocaleString()} แถว — สุ่มตัวอย่างทุก ${stride} แถวเพื่อให้วิเคราะห์ได้เร็วในเบราว์เซอร์ (ผลลัพธ์เป็นค่าประมาณจาก sample)`
    );
  }

  const timeIdx = findColumnIndex(headers, "time (us)");
  const gyroIdx = AXIS_NAMES.map((_, i) => findColumnIndex(headers, `gyroADC[${i}]`));
  const setpointIdx = AXIS_NAMES.map((_, i) => findColumnIndex(headers, `setpoint[${i}]`));
  const vbatIdx = findColumnIndex(headers, "vbatLatest (V)");

  const motorIdxs: number[] = [];
  for (let i = 0; i < 8; i++) {
    const idx = findColumnIndex(headers, `motor[${i}]`);
    if (idx !== -1) motorIdxs.push(idx);
  }

  if (gyroIdx.every((i) => i === -1)) {
    warnings.push("ไม่พบคอลัมน์ gyroADC[] ในไฟล์ — ข้ามการคำนวณ tracking error/jitter");
  }
  if (motorIdxs.length === 0) {
    warnings.push("ไม่พบคอลัมน์ motor[] ในไฟล์ — ข้ามการคำนวณ motor saturation");
  }
  if (vbatIdx === -1) {
    warnings.push("ไม่พบคอลัมน์ vbatLatest (V) ในไฟล์ — ข้ามการคำนวณแรงดันแบต");
  }

  const gyroSeries: number[][] = [[], [], []];
  const errorSeries: number[][] = [[], [], []];
  const motorSeries: number[][] = motorIdxs.map(() => []);
  const vbatSeries: number[] = [];
  let firstTime: number | null = null;
  let lastTime: number | null = null;

  for (let row = 0; row < dataLines.length; row += stride) {
    const cells = dataLines[row].split(",");

    if (timeIdx !== -1) {
      const t = Number(cells[timeIdx]);
      if (Number.isFinite(t)) {
        if (firstTime === null) firstTime = t;
        lastTime = t;
      }
    }

    for (let axis = 0; axis < 3; axis++) {
      const gIdx = gyroIdx[axis];
      const sIdx = setpointIdx[axis];
      if (gIdx === -1) continue;
      const g = Number(cells[gIdx]);
      if (!Number.isFinite(g)) continue;
      gyroSeries[axis].push(g);
      if (sIdx !== -1) {
        const s = Number(cells[sIdx]);
        if (Number.isFinite(s)) errorSeries[axis].push(s - g);
      }
    }

    motorIdxs.forEach((idx, mi) => {
      const v = Number(cells[idx]);
      if (Number.isFinite(v)) motorSeries[mi].push(v);
    });

    if (vbatIdx !== -1) {
      const v = Number(cells[vbatIdx]);
      if (Number.isFinite(v) && v > 0) vbatSeries.push(v);
    }
  }

  const axisStats = {
    roll: computeAxisStats(gyroSeries[0], errorSeries[0]),
    pitch: computeAxisStats(gyroSeries[1], errorSeries[1]),
    yaw: computeAxisStats(gyroSeries[2], errorSeries[2]),
  };

  let motorSaturationPercent: number | null = null;
  if (motorSeries.length > 0 && motorSeries[0].length > 0) {
    let flagged = 0;
    let total = 0;
    motorSeries.forEach((series) => {
      const maxObserved = Math.max(...series);
      series.forEach((v) => {
        total++;
        if (v >= maxObserved * 0.98) flagged++;
      });
    });
    motorSaturationPercent = total > 0 ? (flagged / total) * 100 : null;
  }

  let battery: BatteryStats | null = null;
  if (vbatSeries.length > 0) {
    const min = Math.min(...vbatSeries);
    const max = Math.max(...vbatSeries);
    battery = {
      min,
      max,
      avg: mean(vbatSeries),
      sagPercent: max > 0 ? ((max - min) / max) * 100 : 0,
    };
  }

  const durationSeconds =
    firstTime !== null && lastTime !== null ? (lastTime - firstTime) / 1_000_000 : null;

  return {
    sampleCount,
    analyzedSampleCount: gyroSeries[0].length || Math.ceil(sampleCount / stride),
    durationSeconds,
    axisStats,
    motorSaturationPercent,
    motorColumnsFound: motorIdxs.length,
    battery,
    detectedColumns,
    warnings,
  };
}

function computeAxisStats(gyro: number[], error: number[]): AxisStats {
  if (gyro.length < 2) return { rmsTrackingError: null, jitter: null };
  const diffs: number[] = [];
  for (let i = 1; i < gyro.length; i++) diffs.push(Math.abs(gyro[i] - gyro[i - 1]));
  return {
    rmsTrackingError: error.length > 0 ? rms(error) : null,
    jitter: mean(diffs),
  };
}
