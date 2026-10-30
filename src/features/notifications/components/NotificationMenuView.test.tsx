import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { NotificationMenuView } from './NotificationMenuView';

describe('NotificationMenuView', () => {
  it('renders server notifications and delegates user actions', () => {
    const onOpenNotification = vi.fn();
    const anchor = document.createElement('button');
    document.body.append(anchor);
    render(
      <NotificationMenuView
        anchor={anchor}
        emptyLabel="No notifications"
        error={false}
        errorLabel="Load failed"
        items={[
          {
            actionPath: '/orders',
            createdAt: '2026-10-30T08:00:00.000Z',
            id: 'notification-1',
            kind: 'order_placed',
            metadata: { symbol: 'BTC-USDT' },
            readAt: null,
          },
        ]}
        loading={false}
        markAllLabel="Mark all read"
        onClose={vi.fn()}
        onMarkAllRead={vi.fn()}
        onOpen={vi.fn()}
        onOpenNotification={onOpenNotification}
        onRetry={vi.fn()}
        renderNotification={() => ({ body: 'Order body', time: '2 hours ago', title: 'Order title' })}
        retryLabel="Retry"
        title="Notifications"
        unreadCount={1}
        updating={false}
      />
    );

    fireEvent.click(screen.getByRole('menuitem', { name: /Order title/i }));

    expect(onOpenNotification).toHaveBeenCalledWith(expect.objectContaining({ id: 'notification-1' }));
    expect(screen.getByText('2 hours ago')).toBeInTheDocument();
  });
});
