import { describe, expect, it } from 'vitest';

import type { User } from '@shared/model';

import {
  getDefaultAuthorizedPath,
  hasEveryPermission,
  hasPermission,
  hasSomePermission,
  PERMISSIONS,
} from './authorization';

const customer: User = {
  email: 'demo@nexora.dev',
  id: 'user-demo',
  level: 'verified',
  name: 'Demo User',
  permissions: [],
  role: 'customer',
};

describe('authorization policy', () => {
  it('allows permissions granted to the authenticated role', () => {
    const admin = {
      ...customer,
      permissions: [PERMISSIONS.admin.overviewRead, PERMISSIONS.admin.settingsManage],
      role: 'admin' as const,
    };

    expect(hasPermission(admin, PERMISSIONS.admin.overviewRead)).toBe(true);
    expect(
      hasEveryPermission(admin, [PERMISSIONS.admin.overviewRead, PERMISSIONS.admin.settingsManage])
    ).toBe(true);
  });

  it('denies permissions that are not explicitly granted', () => {
    expect(hasPermission(customer, PERMISSIONS.admin.overviewRead)).toBe(false);
    expect(hasPermission(null, PERMISSIONS.admin.overviewRead)).toBe(false);
    expect(hasEveryPermission(customer, [PERMISSIONS.admin.overviewRead])).toBe(false);
    expect(hasSomePermission(customer, [PERMISSIONS.admin.settingsManage])).toBe(false);
  });

  it('routes limited operators to their first authorized workspace', () => {
    expect(
      getDefaultAuthorizedPath({
        ...customer,
        permissions: [PERMISSIONS.admin.supportRead],
        role: 'support',
      })
    ).toBe('/admin/support');
    expect(getDefaultAuthorizedPath(customer)).toBe('/forbidden');
  });
});
