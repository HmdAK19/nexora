import { useQuery } from '@tanstack/react-query';

import { dashboardApi, dashboardKeys } from '../api';

export const useDashboard = () =>
  useQuery({
    queryKey: dashboardKeys.overview(),
    queryFn: dashboardApi.getOverview,
  });
export const useFeaturedMarkets = () =>
  useQuery({
    queryKey: dashboardKeys.markets(),
    queryFn: dashboardApi.getFeaturedMarkets,
    refetchInterval: 20_000,
  });
