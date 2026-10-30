import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import type { User } from '@shared/model';

import { authApi, type LoginInput, type RegisterInput } from '../api';

import { AuthContext } from './authContext';

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);
  useEffect(() => {
    let active = true;
    authApi
      .restore()
      .then(({ user: restoredUser }) => active && setUser(restoredUser))
      .catch(() => active && setUser(null))
      .finally(() => active && setIsRestoring(false));
    const handleExpired = () => setUser(null);
    window.addEventListener('auth:expired', handleExpired);
    return () => {
      active = false;
      window.removeEventListener('auth:expired', handleExpired);
    };
  }, []);
  const login = useCallback(async (input: LoginInput) => {
    const response = await authApi.login(input);
    setUser(response.user);
    return response.user;
  }, []);
  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);
  const register = useCallback(async (input: RegisterInput) => {
    const response = await authApi.register(input);
    setUser(response.user);
    return response.user;
  }, []);
  const refreshUser = useCallback(async () => {
    const refreshedUser = await authApi.me();
    setUser(refreshedUser);
    return refreshedUser;
  }, []);
  const value = useMemo(
    () => ({
      user,
      isRestoring,
      login,
      logout,
      register,
      refreshUser,
    }),
    [isRestoring, login, logout, refreshUser, register, user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
