export type ReferralStatus = 'joined' | 'qualified' | 'rewarded';

export interface ReferralEntry {
  createdAt: string;
  id: string;
  inviteeName: string;
  rewardAmount: number;
  status: ReferralStatus;
}

export interface ReferralSummary {
  code: string;
  inviteCount: number;
  qualifiedCount: number;
  referrals: ReferralEntry[];
  rewardCurrency: 'USDT';
  rewardRate: number;
  rewardTotal: number;
}
