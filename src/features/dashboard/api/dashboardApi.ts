import { apiClient } from '@shared/api';
import type { DashboardData, Market } from '@shared/model';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  overview: () => [...dashboardKeys.all, 'overview'] as const,
  markets: () => [...dashboardKeys.all, 'markets'] as const,
};
export const dashboardApi = {
  getOverview: async (): Promise<DashboardData> => (await apiClient.get<DashboardData>('/dashboard')).data,
  getFeaturedMarkets: async (): Promise<Market[]> =>
    (await apiClient.get<Market[]>('/markets/featured')).data,
};
