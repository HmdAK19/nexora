import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuthorization } from '@features/auth';
import type { Permission } from '@shared/model';

type AuthorizedRouteProps = {
  children: ReactNode;
} & ({ anyOf?: never; permission: Permission } | { anyOf: readonly Permission[]; permission?: never });

export function AuthorizedRoute({ anyOf, children, permission }: AuthorizedRouteProps) {
  const { can, canSome } = useAuthorization();
  const location = useLocation();
  const allowed = permission ? can(permission) : canSome(anyOf);

  if (!allowed) {
    return <Navigate to="/forbidden" replace state={{ from: location.pathname }} />;
  }

  return children;
}
