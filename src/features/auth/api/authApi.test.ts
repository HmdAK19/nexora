import { http, HttpResponse } from 'msw';
import { afterEach, describe, expect, it } from 'vitest';

import { tokenStore } from '@shared/api';
import { mockServer } from '@/test/mockServer';

import { authApi } from './authApi';

const restoredSession = {
  accessToken: 'restored-access-token',
  user: {
    id: 'user-1',
    email: 'demo@nexora.dev',
    level: 'verified',
    name: 'Demo User',
    permissions: [],
    role: 'customer',
  },
};

describe('authApi.restore', () => {
  afterEach(() => {
    tokenStore.clear();
  });

  it('deduplicates concurrent refreshes during StrictMode restoration', async () => {
    let requestCount = 0;

    mockServer.use(
      http.post('/api/auth/refresh', async () => {
        requestCount += 1;
        await Promise.resolve();

        return HttpResponse.json(restoredSession);
      })
    );

    const [first, second] = await Promise.all([authApi.restore(), authApi.restore()]);

    expect(first).toEqual(restoredSession);
    expect(second).toEqual(restoredSession);
    expect(requestCount).toBe(1);
    expect(tokenStore.get()).toBe(restoredSession.accessToken);
  });

  it('allows a later restoration attempt after the active request settles', async () => {
    let requestCount = 0;

    mockServer.use(
      http.post('/api/auth/refresh', () => {
        requestCount += 1;

        return HttpResponse.json(restoredSession);
      })
    );

    await authApi.restore();
    await authApi.restore();

    expect(requestCount).toBe(2);
  });
});
