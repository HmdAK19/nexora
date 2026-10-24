import {
  apiClient,
  isRecord,
  readFiniteNumber,
  readIsoDate,
  readPositiveNumber,
  readString,
} from '@shared/api';

export type PurchaseStatus = 'completed' | 'failed' | 'pending';

export interface PurchaseQuote {
  asset: string;
  assetAmount: number;
  expiresAt: string;
  feeAmount: number;
  fiatAmount: number;
  fiatCurrency: string;
  id: string;
  totalAmount: number;
  unitPrice: number;
}

export interface PurchaseOrder {
  asset: string;
  assetAmount: number;
  createdAt: string;
  failureCode?: string;
  fiatAmount: number;
  fiatCurrency: string;
  id: string;
  status: PurchaseStatus;
}

export interface CreateQuoteInput {
  asset: string;
  fiatAmount: number;
  fiatCurrency: string;
}

function parseQuote(value: unknown): PurchaseQuote {
  if (!isRecord(value)) {
    throw new Error('Invalid purchase quote response');
  }

  return {
    asset: readString(value, 'asset'),
    assetAmount: readPositiveNumber(value, 'assetAmount'),
    expiresAt: readIsoDate(value, 'expiresAt'),
    feeAmount: readFiniteNumber(value, 'feeAmount'),
    fiatAmount: readPositiveNumber(value, 'fiatAmount'),
    fiatCurrency: readString(value, 'fiatCurrency'),
    id: readString(value, 'id'),
    totalAmount: readPositiveNumber(value, 'totalAmount'),
    unitPrice: readPositiveNumber(value, 'unitPrice'),
  };
}

function parseOrder(value: unknown): PurchaseOrder {
  if (!isRecord(value)) {
    throw new Error('Invalid purchase order response');
  }

  const status = readString(value, 'status');

  if (status !== 'completed' && status !== 'failed' && status !== 'pending') {
    throw new Error('Invalid purchase order status');
  }

  const failureCode = value.failureCode;

  if (failureCode !== undefined && typeof failureCode !== 'string') {
    throw new Error('Invalid purchase failure code');
  }

  return {
    asset: readString(value, 'asset'),
    assetAmount: readPositiveNumber(value, 'assetAmount'),
    createdAt: readIsoDate(value, 'createdAt'),
    failureCode,
    fiatAmount: readPositiveNumber(value, 'fiatAmount'),
    fiatCurrency: readString(value, 'fiatCurrency'),
    id: readString(value, 'id'),
    status,
  };
}

export const buyKeys = {
  all: ['buy'] as const,
  order: (id: string) => [...buyKeys.all, 'order', id] as const,
};

export const buyApi = {
  createQuote: async (input: CreateQuoteInput): Promise<PurchaseQuote> =>
    parseQuote((await apiClient.post<unknown>('/buy/quotes', input)).data),
  createOrder: async (quoteId: string, idempotencyKey: string): Promise<PurchaseOrder> =>
    parseOrder(
      (
        await apiClient.post<unknown>(
          '/buy/orders',
          { quoteId },
          { headers: { 'Idempotency-Key': idempotencyKey } }
        )
      ).data
    ),
  getOrder: async (id: string): Promise<PurchaseOrder> =>
    parseOrder((await apiClient.get<unknown>(`/buy/orders/${encodeURIComponent(id)}`)).data),
};
