import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { adminApi, adminKeys } from '../api';

export function useAdminVerifications() {
  const queryClient = useQueryClient();
  const verifications = useQuery({
    queryKey: adminKeys.verifications(),
    queryFn: adminApi.listVerifications,
  });
  const review = useMutation({
    mutationFn: adminApi.reviewVerification,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminKeys.verifications() }),
        queryClient.invalidateQueries({ queryKey: adminKeys.overview() }),
      ]);
    },
  });

  return { review, verifications };
}
