import { apiClient, isRecord, readFiniteNumber, readPositiveNumber, readString } from '@shared/api';

import type { OrderBookRow } from '../components';
import type { Candle, Timeframe } from '../lib';

export interface TradingMarket {
  baseAsset: string;
  change24h: number;
  depth: { asks: OrderBookRow[]; bids: OrderBookRow[]; sequence: number; symbol: string };
  high24h: number;
  lastPrice: number;
  low24h: number;
  name: string;
  quoteAsset: string;
  symbol: string;
  volume24h: number;
}

function parseLevel(value: unknown): OrderBookRow {
  if (!isRecord(value)) throw new Error('Invalid order book level');
  return { amount: readPositiveNumber(value, 'amount'), price: readPositiveNumber(value, 'price') };
}

function parseMarket(value: unknown): TradingMarket {
  if (
    !isRecord(value) ||
    !isRecord(value.depth) ||
    !Array.isArray(value.depth.asks) ||
    !Array.isArray(value.depth.bids)
  )
    throw new Error('Invalid trading market response');
  const change = Number(value.change24h);
  if (!Number.isFinite(change)) throw new Error('Invalid market change');
  return {
    baseAsset: readString(value, 'baseAsset'),
    change24h: change,
    depth: {
      asks: value.depth.asks.map(parseLevel),
      bids: value.depth.bids.map(parseLevel),
      sequence: readFiniteNumber(value.depth, 'sequence'),
      symbol: readString(value.depth, 'symbol'),
    },
    high24h: readPositiveNumber(value, 'high24h'),
    lastPrice: readPositiveNumber(value, 'lastPrice'),
    low24h: readPositiveNumber(value, 'low24h'),
    name: readString(value, 'name'),
    quoteAsset: readString(value, 'quoteAsset'),
    symbol: readString(value, 'symbol'),
    volume24h: readFiniteNumber(value, 'volume24h'),
  };
}

function parseCandle(value: unknown): Candle {
  if (!isRecord(value)) throw new Error('Invalid candle response');
  return {
    close: readPositiveNumber(value, 'close'),
    high: readPositiveNumber(value, 'high'),
    low: readPositiveNumber(value, 'low'),
    open: readPositiveNumber(value, 'open'),
    time: readPositiveNumber(value, 'time'),
    volume: readFiniteNumber(value, 'volume'),
  };
}

export const tradeKeys = {
  all: ['trade'] as const,
  candles: (symbol: string, timeframe: Timeframe) => ['trade', symbol, 'candles', timeframe] as const,
  market: (symbol: string) => ['trade', symbol, 'market'] as const,
};
export const tradeApi = {
  getCandles: async (symbol: string, timeframe: Timeframe): Promise<Candle[]> => {
    const data: unknown = (
      await apiClient.get(`/markets/${encodeURIComponent(symbol)}/candles`, {
        params: { limit: 110, timeframe },
      })
    ).data;
    if (!Array.isArray(data)) throw new Error('Invalid candles response');
    return data.map(parseCandle);
  },
  getMarket: async (symbol: string): Promise<TradingMarket> =>
    parseMarket((await apiClient.get(`/markets/${encodeURIComponent(symbol)}/trading`)).data),
};
