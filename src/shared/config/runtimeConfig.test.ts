import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createMarketWebSocketUrl, loadRuntimeConfig, parseRuntimeConfig } from './runtimeConfig';

describe('runtime configuration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('accepts same-origin paths and removes trailing slashes', () => {
    expect(parseRuntimeConfig({ apiBaseUrl: '/api/', webSocketUrl: '/ws/' })).toEqual({
      apiBaseUrl: '/api',
      webSocketUrl: '/ws',
    });
  });

  it('accepts secure absolute backend URLs', () => {
    expect(
      parseRuntimeConfig({
        apiBaseUrl: 'https://api.nexora.example/api/',
        webSocketUrl: 'wss://api.nexora.example/ws/',
      })
    ).toEqual({
      apiBaseUrl: 'https://api.nexora.example/api',
      webSocketUrl: 'wss://api.nexora.example/ws',
    });
  });

  it.each([
    [{ apiBaseUrl: '', webSocketUrl: '/ws' }],
    [{ apiBaseUrl: 'ftp://api.example/api', webSocketUrl: '/ws' }],
    [{ apiBaseUrl: '/api', webSocketUrl: 'https://api.example/ws' }],
    [{ apiBaseUrl: 'https://user:secret@api.example/api', webSocketUrl: '/ws' }],
    [{ apiBaseUrl: '//api.example/api', webSocketUrl: '/ws' }],
    [{ apiBaseUrl: '/api?tenant=one', webSocketUrl: '/ws' }],
    [{ apiBaseUrl: '/api', webSocketUrl: 'wss://api.example/ws#stream' }],
    [{ apiBaseUrl: '/api' }],
  ])('rejects invalid or incomplete input', (input) => {
    expect(() => parseRuntimeConfig(input)).toThrow();
  });

  it('loads the file without browser caching and resolves a relative websocket URL', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ apiBaseUrl: '/gateway/api', webSocketUrl: '/gateway/ws' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    await expect(loadRuntimeConfig()).resolves.toEqual({
      apiBaseUrl: '/gateway/api',
      webSocketUrl: '/gateway/ws',
    });
    expect(fetchMock).toHaveBeenCalledWith('/runtime-config.json', {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    expect(createMarketWebSocketUrl('BTC-USDT', 'https://exchange.example')).toBe(
      'wss://exchange.example/gateway/ws?symbol=BTC-USDT'
    );
  });

  it('fails startup when the runtime file is unavailable', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 503 }));

    await expect(loadRuntimeConfig()).rejects.toThrow('Runtime configuration could not be loaded (503).');
  });
});
