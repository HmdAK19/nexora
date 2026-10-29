import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { getRuntimeConfig } from '@shared/config';
import type { AuthResponse } from '@shared/model';

import { tokenStore } from './tokenStore';

export const apiClient = axios.create({
  baseURL: getRuntimeConfig().apiBaseUrl,
  timeout: 12_000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
let refreshPromise: Promise<string> | null = null;
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean;
        })
      | undefined;
    const isRefreshRequest = request?.url?.includes('/auth/refresh');
    if (error.response?.status !== 401 || !request || request._retry || isRefreshRequest) {
      return Promise.reject(error);
    }
    request._retry = true;
    refreshPromise ??= apiClient
      .post<AuthResponse>('/auth/refresh')
      .then(({ data }) => {
        tokenStore.set(data.accessToken);
        return data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
    try {
      request.headers.Authorization = `Bearer ${await refreshPromise}`;
      return await apiClient(request);
    } catch (refreshError) {
      tokenStore.clear();
      window.dispatchEvent(new CustomEvent('auth:expired'));
      return Promise.reject(refreshError);
    }
  }
);
export const getApiErrorMessage = (error: unknown): string => {
  if (
    axios.isAxiosError<{
      message?: string;
    }>(error)
  ) {
    return error.response?.data?.message ?? error.message;
  }
  return 'An unexpected error occurred';
};
