import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: (failureCount, error) => {
        if (failureCount >= 2) return false;
        return !(
          'response' in (error as object) &&
          (
            error as {
              response?: {
                status?: number;
              };
            }
          ).response?.status === 401
        );
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
