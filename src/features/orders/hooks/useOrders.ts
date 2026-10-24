import { useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createOptimisticHandlers, updateInList } from '@shared/api/react-query';
import { createIdempotencyKey } from '@shared/lib';

import { orderKeys, ordersApi, type CreateOrderInput } from '../api';

export const useOrders = () =>
  useQuery({
    queryKey: orderKeys.list(),
    queryFn: ordersApi.list,
  });
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const idempotencyKeyRef = useRef<string | undefined>(undefined);
  return useMutation({
    mutationFn: (input: CreateOrderInput) => {
      idempotencyKeyRef.current ??= createIdempotencyKey();
      return ordersApi.create(input, idempotencyKeyRef.current);
    },
    onSuccess: async (order) => {
      idempotencyKeyRef.current = undefined;
      queryClient.setQueryData(orderKeys.list(), (current: ReturnType<typeof useOrders>['data']) => [
        order,
        ...(current ?? []),
      ]);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['wallet'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      ]);
    },
  });
};
export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  const optimisticHandlers = createOptimisticHandlers<ReturnType<typeof useOrders>['data'], string>(
    queryClient,
    orderKeys.list(),
    (current, id) => updateInList(current, id, { status: 'cancelled' })
  );

  return useMutation({
    mutationFn: ordersApi.cancel,
    ...optimisticHandlers,
    onSettled: async () => {
      await Promise.all([
        optimisticHandlers.onSettled(),
        queryClient.invalidateQueries({ queryKey: ['wallet'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      ]);
    },
  });
};
