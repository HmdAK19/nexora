import { apiClient, tokenStore } from '@shared/api';
import type { AuthResponse, User } from '@shared/model';

export interface LoginInput {
  email: string;
  mfaCode?: string;
  password: string;
  recoveryCode?: string;
}

export interface RegisterInput {
  email: string;
  language: 'en' | 'fa';
  name: string;
  password: string;
  phone?: string;
  termsAccepted: true;
}

export interface PasswordResetInput {
  email: string;
}

let restorePromise: Promise<AuthResponse> | null = null;

const restoreSession = (): Promise<AuthResponse> => {
  restorePromise ??= apiClient
    .post<AuthResponse>('/auth/refresh')
    .then(({ data }) => {
      tokenStore.set(data.accessToken);

      return data;
    })
    .finally(() => {
      restorePromise = null;
    });

  return restorePromise;
};

export const authApi = {
  login: async (input: LoginInput): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', input);
    tokenStore.set(data.accessToken);
    return data;
  },
  register: async (input: RegisterInput): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', input);
    tokenStore.set(data.accessToken);
    return data;
  },
  restore: restoreSession,
  me: async (): Promise<User> => (await apiClient.get<User>('/auth/me')).data,
  requestPasswordReset: async (input: PasswordResetInput): Promise<void> => {
    await apiClient.post('/auth/forgot-password', input);
  },
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      tokenStore.clear();
    }
  },
};
