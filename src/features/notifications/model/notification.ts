export const notificationKinds = [
  'order_placed',
  'security_recommendation',
  'verification_reminder',
] as const;

export type NotificationKind = (typeof notificationKinds)[number];

export interface AccountNotification {
  actionPath: string;
  createdAt: string;
  id: string;
  kind: NotificationKind;
  metadata: Record<string, string>;
  readAt: string | null;
}

export interface NotificationFeed {
  items: AccountNotification[];
  unreadCount: number;
}

export const notificationTranslationKeys: Record<NotificationKind, { body: string; title: string }> = {
  order_placed: { body: 'notifications.orderBody', title: 'notifications.orderTitle' },
  security_recommendation: {
    body: 'notifications.securityBody',
    title: 'notifications.securityTitle',
  },
  verification_reminder: {
    body: 'notifications.kycBody',
    title: 'notifications.kycTitle',
  },
};

export function formatRelativeNotificationTime(value: string, locale: string, now = Date.now()) {
  const difference = new Date(value).getTime() - now;
  const units = [
    { milliseconds: 86_400_000, unit: 'day' },
    { milliseconds: 3_600_000, unit: 'hour' },
    { milliseconds: 60_000, unit: 'minute' },
  ] as const;
  const selected = units.find(({ milliseconds }) => Math.abs(difference) >= milliseconds) ?? units[2];
  return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(
    Math.round(difference / selected.milliseconds),
    selected.unit
  );
}
