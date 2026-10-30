import { createContext, useContext } from 'react';

import type { User } from '@shared/model';

import type { LoginInput, RegisterInput } from '../api';

export interface AuthContextValue {
  user: User | null;
  isRestoring: boolean;
  login: (input: LoginInput) => Promise<User>;
  logout: () => Promise<void>;
  register: (input: RegisterInput) => Promise<User>;
  refreshUser: () => Promise<User>;
}
export const AuthContext = createContext<AuthContextValue | null>(null);
export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider');
  return value;
};
