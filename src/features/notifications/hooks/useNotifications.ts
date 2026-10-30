import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { notificationKeys, notificationsApi } from '../api';
import type { NotificationFeed } from '../model';

const markItemRead = (feed: NotificationFeed | undefined, id?: string): NotificationFeed | undefined => {
  if (!feed) return feed;
  const readAt = new Date().toISOString();
  const items = feed.items.map((item) =>
    (!id || item.id === id) && !item.readAt ? { ...item, readAt } : item
  );
  return { items, unreadCount: items.filter((item) => !item.readAt).length };
};

export function useNotifications() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryFn: notificationsApi.list,
    queryKey: notificationKeys.feed(),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  const markRead = useMutation({
    mutationFn: notificationsApi.markRead,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.feed() });
      const previous = queryClient.getQueryData<NotificationFeed>(notificationKeys.feed());
      queryClient.setQueryData(notificationKeys.feed(), markItemRead(previous, id));
      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) queryClient.setQueryData(notificationKeys.feed(), context.previous);
    },
    onSuccess: (feed) => queryClient.setQueryData(notificationKeys.feed(), feed),
  });
  const markAllRead = useMutation({
    mutationFn: notificationsApi.markAllRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.feed() });
      const previous = queryClient.getQueryData<NotificationFeed>(notificationKeys.feed());
      queryClient.setQueryData(notificationKeys.feed(), markItemRead(previous));
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(notificationKeys.feed(), context.previous);
    },
    onSuccess: (feed) => queryClient.setQueryData(notificationKeys.feed(), feed),
  });

  return {
    error: query.error ?? markRead.error ?? markAllRead.error,
    feed: query.data,
    loading: query.isLoading,
    markAllRead: markAllRead.mutateAsync,
    markRead: markRead.mutateAsync,
    retry: async () => {
      markRead.reset();
      markAllRead.reset();
      return query.refetch();
    },
    updating: markRead.isPending || markAllRead.isPending,
  };
}
