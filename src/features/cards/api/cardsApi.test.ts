import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';

import { mockServer } from '@/test/mockServer';
import { cardsApi } from './cardsApi';

describe('cardsApi contract boundary', () => {
  it('accepts a complete masked card response', async () => {
    mockServer.use(
      http.get('/api/cards', () =>
        HttpResponse.json([
          {
            createdAt: '2026-10-25T00:00:00.000Z',
            id: 'card-1',
            isDefault: true,
            maskedIban: 'IR82 •••• 9002',
            maskedNumber: '6037 •••• •••• 5670',
          },
        ])
      )
    );
    await expect(cardsApi.list()).resolves.toHaveLength(1);
  });

  it('rejects malformed server data before it enters application state', async () => {
    mockServer.use(
      http.get('/api/cards', () => HttpResponse.json([{ id: 'card-1', number: '6037997512345670' }]))
    );
    await expect(cardsApi.list()).rejects.toThrow('Invalid bank card response');
  });

  it('validates create/default responses and encodes mutation resource IDs', async () => {
    const card = {
      createdAt: '2026-10-25T00:00:00.000Z',
      id: 'card/id',
      isDefault: true,
      maskedIban: 'IR82 •••• 9002',
      maskedNumber: '6037 •••• •••• 5670',
    };
    const calls: string[] = [];
    mockServer.use(
      http.post('/api/cards', () => HttpResponse.json(card)),
      http.patch('/api/cards/card%2Fid/default', ({ request }) => {
        calls.push(new URL(request.url).pathname);
        return HttpResponse.json(card);
      }),
      http.delete('/api/cards/card%2Fid', ({ request }) => {
        calls.push(new URL(request.url).pathname);
        return new HttpResponse(null, { status: 204 });
      })
    );

    await expect(
      cardsApi.create({ number: '6037997512345670', iban: 'IR820540102680020817909002' })
    ).resolves.toMatchObject({ id: 'card/id' });
    await expect(cardsApi.setDefault('card/id')).resolves.toMatchObject({ isDefault: true });
    await expect(cardsApi.remove('card/id')).resolves.toBeUndefined();
    expect(calls).toEqual(['/api/cards/card%2Fid/default', '/api/cards/card%2Fid']);
  });
});
