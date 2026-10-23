import { useMemo, useState } from 'react';

import type { WalletTransaction } from '@shared/model';

import { useWalletAssets, useWalletTransactions } from './useWallet';

export interface TransferSelection {
  asset?: string;
  mode: 'deposit' | 'withdraw';
}

export function useWalletPage() {
  const [hidden, setHidden] = useState(false);
  const [search, setSearch] = useState('');
  const [transfer, setTransfer] = useState<TransferSelection | null>(null);
  const [completed, setCompleted] = useState<WalletTransaction | null>(null);
  const assetsQuery = useWalletAssets();
  const transactionsQuery = useWalletTransactions();
  const assets = useMemo(() => assetsQuery.data ?? [], [assetsQuery.data]);
  const filteredAssets = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return assets.filter((asset) => `${asset.symbol} ${asset.name}`.toLowerCase().includes(normalizedSearch));
  }, [assets, search]);
  const total = useMemo(() => assets.reduce((sum, asset) => sum + asset.value, 0), [assets]);

  const openTransfer = (mode: TransferSelection['mode'], asset?: string) => {
    setTransfer({ asset, mode });
  };

  return {
    assets,
    assetsQuery,
    completed,
    filteredAssets,
    hidden,
    openTransfer,
    search,
    setCompleted,
    setHidden,
    setSearch,
    setTransfer,
    total,
    transactionsQuery,
    transfer,
  };
}
