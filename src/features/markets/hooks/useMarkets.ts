import { useInfiniteQuery } from '@tanstack/react-query';

import { marketKeys, marketsApi } from '../api';

export const useMarkets = (search: string) =>
  useInfiniteQuery({
    queryKey: marketKeys.list(search),
    queryFn: ({ pageParam }) =>
      marketsApi.getPage({
        pageParam,
        search,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
  });
