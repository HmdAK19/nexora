export type Trend = 'up' | 'down';
export type UserRole = 'admin' | 'compliance' | 'customer' | 'operations' | 'support';
export type Permission =
  | 'admin:audit:read'
  | 'admin:overview:read'
  | 'admin:settings:manage'
  | 'admin:settings:read'
  | 'admin:support:read'
  | 'admin:support:reply'
  | 'admin:users:read'
  | 'admin:verification:read'
  | 'admin:verification:review'
  | 'cards:access'
  | 'convert:access'
  | 'dashboard:access'
  | 'markets:access'
  | 'orders:access'
  | 'purchase:access'
  | 'referrals:access'
  | 'support:access'
  | 'verification:access'
  | 'wallet:access';

export interface User {
  id: string;
  name: string;
  email: string;
  level: 'basic' | 'verified' | 'advanced';
  permissions: Permission[];
  role: UserRole;
}
export interface AuthResponse {
  accessToken: string;
  user: User;
}
export interface Market {
  id: string;
  symbol: string;
  name: string;
  quote: string;
  price: number;
  change24h: number;
  volume24h: number;
  sparkline: number[];
}
export interface WalletAsset extends Market {
  balance: number;
  available: number;
  value: number;
}
export interface WalletTransaction {
  id: string;
  asset: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  network: string;
  address?: string;
  status: 'completed';
  createdAt: string;
}
export interface Order {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'limit' | 'market';
  price: number;
  amount: number;
  filled: number;
  status: 'open' | 'filled' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  averagePrice: number;
  feeAmount: number;
  quoteAmount: number;
}
export interface DashboardData {
  portfolioValue: number;
  portfolioChange: number;
  availableBalance: number;
  openOrders: number;
  totalTrades: number;
  allocation: Array<{
    symbol: string;
    value: number;
    color: string;
  }>;
  performance: number[];
  activities: Array<{
    id: string;
    title: string;
    subtitle: string;
    amount: number;
    kind: 'buy' | 'sell' | 'deposit';
  }>;
}
export interface Paginated<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}
export interface ApiErrorBody {
  code: string;
  message: string;
  details?: Record<string, string>;
}
