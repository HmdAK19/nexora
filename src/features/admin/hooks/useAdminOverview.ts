import { useQuery } from '@tanstack/react-query';

import { adminApi, adminKeys } from '../api';

export const useAdminOverview = () =>
  useQuery({ queryKey: adminKeys.overview(), queryFn: adminApi.getOverview });
