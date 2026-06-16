import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { api, setActiveProfileId } from '../lib/api';
import { getItem, setItem, removeItem } from '../lib/storage';
import { useAuth } from './AuthContext';

const KEY_ACTIVE_PROFILE = 'rgc.activeProfileId';

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const { token, bootstrapped } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    if (!token) {
      setProfiles([]);
      setActiveId(null);
      setActiveProfileId(null);
      return;
    }
    const { profiles: rows } = await api.listProfiles();
    setProfiles(rows);
    const stored = await getItem(KEY_ACTIVE_PROFILE);
    const storedNum = stored ? Number(stored) : null;
    const valid = storedNum && rows.some((p) => p.id === storedNum) ? storedNum : (rows[0]?.id ?? null);
    setActiveId(valid);
    setActiveProfileId(valid);
  }, [token]);

  useEffect(() => {
    if (!bootstrapped) return;
    (async () => {
      try {
        await refresh();
      } catch {
        setProfiles([]);
        setActiveId(null);
        setActiveProfileId(null);
      } finally {
        setReady(true);
      }
    })();
  }, [bootstrapped, refresh]);

  const setActive = useCallback(async (id) => {
    setActiveId(id);
    setActiveProfileId(id);
    if (id) await setItem(KEY_ACTIVE_PROFILE, String(id));
    else await removeItem(KEY_ACTIVE_PROFILE);
  }, []);

  const createProfile = useCallback(async (displayName, profileType) => {
    const { profile } = await api.createProfile(displayName, profileType);
    setProfiles((curr) => [...curr, profile]);
    await setActive(profile.id);
    return profile;
  }, [setActive]);

  const renameProfile = useCallback(async (id, displayName) => {
    const { profile } = await api.renameProfile(id, displayName);
    setProfiles((curr) => curr.map((p) => (p.id === id ? { ...p, displayName: profile.displayName } : p)));
  }, []);

  const removeProfile = useCallback(async (id) => {
    await api.deleteProfile(id);
    setProfiles((curr) => {
      const next = curr.filter((p) => p.id !== id);
      if (activeId === id) setActive(next[0]?.id ?? null);
      return next;
    });
  }, [activeId, setActive]);

  const active = useMemo(() => profiles.find((p) => p.id === activeId) || null, [profiles, activeId]);

  const value = useMemo(
    () => ({
      profiles,
      active,
      activeId,
      ready,
      refresh,
      createProfile,
      renameProfile,
      removeProfile,
      setActive,
    }),
    [profiles, active, activeId, ready, refresh, createProfile, renameProfile, removeProfile, setActive],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export const useProfiles = () => useContext(ProfileContext);
