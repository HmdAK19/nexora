import {
  apiClient,
  isRecord,
  readFiniteNumber,
  readIsoDate,
  readPositiveNumber,
  readString,
} from '@shared/api';

import { supportedConversionAssets, type ConversionAsset } from '../model';

export type ConversionStatus = 'completed' | 'failed' | 'pending';

export interface ConversionQuote {
  destinationAmount: number;
  expiresAt: string;
  feeAmount: number;
  fromAsset: ConversionAsset;
  id: string;
  rate: number;
  sourceAmount: number;
  toAsset: ConversionAsset;
}

export interface ConversionOrder {
  createdAt: string;
  destinationAmount: number;
  fromAsset: ConversionAsset;
  id: string;
  sourceAmount: number;
  status: ConversionStatus;
  toAsset: ConversionAsset;
}

export interface CreateConversionQuoteInput {
  fromAsset: ConversionAsset;
  sourceAmount: number;
  toAsset: ConversionAsset;
}

function parseAsset(value: Record<string, unknown>, key: string): ConversionAsset {
  const asset = readString(value, key);

  if (!supportedConversionAssets.includes(asset as ConversionAsset)) {
    throw new Error(`Invalid conversion asset: ${key}`);
  }

  return asset as ConversionAsset;
}

function parseStatus(value: string): ConversionStatus {
  if (value === 'completed' || value === 'failed' || value === 'pending') {
    return value;
  }

  throw new Error('Invalid conversion status');
}

function parseQuote(value: unknown): ConversionQuote {
  if (!isRecord(value)) {
    throw new Error('Invalid conversion quote response');
  }

  return {
    destinationAmount: readPositiveNumber(value, 'destinationAmount'),
    expiresAt: readIsoDate(value, 'expiresAt'),
    feeAmount: readFiniteNumber(value, 'feeAmount'),
    fromAsset: parseAsset(value, 'fromAsset'),
    id: readString(value, 'id'),
    rate: readPositiveNumber(value, 'rate'),
    sourceAmount: readPositiveNumber(value, 'sourceAmount'),
    toAsset: parseAsset(value, 'toAsset'),
  };
}

function parseOrder(value: unknown): ConversionOrder {
  if (!isRecord(value)) {
    throw new Error('Invalid conversion order response');
  }

  return {
    createdAt: readIsoDate(value, 'createdAt'),
    destinationAmount: readPositiveNumber(value, 'destinationAmount'),
    fromAsset: parseAsset(value, 'fromAsset'),
    id: readString(value, 'id'),
    sourceAmount: readPositiveNumber(value, 'sourceAmount'),
    status: parseStatus(readString(value, 'status')),
    toAsset: parseAsset(value, 'toAsset'),
  };
}

export const conversionKeys = {
  all: ['conversion'] as const,
  order: (id: string) => [...conversionKeys.all, 'order', id] as const,
};

export const convertApi = {
  createQuote: async (input: CreateConversionQuoteInput): Promise<ConversionQuote> =>
    parseQuote((await apiClient.post<unknown>('/convert/quotes', input)).data),
  createOrder: async (quoteId: string, idempotencyKey: string): Promise<ConversionOrder> =>
    parseOrder(
      (
        await apiClient.post<unknown>(
          '/convert/orders',
          { quoteId },
          { headers: { 'Idempotency-Key': idempotencyKey } }
        )
      ).data
    ),
  getOrder: async (id: string): Promise<ConversionOrder> =>
    parseOrder((await apiClient.get<unknown>(`/convert/orders/${encodeURIComponent(id)}`)).data),
};
