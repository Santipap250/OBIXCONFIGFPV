const PREFIX = "obixconfigfpv:";
const CHANGE_EVENT = "obixconfigfpv:storage";

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode, quota, etc.) — fail silently, the
    // UI still works for the current session, it just won't persist.
  }
}

export function removeStorage(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    // ignore
  }
}

/** Fires a change event so any component using useLocalStorage re-reads. */
export function notifyStorageChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeToStorageChange(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

/** All app-owned keys currently present in localStorage, without the prefix. */
export function listAllKeys(): string[] {
  if (typeof window === "undefined") return [];
  const keys: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const fullKey = window.localStorage.key(i);
    if (fullKey?.startsWith(PREFIX)) keys.push(fullKey.slice(PREFIX.length));
  }
  return keys;
}

export function exportAllData(): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of listAllKeys()) {
    out[key] = readStorage(key, null);
  }
  return out;
}

export function importAllData(data: Record<string, unknown>): void {
  for (const [key, value] of Object.entries(data)) {
    writeStorage(key, value);
  }
  notifyStorageChange();
}

export function clearAllData(): void {
  for (const key of listAllKeys()) removeStorage(key);
  notifyStorageChange();
}
