export interface AdminUser {
  balance: number;
  email: string;
  id: string;
  level: 'advanced' | 'basic' | 'verified';
  name: string;
  role: 'admin' | 'compliance' | 'customer' | 'operations' | 'support';
  status: 'active' | 'blocked';
}

export interface AdminOverview {
  attention: {
    highRiskWithdrawals: number;
    openVerifications: number;
    unansweredTickets: number;
  };
  metrics: {
    activeUsers: number;
    openReviews: number;
    tradesToday: number;
    volume24h: number;
  };
  services: Array<{
    key: 'notifications' | 'trading' | 'verification' | 'wallet';
    status: 'degraded' | 'operational';
  }>;
}

export interface AdminVerification {
  document: {
    mimeType: string;
    name: string;
    uploadedAt: string;
  } | null;
  status: 'pending';
  submittedAt: string;
  user: AdminUser;
}

export interface AdminTicket {
  category: 'account' | 'security' | 'trading' | 'verification' | 'wallet';
  createdAt: string;
  id: string;
  lastMessagePreview: string;
  status: 'closed' | 'open' | 'waiting_for_support' | 'waiting_for_user';
  subject: string;
  updatedAt: string;
  user: AdminUser;
}

export interface AdminSettings {
  minimumWithdrawal: number;
  networkEnabled: boolean;
  paymentProvider: 'manual' | 'provider-a';
  tradingFeePercent: number;
  updatedAt: string;
  withdrawalsEnabled: boolean;
}
