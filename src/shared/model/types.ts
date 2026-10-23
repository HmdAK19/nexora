export type Trend = 'up' | 'down';
export interface User {
  id: string;
  name: string;
  email: string;
  level: 'basic' | 'verified' | 'advanced';
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
