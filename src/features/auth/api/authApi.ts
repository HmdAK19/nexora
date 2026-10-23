import { apiClient, tokenStore } from '@shared/api';
import type { AuthResponse, User } from '@shared/model';

export interface LoginInput {
  email: string;
  password: string;
}
export const authApi = {
  login: async (input: LoginInput): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', input);
    tokenStore.set(data.accessToken);
    return data;
  },
  restore: async (): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/refresh');
    tokenStore.set(data.accessToken);
    return data;
  },
  me: async (): Promise<User> => (await apiClient.get<User>('/auth/me')).data,
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      tokenStore.clear();
    }
  },
};
