import { useCallback } from 'react';

import { hasEveryPermission, hasPermission, hasSomePermission } from '@shared/lib';
import type { Permission } from '@shared/model';

import { useAuth } from '../context';

export function useAuthorization() {
  const { user } = useAuth();

  const can = useCallback((permission: Permission) => hasPermission(user, permission), [user]);
  const canEvery = useCallback(
    (permissions: readonly Permission[]) => hasEveryPermission(user, permissions),
    [user]
  );
  const canSome = useCallback(
    (permissions: readonly Permission[]) => hasSomePermission(user, permissions),
    [user]
  );

  return {
    can,
    canEvery,
    canSome,
  };
}
