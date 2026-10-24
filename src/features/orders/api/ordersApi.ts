import {
  apiClient,
  isRecord,
  readFiniteNumber,
  readIsoDate,
  readPositiveNumber,
  readString,
} from '@shared/api';
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
function parseOrder(value: unknown): Order {
  if (!isRecord(value)) throw new Error('Invalid order response');
  const side = readString(value, 'side');
  const type = readString(value, 'type');
  const status = readString(value, 'status');
  if (side !== 'buy' && side !== 'sell') throw new Error('Invalid order side');
  if (type !== 'limit' && type !== 'market') throw new Error('Invalid order type');
  if (status !== 'open' && status !== 'filled' && status !== 'cancelled')
    throw new Error('Invalid order status');
  return {
    amount: readPositiveNumber(value, 'amount'),
    averagePrice: readFiniteNumber(value, 'averagePrice'),
    createdAt: readIsoDate(value, 'createdAt'),
    feeAmount: readFiniteNumber(value, 'feeAmount'),
    filled: readFiniteNumber(value, 'filled'),
    id: readString(value, 'id'),
    price: readPositiveNumber(value, 'price'),
    quoteAmount: readPositiveNumber(value, 'quoteAmount'),
    side,
    status,
    symbol: readString(value, 'symbol'),
    type,
    updatedAt: readIsoDate(value, 'updatedAt'),
  };
}
export const ordersApi = {
  list: async (): Promise<Order[]> => {
    const data: unknown = (await apiClient.get('/orders')).data;
    if (!Array.isArray(data)) throw new Error('Invalid orders response');
    return data.map(parseOrder);
  },
  create: async (input: CreateOrderInput, idempotencyKey: string): Promise<Order> =>
    parseOrder(
      (await apiClient.post('/orders', input, { headers: { 'Idempotency-Key': idempotencyKey } })).data
    ),
  cancel: async (id: string): Promise<Order> =>
    parseOrder((await apiClient.patch(`/orders/${encodeURIComponent(id)}/cancel`)).data),
};
