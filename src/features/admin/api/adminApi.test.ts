import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';

import { mockServer } from '@/test/mockServer';

import { adminApi } from './adminApi';

const user = {
  balance: 1200,
  email: 'user@nexora.dev',
  id: 'user-1',
  level: 'verified',
  name: 'Nexora User',
  role: 'customer',
  status: 'active',
};

describe('adminApi contract boundary', () => {
  it('accepts valid overview and user responses', async () => {
    mockServer.use(
      http.get('/api/admin/overview', () =>
        HttpResponse.json({
          attention: { highRiskWithdrawals: 0, openVerifications: 1, unansweredTickets: 2 },
          metrics: { activeUsers: 3, openReviews: 1, tradesToday: 4, volume24h: 5000 },
          services: [{ key: 'trading', status: 'operational' }],
        })
      ),
      http.get('/api/admin/users', () =>
        HttpResponse.json({ data: [user], hasMore: false, page: 1, pageSize: 25, total: 1 })
      )
    );

    await expect(adminApi.getOverview()).resolves.toMatchObject({ metrics: { activeUsers: 3 } });
    await expect(adminApi.listUsers({ page: 1, pageSize: 25, search: 'nexora' })).resolves.toMatchObject({
      data: [user],
      total: 1,
    });
  });

  it('rejects malformed privileged data before caching it', async () => {
    mockServer.use(
      http.get('/api/admin/users', () =>
        HttpResponse.json({
          data: [{ ...user, role: 'super-admin' }],
          hasMore: false,
          page: 1,
          pageSize: 25,
          total: 1,
        })
      )
    );

    await expect(adminApi.listUsers({ page: 1, pageSize: 25, search: '' })).rejects.toThrow(
      'Invalid API response field: role'
    );
  });

  it('encodes resource IDs and sends only the requested decision', async () => {
    let requestBody: unknown;
    mockServer.use(
      http.post('/api/admin/verifications/user%2F1/decision', async ({ request }) => {
        requestBody = await request.json();
        return HttpResponse.json({ status: 'verified', userId: 'user/1' });
      })
    );

    await adminApi.reviewVerification({ decision: 'approved', userId: 'user/1' });
    expect(requestBody).toEqual({ decision: 'approved' });
  });
});
