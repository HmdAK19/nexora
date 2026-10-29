import { useQuery } from '@tanstack/react-query';

import { tradeApi, tradeKeys } from '../api';
import type { Timeframe } from '../lib';

export function useTradingMarket(symbol: string, timeframe: Timeframe) {
  return {
    candles: useQuery({
      queryKey: tradeKeys.candles(symbol, timeframe),
      queryFn: () => tradeApi.getCandles(symbol, timeframe),
    }),
    market: useQuery({
      queryKey: tradeKeys.market(symbol),
      queryFn: () => tradeApi.getMarket(symbol),
      refetchInterval: 10_000,
    }),
  };
}

export function useRecentMarketTrades(symbol: string) {
  return useQuery({
    queryKey: tradeKeys.recentTrades(symbol),
    queryFn: () => tradeApi.getRecentTrades(symbol),
    refetchInterval: 3_000,
  });
}
