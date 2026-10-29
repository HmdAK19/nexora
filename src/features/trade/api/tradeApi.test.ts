import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { mockServer } from '@/test/mockServer';

import { tradeApi } from './tradeApi';

describe('tradeApi recent trades', () => {
  it('parses normalized recent market trades', async () => {
    mockServer.use(
      http.get('/api/markets/BTC-USDT/trades', () =>
        HttpResponse.json([{ amount: 0.125, id: 42, price: 80_500.5, side: 'buy', time: 1_792_368_000_000 }])
      )
    );

    await expect(tradeApi.getRecentTrades('BTC-USDT')).resolves.toEqual([
      { amount: 0.125, id: 42, price: 80_500.5, side: 'buy', time: 1_792_368_000_000 },
    ]);
  });

  it('rejects malformed provider data at the API boundary', async () => {
    mockServer.use(
      http.get('/api/markets/BTC-USDT/trades', () =>
        HttpResponse.json([{ amount: -1, id: 42, price: 80_500.5, side: 'unknown', time: 0 }])
      )
    );

    await expect(tradeApi.getRecentTrades('BTC-USDT')).rejects.toThrow('Invalid recent trade response');
  });
});
