import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { api, setAuth } from '../lib/api';
import { getItem, setItem, removeItem } from '../lib/storage';

const KEY_TOKEN = 'rgc.token';
const KEY_USER = 'rgc.user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await getItem(KEY_TOKEN);
        if (stored) {
          setAuth(stored);
          setToken(stored);
          try {
            const me = await api.me();
            setUser(me.user);
            await setItem(KEY_USER, JSON.stringify(me.user));
          } catch {
            // Token is bad / server unreachable — drop the session quietly.
            await removeItem(KEY_TOKEN);
            await removeItem(KEY_USER);
            setAuth(null);
            setToken(null);
          }
        }
      } finally {
        setBootstrapped(true);
      }
    })();
  }, []);

  const signIn = useCallback(async (nextToken, nextUser) => {
    setAuth(nextToken);
    setToken(nextToken);
    setUser(nextUser);
    await setItem(KEY_TOKEN, nextToken);
    await setItem(KEY_USER, JSON.stringify(nextUser));
  }, []);

  const signOut = useCallback(async () => {
    setAuth(null);
    setToken(null);
    setUser(null);
    await removeItem(KEY_TOKEN);
    await removeItem(KEY_USER);
    // Clear active profile pointer so a fresh login starts at the profile picker.
    await removeItem('rgc.activeProfileId');
  }, []);

  const updateUser = useCallback(async (next) => {
    setUser(next);
    await setItem(KEY_USER, JSON.stringify(next));
  }, []);

  const value = useMemo(
    () => ({ user, token, bootstrapped, signIn, signOut, updateUser }),
    [user, token, bootstrapped, signIn, signOut, updateUser],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
