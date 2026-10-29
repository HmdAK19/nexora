import type { Permission, User } from '@shared/model';

export const PERMISSIONS = {
  admin: {
    auditRead: 'admin:audit:read',
    overviewRead: 'admin:overview:read',
    settingsManage: 'admin:settings:manage',
    settingsRead: 'admin:settings:read',
    supportRead: 'admin:support:read',
    supportReply: 'admin:support:reply',
    usersRead: 'admin:users:read',
    verificationRead: 'admin:verification:read',
    verificationReview: 'admin:verification:review',
  },
  cards: 'cards:access',
  convert: 'convert:access',
  dashboard: 'dashboard:access',
  markets: 'markets:access',
  orders: 'orders:access',
  purchase: 'purchase:access',
  referrals: 'referrals:access',
  support: 'support:access',
  verification: 'verification:access',
  wallet: 'wallet:access',
} as const satisfies Record<string, Permission | Record<string, Permission>>;

export const ADMIN_ENTRY_PERMISSIONS = [
  PERMISSIONS.admin.overviewRead,
  PERMISSIONS.admin.usersRead,
  PERMISSIONS.admin.verificationRead,
  PERMISSIONS.admin.supportRead,
  PERMISSIONS.admin.settingsRead,
] as const satisfies readonly Permission[];

export const hasPermission = (user: User | null, permission: Permission): boolean =>
  Boolean(user?.permissions.includes(permission));

export const hasEveryPermission = (user: User | null, permissions: readonly Permission[]): boolean =>
  permissions.every((permission) => hasPermission(user, permission));

export const hasSomePermission = (user: User | null, permissions: readonly Permission[]): boolean =>
  permissions.some((permission) => hasPermission(user, permission));

export const getDefaultAuthorizedPath = (user: User | null): string => {
  if (hasPermission(user, PERMISSIONS.dashboard)) return '/';

  const adminDestinations = [
    [PERMISSIONS.admin.overviewRead, '/admin/overview'],
    [PERMISSIONS.admin.usersRead, '/admin/users'],
    [PERMISSIONS.admin.verificationRead, '/admin/verifications'],
    [PERMISSIONS.admin.supportRead, '/admin/support'],
    [PERMISSIONS.admin.settingsRead, '/admin/settings'],
  ] as const;

  return adminDestinations.find(([permission]) => hasPermission(user, permission))?.[1] ?? '/forbidden';
};
