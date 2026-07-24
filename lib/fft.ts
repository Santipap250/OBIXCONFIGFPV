/**
 * Minimal radix-2 Cooley-Tukey FFT. Input length must be a power of 2 —
 * callers should pad/trim to the nearest power of 2 themselves.
 * Returns magnitude spectrum (one-sided, DC to Nyquist).
 */
export function fftMagnitude(signal: number[]): number[] {
  const n = signal.length;
  if (n === 0 || (n & (n - 1)) !== 0) {
    throw new Error("fftMagnitude: signal length must be a non-zero power of 2");
  }

  const real = Float64Array.from(signal);
  const imag = new Float64Array(n);

  // Bit-reversal permutation
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [real[i], real[j]] = [real[j], real[i]];
      [imag[i], imag[j]] = [imag[j], imag[i]];
    }
  }

  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    const wr = Math.cos(ang);
    const wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let curWr = 1;
      let curWi = 0;
      for (let j = 0; j < len / 2; j++) {
        const uRe = real[i + j];
        const uIm = imag[i + j];
        const vRe = real[i + j + len / 2] * curWr - imag[i + j + len / 2] * curWi;
        const vIm = real[i + j + len / 2] * curWi + imag[i + j + len / 2] * curWr;
        real[i + j] = uRe + vRe;
        imag[i + j] = uIm + vIm;
        real[i + j + len / 2] = uRe - vRe;
        imag[i + j + len / 2] = uIm - vIm;
        const nextWr = curWr * wr - curWi * wi;
        const nextWi = curWr * wi + curWi * wr;
        curWr = nextWr;
        curWi = nextWi;
      }
    }
  }

  const half = n / 2;
  const mag = new Array(half);
  for (let i = 0; i < half; i++) {
    mag[i] = Math.sqrt(real[i] * real[i] + imag[i] * imag[i]) / n;
  }
  return mag;
}

export function nextPowerOfTwo(n: number): number {
  return Math.pow(2, Math.ceil(Math.log2(Math.max(1, n))));
}

/** Hann window — reduces spectral leakage from analyzing a finite-length,
 * non-periodic chunk of signal (standard practice before an FFT). */
export function applyHannWindow(signal: number[]): number[] {
  const n = signal.length;
  return signal.map((v, i) => v * 0.5 * (1 - Math.cos((2 * Math.PI * i) / (n - 1))));
}

export interface SpectrumResult {
  frequenciesHz: number[];
  magnitudes: number[];
  peakFrequencyHz: number;
  peakMagnitude: number;
}

/**
 * Computes a one-sided amplitude spectrum from a real-valued time series.
 * sampleRateHz must reflect the actual (possibly downsampled) spacing of
 * the input samples.
 */
export function computeSpectrum(signal: number[], sampleRateHz: number): SpectrumResult | null {
  if (signal.length < 8 || sampleRateHz <= 0) return null;

  const targetLen = Math.min(nextPowerOfTwo(signal.length), 4096);
  const trimmed = signal.slice(0, targetLen);
  const padded = trimmed.length < targetLen ? [...trimmed, ...new Array(targetLen - trimmed.length).fill(0)] : trimmed;

  const windowed = applyHannWindow(padded);
  const mag = fftMagnitude(windowed);

  // Skip the DC bin (index 0) when looking for a "noise" peak — constant
  // offset isn't noise.
  const frequenciesHz = mag.map((_, i) => (i * sampleRateHz) / targetLen);

  let peakIdx = 1;
  for (let i = 2; i < mag.length; i++) {
    if (mag[i] > mag[peakIdx]) peakIdx = i;
  }

  return {
    frequenciesHz,
    magnitudes: mag,
    peakFrequencyHz: frequenciesHz[peakIdx],
    peakMagnitude: mag[peakIdx],
  };
}
