import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { adminApi, adminKeys } from '../api';

export function useAdminSettings() {
  const queryClient = useQueryClient();
  const settings = useQuery({ queryKey: adminKeys.settings(), queryFn: adminApi.getSettings });
  const update = useMutation({
    mutationFn: adminApi.updateSettings,
    onSuccess: (result) => queryClient.setQueryData(adminKeys.settings(), result),
  });

  return { settings, update };
}
