import { apiClient } from '@shared/api';
import type { WalletAsset, WalletTransaction } from '@shared/model';

export interface CreateWalletTransferInput {
  asset: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  network: string;
  address?: string;
}
export const walletKeys = {
  all: ['wallet'] as const,
  assets: () => [...walletKeys.all, 'assets'] as const,
  transactions: () => [...walletKeys.all, 'transactions'] as const,
};
export const walletApi = {
  getAssets: async (): Promise<WalletAsset[]> => (await apiClient.get<WalletAsset[]>('/wallet')).data,
  getTransactions: async (): Promise<WalletTransaction[]> =>
    (await apiClient.get<WalletTransaction[]>('/wallet/transactions')).data,
  createTransfer: async (input: CreateWalletTransferInput): Promise<WalletTransaction> =>
    (await apiClient.post<WalletTransaction>('/wallet/transfers', input)).data,
};
