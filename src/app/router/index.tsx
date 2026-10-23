import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import { AppLayout } from '@app/layouts';
import { PageLoader } from '@shared/ui';

import { ProtectedRoute } from './ProtectedRoute';

const LoginPage = lazy(() => import('@features/auth').then(({ LoginPage }) => ({ default: LoginPage })));
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
const AdminPage = lazy(() => import('@features/admin').then(({ AdminPage }) => ({ default: AdminPage })));
const lazyPage = (page: React.ReactNode) => <Suspense fallback={<PageLoader />}>{page}</Suspense>;
export const router = createBrowserRouter([
  {
    path: '/login',
    element: lazyPage(<LoginPage />),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: lazyPage(<DashboardPage />),
          },
          {
            path: 'markets',
            element: lazyPage(<MarketsPage />),
          },
          {
            path: 'trade/:symbol',
            element: lazyPage(<TradePage />),
          },
          {
            path: 'wallet',
            element: lazyPage(<WalletPage />),
          },
          {
            path: 'orders',
            element: lazyPage(<OrdersPage />),
          },
          {
            path: 'settings',
            element: lazyPage(<SettingsPage />),
          },
          {
            path: 'verification',
            element: lazyPage(<VerificationPage />),
          },
          {
            path: 'cards',
            element: lazyPage(<CardsPage />),
          },
          {
            path: 'support',
            element: lazyPage(<SupportPage />),
          },
          {
            path: 'convert',
            element: lazyPage(<ConvertPage />),
          },
          {
            path: 'buy-crypto',
            element: lazyPage(<BuyCryptoPage />),
          },
          {
            path: 'referrals',
            element: lazyPage(<ReferralsPage />),
          },
          {
            path: 'admin',
            element: lazyPage(<AdminPage />),
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
