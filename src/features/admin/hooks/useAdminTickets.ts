import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { adminApi, adminKeys } from '../api';

export function useAdminTickets() {
  const queryClient = useQueryClient();
  const tickets = useQuery({ queryKey: adminKeys.tickets(), queryFn: adminApi.listTickets });
  const reply = useMutation({
    mutationFn: adminApi.replyToTicket,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminKeys.tickets() }),
        queryClient.invalidateQueries({ queryKey: adminKeys.overview() }),
      ]);
    },
  });

  return { reply, tickets };
}
