import { describe, expect, it } from 'vitest';
import { QueryClient } from '@tanstack/react-query';

import { createOptimisticHandlers, removeFromList, updateInList } from './index';

const items = [
  {
    id: '1',
    status: 'open',
  },
  {
    id: '2',
    status: 'open',
  },
];
describe('optimistic list helpers', () => {
  it('patches one item without mutating the input', () => {
    const result = updateInList(items, '1', {
      status: 'cancelled',
    });
    expect(result[0]?.status).toBe('cancelled');
    expect(items[0]?.status).toBe('open');
  });
  it('removes an item by identity', () => {
    expect(removeFromList(items, '2')).toEqual([
      {
        id: '1',
        status: 'open',
      },
    ]);
  });
  it('passes mutation variables to the optimistic updater', async () => {
    const client = new QueryClient();
    const key = ['orders'];
    client.setQueryData(key, items);
    const handlers = createOptimisticHandlers(client, key, (current: typeof items | undefined, id: string) =>
      updateInList(current, id, {
        status: 'cancelled',
      })
    );
    const context = await handlers.onMutate('2');
    expect(client.getQueryData(key)).toEqual([
      {
        id: '1',
        status: 'open',
      },
      {
        id: '2',
        status: 'cancelled',
      },
    ]);
    expect(context.previous).toEqual(items);
  });
});
