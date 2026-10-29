import { Navigate } from 'react-router-dom';

import { useAuthorization } from '@features/auth';
import { PERMISSIONS } from '@shared/lib';

const destinations = [
  { path: '/admin/overview', permission: PERMISSIONS.admin.overviewRead },
  { path: '/admin/users', permission: PERMISSIONS.admin.usersRead },
  { path: '/admin/verifications', permission: PERMISSIONS.admin.verificationRead },
  { path: '/admin/support', permission: PERMISSIONS.admin.supportRead },
  { path: '/admin/settings', permission: PERMISSIONS.admin.settingsRead },
] as const;

export default function AdminIndexPage() {
  const { can } = useAuthorization();
  const destination = destinations.find(({ permission }) => can(permission));

  return <Navigate to={destination?.path ?? '/forbidden'} replace />;
}
