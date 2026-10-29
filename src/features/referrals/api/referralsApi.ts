import { apiClient, isRecord, readFiniteNumber, readIsoDate, readString } from '@shared/api';

import type { ReferralEntry, ReferralStatus, ReferralSummary } from '../model';

const statuses: ReferralStatus[] = ['joined', 'qualified', 'rewarded'];

function parseEntry(value: unknown): ReferralEntry {
  if (!isRecord(value)) throw new Error('Invalid referral entry response');
  const status = readString(value, 'status');

  if (!statuses.includes(status as ReferralStatus)) throw new Error('Invalid referral status');

  return {
    createdAt: readIsoDate(value, 'createdAt'),
    id: readString(value, 'id'),
    inviteeName: readString(value, 'inviteeName'),
    rewardAmount: readFiniteNumber(value, 'rewardAmount'),
    status: status as ReferralStatus,
  };
}

function parseSummary(value: unknown): ReferralSummary {
  if (!isRecord(value) || !Array.isArray(value.referrals) || value.rewardCurrency !== 'USDT') {
    throw new Error('Invalid referral summary response');
  }

  return {
    code: readString(value, 'code'),
    inviteCount: readFiniteNumber(value, 'inviteCount'),
    qualifiedCount: readFiniteNumber(value, 'qualifiedCount'),
    referrals: value.referrals.map(parseEntry),
    rewardCurrency: 'USDT',
    rewardRate: readFiniteNumber(value, 'rewardRate'),
    rewardTotal: readFiniteNumber(value, 'rewardTotal'),
  };
}

export const referralKeys = { summary: ['referrals', 'summary'] as const };

export const referralsApi = {
  getSummary: async (): Promise<ReferralSummary> => parseSummary((await apiClient.get('/referrals')).data),
};
