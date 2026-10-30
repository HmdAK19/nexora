import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import { AppLayout } from '@app/layouts';
import { ADMIN_ENTRY_PERMISSIONS, PERMISSIONS } from '@shared/lib';
import type { Permission } from '@shared/model';
import { DashboardPageSkeleton } from '@shared/ui';

import { ProtectedRoute } from './ProtectedRoute';
import { AuthorizedRoute } from './AuthorizedRoute';
import { ForbiddenPage } from './ForbiddenPage';

const LoginPage = lazy(() => import('@features/auth').then(({ LoginPage }) => ({ default: LoginPage })));
const RegisterPage = lazy(() =>
  import('@features/auth').then(({ RegisterPage }) => ({ default: RegisterPage }))
);
const DashboardPage = lazy(() =>
  import('@features/dashboard').then(({ DashboardPage }) => ({ default: DashboardPage }))
);
const MarketsPage = lazy(() =>
  import('@features/markets').then(({ MarketsPage }) => ({ default: MarketsPage }))
);
const TradePage = lazy(() => import('@features/trade').then(({ TradePage }) => ({ default: TradePage })));
const WalletPage = lazy(() => import('@features/wallet').then(({ WalletPage }) => ({ default: WalletPage })));
const OrdersPage = lazy(() => import('@features/orders').then(({ OrdersPage }) => ({ default: OrdersPage })));
const SettingsPage = lazy(() =>
  import('@features/settings').then(({ SettingsPage }) => ({ default: SettingsPage }))
);
const VerificationPage = lazy(() =>
  import('@features/verification').then(({ VerificationPage }) => ({ default: VerificationPage }))
);
const CardsPage = lazy(() => import('@features/cards').then(({ CardsPage }) => ({ default: CardsPage })));
const SupportPage = lazy(() =>
  import('@features/support').then(({ SupportPage }) => ({ default: SupportPage }))
);
const ConvertPage = lazy(() =>
  import('@features/convert').then(({ ConvertPage }) => ({ default: ConvertPage }))
);
const BuyCryptoPage = lazy(() =>
  import('@features/buy').then(({ BuyCryptoPage }) => ({ default: BuyCryptoPage }))
);
const ReferralsPage = lazy(() =>
  import('@features/referrals').then(({ ReferralsPage }) => ({ default: ReferralsPage }))
);
const AdminLayout = lazy(() =>
  import('@features/admin').then(({ AdminLayout }) => ({ default: AdminLayout }))
);
const AdminIndexPage = lazy(() =>
  import('@features/admin').then(({ AdminIndexPage }) => ({ default: AdminIndexPage }))
);
const AdminOverviewPage = lazy(() =>
  import('@features/admin').then(({ AdminOverviewPage }) => ({ default: AdminOverviewPage }))
);
const AdminUsersPage = lazy(() =>
  import('@features/admin').then(({ AdminUsersPage }) => ({ default: AdminUsersPage }))
);
const AdminVerificationsPage = lazy(() =>
  import('@features/admin').then(({ AdminVerificationsPage }) => ({ default: AdminVerificationsPage }))
);
const AdminSupportPage = lazy(() =>
  import('@features/admin').then(({ AdminSupportPage }) => ({ default: AdminSupportPage }))
);
const AdminSettingsPage = lazy(() =>
  import('@features/admin').then(({ AdminSettingsPage }) => ({ default: AdminSettingsPage }))
);
const lazyPage = (page: React.ReactNode) => <Suspense fallback={<DashboardPageSkeleton />}>{page}</Suspense>;
const authorizedPage = (permission: Permission, page: React.ReactNode) => (
  <AuthorizedRoute permission={permission}>{lazyPage(page)}</AuthorizedRoute>
);
export const router = createBrowserRouter([
  {
    path: '/login',
    element: lazyPage(<LoginPage />),
  },
  {
    path: '/register',
    element: lazyPage(<RegisterPage />),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: authorizedPage(PERMISSIONS.dashboard, <DashboardPage />),
          },
          {
            path: 'markets',
            element: authorizedPage(PERMISSIONS.markets, <MarketsPage />),
          },
          {
            path: 'trade/:symbol',
            element: authorizedPage(PERMISSIONS.orders, <TradePage />),
          },
          {
            path: 'wallet',
            element: authorizedPage(PERMISSIONS.wallet, <WalletPage />),
          },
          {
            path: 'orders',
            element: authorizedPage(PERMISSIONS.orders, <OrdersPage />),
          },
          {
            path: 'settings',
            element: lazyPage(<SettingsPage />),
          },
          {
            path: 'verification',
            element: authorizedPage(PERMISSIONS.verification, <VerificationPage />),
          },
          {
            path: 'cards',
            element: authorizedPage(PERMISSIONS.cards, <CardsPage />),
          },
          {
            path: 'support',
            element: authorizedPage(PERMISSIONS.support, <SupportPage />),
          },
          {
            path: 'convert',
            element: authorizedPage(PERMISSIONS.convert, <ConvertPage />),
          },
          {
            path: 'buy-crypto',
            element: authorizedPage(PERMISSIONS.purchase, <BuyCryptoPage />),
          },
          {
            path: 'referrals',
            element: authorizedPage(PERMISSIONS.referrals, <ReferralsPage />),
          },
          {
            path: 'admin',
            element: (
              <AuthorizedRoute anyOf={ADMIN_ENTRY_PERMISSIONS}>{lazyPage(<AdminLayout />)}</AuthorizedRoute>
            ),
            children: [
              {
                index: true,
                element: lazyPage(<AdminIndexPage />),
              },
              {
                path: 'overview',
                element: (
                  <AuthorizedRoute permission={PERMISSIONS.admin.overviewRead}>
                    {lazyPage(<AdminOverviewPage />)}
                  </AuthorizedRoute>
                ),
              },
              {
                path: 'users',
                element: (
                  <AuthorizedRoute permission={PERMISSIONS.admin.usersRead}>
                    {lazyPage(<AdminUsersPage />)}
                  </AuthorizedRoute>
                ),
              },
              {
                path: 'verifications',
                element: (
                  <AuthorizedRoute permission={PERMISSIONS.admin.verificationRead}>
                    {lazyPage(<AdminVerificationsPage />)}
                  </AuthorizedRoute>
                ),
              },
              {
                path: 'support',
                element: (
                  <AuthorizedRoute permission={PERMISSIONS.admin.supportRead}>
                    {lazyPage(<AdminSupportPage />)}
                  </AuthorizedRoute>
                ),
              },
              {
                path: 'settings',
                element: (
                  <AuthorizedRoute permission={PERMISSIONS.admin.settingsRead}>
                    {lazyPage(<AdminSettingsPage />)}
                  </AuthorizedRoute>
                ),
              },
            ],
          },
          {
            path: 'forbidden',
            element: <ForbiddenPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
