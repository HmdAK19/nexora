import { describe, expect, it } from 'vitest';

import { formatRelativeNotificationTime } from './notification';

describe('formatRelativeNotificationTime', () => {
  it('formats past timestamps using the requested locale', () => {
    const now = new Date('2026-10-30T10:00:00.000Z').getTime();

    expect(formatRelativeNotificationTime('2026-10-30T08:00:00.000Z', 'en', now)).toBe('2 hours ago');
    expect(formatRelativeNotificationTime('2026-10-29T10:00:00.000Z', 'fa', now)).toContain('روز');
  });
});
