import { apiClient } from '@shared/api';
import type { Market, Paginated } from '@shared/model';

export const marketKeys = {
  all: ['markets'] as const,
  list: (search: string) => [...marketKeys.all, 'list', search] as const,
};
export const marketsApi = {
  getPage: async ({
    pageParam = 1,
    search = '',
  }: {
    pageParam?: number;
    search?: string;
  }): Promise<Paginated<Market>> =>
    (
      await apiClient.get<Paginated<Market>>('/markets', {
        params: {
          page: pageParam,
          pageSize: 25,
          search,
        },
      })
    ).data,
};
