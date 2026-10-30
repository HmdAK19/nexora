import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';

import { mockServer } from '@/test/mockServer';

import { notificationsApi } from './notificationsApi';

const feed = {
  items: [
    {
      actionPath: '/orders',
      createdAt: '2026-10-30T08:00:00.000Z',
      id: 'notification-1',
      kind: 'order_placed',
      metadata: { symbol: 'BTC-USDT' },
      readAt: null,
    },
  ],
  unreadCount: 1,
};

describe('notificationsApi contract boundary', () => {
  it('accepts a valid feed and encodes notification identifiers', async () => {
    let requestedPath = '';
    mockServer.use(
      http.get('/api/account/notifications', () => HttpResponse.json(feed)),
      http.patch('/api/account/notifications/:id/read', ({ request }) => {
        requestedPath = new URL(request.url).pathname;
        return HttpResponse.json({
          items: [{ ...feed.items[0], readAt: '2026-10-30T09:00:00.000Z' }],
          unreadCount: 0,
        });
      })
    );

    await expect(notificationsApi.list()).resolves.toEqual(feed);
    await notificationsApi.markRead('notice/value');

    expect(requestedPath).toContain('notice%2Fvalue');
  });

  it('rejects external actions and inconsistent unread counts', async () => {
    mockServer.use(
      http.get('/api/account/notifications', () =>
        HttpResponse.json({
          items: [{ ...feed.items[0], actionPath: 'https://malicious.example' }],
          unreadCount: 0,
        })
      )
    );

    await expect(notificationsApi.list()).rejects.toThrow('Invalid notification action');
  });
});
