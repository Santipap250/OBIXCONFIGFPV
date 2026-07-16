"use client";

import { useCallback, useSyncExternalStore } from "react";
import { readStorage, writeStorage } from "./storage";

function subscribe(onChange: () => void) {
  window.addEventListener("obixconfigfpv:storage", onChange);
  return () => window.removeEventListener("obixconfigfpv:storage", onChange);
}

function notify() {
  window.dispatchEvent(new Event("obixconfigfpv:storage"));
}

/**
 * Reads/writes a JSON value in localStorage, kept in sync with React state
 * via useSyncExternalStore — the pattern React recommends for external
 * systems (see react.dev/reference/react/useSyncExternalStore), rather than
 * setting state from inside a mount-only useEffect.
 */
export function useLocalStorage<T>(key: string, fallback: T): [T, (value: T) => void] {
  const getSnapshot = useCallback(() => {
    // Returning the same reference when unchanged avoids extra re-renders;
    // JSON.stringify keeps the comparison cheap and correct for our data.
    return JSON.stringify(readStorage(key, fallback));
  }, [key, fallback]);

  const getServerSnapshot = useCallback(() => JSON.stringify(fallback), [fallback]);

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const value = (() => {
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  })();

  const setValue = useCallback(
    (next: T) => {
      writeStorage(key, next);
      notify();
    },
    [key]
  );

  return [value, setValue];
}
