import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@features/auth/context';
import { PageLoader } from '@shared/ui';

export function ProtectedRoute() {
  const { user, isRestoring } = useAuth();
  const location = useLocation();
  if (isRestoring) return <PageLoader />;
  if (!user)
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  return <Outlet />;
}
