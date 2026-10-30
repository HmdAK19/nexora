import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { NAMESPACES } from '@app/i18n';

import { useNotifications } from '../hooks';
import {
  formatRelativeNotificationTime,
  notificationTranslationKeys,
  type AccountNotification,
} from '../model';
import { NotificationMenuView } from './NotificationMenuView';

export function NotificationMenu() {
  const { i18n, t } = useTranslation(NAMESPACES.layout);
  const navigate = useNavigate();
  const notifications = useNotifications();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const renderNotification = useCallback(
    (notification: AccountNotification) => {
      const keys = notificationTranslationKeys[notification.kind];
      return {
        body: t(keys.body, notification.metadata),
        time: formatRelativeNotificationTime(notification.createdAt, i18n.resolvedLanguage ?? 'en'),
        title: t(keys.title, notification.metadata),
      };
    },
    [i18n.resolvedLanguage, t]
  );

  const openNotification = (notification: AccountNotification) => {
    if (!notification.readAt) void notifications.markRead(notification.id).catch(() => undefined);
    setAnchor(null);
    navigate(notification.actionPath);
  };

  return (
    <NotificationMenuView
      anchor={anchor}
      emptyLabel={t('notifications.empty')}
      error={Boolean(notifications.error)}
      errorLabel={t('notifications.error')}
      items={notifications.feed?.items ?? []}
      loading={notifications.loading}
      markAllLabel={t('notifications.markAllRead')}
      onClose={() => setAnchor(null)}
      onMarkAllRead={() => void notifications.markAllRead().catch(() => undefined)}
      onOpen={setAnchor}
      onOpenNotification={openNotification}
      onRetry={() => void notifications.retry()}
      renderNotification={renderNotification}
      retryLabel={t('notifications.retry')}
      title={t('notifications.title')}
      unreadCount={notifications.feed?.unreadCount ?? 0}
      updating={notifications.updating}
    />
  );
}
