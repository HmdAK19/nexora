export const NAMESPACES = {
  admin: 'admin',
  auth: 'auth',
  buy: 'buy',
  common: 'common',
  cards: 'cards',
  convert: 'convert',
  dashboard: 'dashboard',
  layout: 'layout',
  market: 'market',
  orders: 'orders',
  referrals: 'referrals',
  settings: 'settings',
  trade: 'trade',
  support: 'support',
  verification: 'verification',
  wallet: 'wallet',
} as const;

export type Namespace = (typeof NAMESPACES)[keyof typeof NAMESPACES];
export const DEFAULT_NAMESPACE: Namespace = NAMESPACES.common;
