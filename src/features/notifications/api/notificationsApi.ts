import { apiClient, isRecord, readIsoDate, readString } from '@shared/api';

import {
  notificationKinds,
  type AccountNotification,
  type NotificationFeed,
  type NotificationKind,
} from '../model';

function parseMetadata(value: unknown): Record<string, string> {
  if (!isRecord(value) || Object.values(value).some((item) => typeof item !== 'string')) {
    throw new Error('Invalid notification metadata');
  }
  return value as Record<string, string>;
}

function parseNotification(value: unknown): AccountNotification {
  if (!isRecord(value) || !notificationKinds.includes(value.kind as NotificationKind)) {
    throw new Error('Invalid notification response');
  }
  const actionPath = readString(value, 'actionPath');
  if (!/^\/[A-Za-z0-9/_-]*(?:\?[A-Za-z0-9_%=&.-]*)?$/.test(actionPath)) {
    throw new Error('Invalid notification action');
  }
  return {
    actionPath,
    createdAt: readIsoDate(value, 'createdAt'),
    id: readString(value, 'id'),
    kind: value.kind as NotificationKind,
    metadata: parseMetadata(value.metadata),
    readAt: value.readAt === null ? null : readIsoDate(value, 'readAt'),
  };
}

export function parseNotificationFeed(value: unknown): NotificationFeed {
  if (!isRecord(value) || !Array.isArray(value.items) || !Number.isInteger(value.unreadCount)) {
    throw new Error('Invalid notification feed response');
  }
  const items = value.items.map(parseNotification);
  const unreadCount = items.filter((item) => !item.readAt).length;
  if (value.unreadCount !== unreadCount) throw new Error('Invalid notification unread count');
  return { items, unreadCount };
}

export const notificationKeys = { feed: () => ['notifications', 'feed'] as const };

export const notificationsApi = {
  list: async (): Promise<NotificationFeed> =>
    parseNotificationFeed((await apiClient.get('/account/notifications')).data),
  markRead: async (notificationId: string): Promise<NotificationFeed> =>
    parseNotificationFeed(
      (await apiClient.patch(`/account/notifications/${encodeURIComponent(notificationId)}/read`)).data
    ),
  markAllRead: async (): Promise<NotificationFeed> =>
    parseNotificationFeed((await apiClient.post('/account/notifications/read-all')).data),
};
