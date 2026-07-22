"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { BuildProfile, BuildProfileInput } from "./buildProfile";

const PROFILES_KEY = "build-profiles-v1";
const ACTIVE_ID_KEY = "active-build-id-v1";

export function useBuildProfiles() {
  const [profiles, setProfiles] = useLocalStorage<BuildProfile[]>(PROFILES_KEY, []);
  const [activeId, setActiveId] = useLocalStorage<string | null>(ACTIVE_ID_KEY, null);

  const create = useCallback(
    (input: BuildProfileInput) => {
      const now = new Date().toISOString();
      const profile: BuildProfile = { ...input, id: `${Date.now()}`, createdAt: now, updatedAt: now };
      setProfiles([profile, ...profiles]);
      setActiveId(profile.id);
      return profile;
    },
    [profiles, setProfiles, setActiveId]
  );

  const update = useCallback(
    (id: string, input: BuildProfileInput) => {
      setProfiles(
        profiles.map((p) => (p.id === id ? { ...p, ...input, updatedAt: new Date().toISOString() } : p))
      );
    },
    [profiles, setProfiles]
  );

  const remove = useCallback(
    (id: string) => {
      setProfiles(profiles.filter((p) => p.id !== id));
      if (activeId === id) setActiveId(profiles.find((p) => p.id !== id)?.id ?? null);
    },
    [profiles, setProfiles, activeId, setActiveId]
  );

  const setActive = useCallback((id: string | null) => setActiveId(id), [setActiveId]);

  const activeProfile = profiles.find((p) => p.id === activeId) ?? null;

  return { profiles, activeProfile, activeId, create, update, remove, setActive };
}
