import { useQuery } from '@tanstack/react-query';

import { adminApi, adminKeys } from '../api';

export const useAdminUsers = (search: string, page: number, pageSize: number) =>
  useQuery({
    queryKey: adminKeys.users(search, page, pageSize),
    queryFn: () => adminApi.listUsers({ page, pageSize, search }),
    placeholderData: (previousData) => previousData,
  });
