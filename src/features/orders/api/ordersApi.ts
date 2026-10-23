import { apiClient } from '@shared/api';
import type { Order } from '@shared/model';

export interface CreateOrderInput {
  symbol: string;
  side: 'buy' | 'sell';
  type: 'limit' | 'market';
  price: number;
  amount: number;
}
export const orderKeys = {
  all: ['orders'] as const,
  list: () => [...orderKeys.all, 'list'] as const,
};
export const ordersApi = {
  list: async (): Promise<Order[]> => (await apiClient.get<Order[]>('/orders')).data,
  create: async (input: CreateOrderInput): Promise<Order> =>
    (await apiClient.post<Order>('/orders', input)).data,
  cancel: async (id: string): Promise<Order> => (await apiClient.patch<Order>(`/orders/${id}/cancel`)).data,
};
