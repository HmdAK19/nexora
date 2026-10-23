import type { QueryClient, QueryKey } from '@tanstack/react-query';

interface OptimisticContext<T> {
  previous: T | undefined;
}
export const createOptimisticHandlers = <T, TVariables = void>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  update: (current: T | undefined, variables: TVariables) => T
) => ({
  onMutate: async (variables: TVariables): Promise<OptimisticContext<T>> => {
    await queryClient.cancelQueries({
      queryKey,
    });
    const previous = queryClient.getQueryData<T>(queryKey);
    queryClient.setQueryData<T>(queryKey, (current) => update(current, variables));
    return {
      previous,
    };
  },
  onError: (_error: unknown, _variables: unknown, context: OptimisticContext<T> | undefined) => {
    if (context) queryClient.setQueryData(queryKey, context.previous);
  },
  onSettled: () =>
    queryClient.invalidateQueries({
      queryKey,
    }),
});
export const updateInList = <
  T extends {
    id: string;
  },
>(
  items: T[] | undefined,
  id: string,
  patch: Partial<T>
): T[] =>
  (items ?? []).map((item) =>
    item.id === id
      ? {
          ...item,
          ...patch,
        }
      : item
  );
export const removeFromList = <
  T extends {
    id: string;
  },
>(
  items: T[] | undefined,
  id: string
): T[] => (items ?? []).filter((item) => item.id !== id);
