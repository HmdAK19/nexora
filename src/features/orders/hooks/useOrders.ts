import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createOptimisticHandlers, updateInList } from '@shared/api/react-query';

import { orderKeys, ordersApi, type CreateOrderInput } from '../api';

export const useOrders = () =>
  useQuery({
    queryKey: orderKeys.list(),
    queryFn: ordersApi.list,
  });
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateOrderInput) => ordersApi.create(input),
    onSuccess: (order) =>
      queryClient.setQueryData(orderKeys.list(), (current: ReturnType<typeof useOrders>['data']) => [
        order,
        ...(current ?? []),
      ]),
  });
};
export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ordersApi.cancel,
    ...createOptimisticHandlers<ReturnType<typeof useOrders>['data'], string>(
      queryClient,
      orderKeys.list(),
      (current, id) =>
        updateInList(current, id, {
          status: 'cancelled',
        })
    ),
  });
};
