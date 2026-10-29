import type { ReactNode } from 'react';

import type { Permission } from '@shared/model';

import { useAuthorization } from '../hooks';

interface AuthorizedProps {
  children: ReactNode;
  fallback?: ReactNode;
  permission: Permission;
}

export function Authorized({ children, fallback = null, permission }: AuthorizedProps) {
  const { can } = useAuthorization();

  return can(permission) ? children : fallback;
}
