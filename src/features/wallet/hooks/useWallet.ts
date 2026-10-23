import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { walletApi, walletKeys, type CreateWalletTransferInput } from '../api';

export const useWalletAssets = () =>
  useQuery({
    queryKey: walletKeys.assets(),
    queryFn: walletApi.getAssets,
  });
export const useWalletTransactions = () =>
  useQuery({
    queryKey: walletKeys.transactions(),
    queryFn: walletApi.getTransactions,
  });
export const useCreateWalletTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateWalletTransferInput) => walletApi.createTransfer(input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: walletKeys.assets(),
        }),
        queryClient.invalidateQueries({
          queryKey: walletKeys.transactions(),
        }),
      ]);
    },
  });
};
