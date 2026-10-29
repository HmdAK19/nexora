import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { supportApi, supportKeys } from '../api';
import { supportLimits, type CreateTicketFormValues } from '../model';

export function useSupportCenter() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string>();
  const [reply, setReply] = useState('');
  const [replyTouched, setReplyTouched] = useState(false);

  const ticketsQuery = useQuery({
    queryKey: supportKeys.tickets(),
    queryFn: supportApi.listTickets,
  });
  const ticketQuery = useQuery({
    queryKey: supportKeys.detail(selectedTicketId ?? ''),
    queryFn: () => {
      if (!selectedTicketId) throw new Error('Ticket ID is required');

      return supportApi.getTicket(selectedTicketId);
    },
    enabled: Boolean(selectedTicketId),
  });

  async function synchronizeTicket(id: string) {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: supportKeys.tickets() }),
      queryClient.invalidateQueries({ queryKey: supportKeys.detail(id) }),
    ]);
  }

  const createMutation = useMutation({
    mutationFn: supportApi.createTicket,
    onSuccess: async (ticket) => {
      setCreateOpen(false);
      setSelectedTicketId(ticket.id);
      queryClient.setQueryData(supportKeys.detail(ticket.id), ticket);
      await queryClient.invalidateQueries({ queryKey: supportKeys.tickets() });
    },
  });
  const replyMutation = useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) => supportApi.reply(id, message),
    onSuccess: async (ticket) => {
      setReply('');
      setReplyTouched(false);
      queryClient.setQueryData(supportKeys.detail(ticket.id), ticket);
      await synchronizeTicket(ticket.id);
    },
  });
  const closeMutation = useMutation({
    mutationFn: supportApi.closeTicket,
    onSuccess: async (ticket) => {
      queryClient.setQueryData(supportKeys.detail(ticket.id), ticket);
      await synchronizeTicket(ticket.id);
    },
  });

  const replyValid =
    reply.trim().length >= supportLimits.messageMinLength &&
    reply.trim().length <= supportLimits.messageMaxLength;

  return {
    closeCreate: () => {
      if (createMutation.isPending) return;

      createMutation.reset();
      setCreateOpen(false);
    },
    closeDetails: () => {
      if (replyMutation.isPending || closeMutation.isPending) return;

      replyMutation.reset();
      closeMutation.reset();
      setSelectedTicketId(undefined);
    },
    closeError: closeMutation.error,
    closeTicket: () => selectedTicketId && closeMutation.mutate(selectedTicketId),
    closing: closeMutation.isPending,
    createError: createMutation.error,
    createOpen,
    createPending: createMutation.isPending,
    createTicket: (values: CreateTicketFormValues) => createMutation.mutate(values),
    detailsOpen: Boolean(selectedTicketId),
    openCreate: () => {
      createMutation.reset();
      setCreateOpen(true);
    },
    openTicket: (id: string) => {
      replyMutation.reset();
      closeMutation.reset();
      setReply('');
      setReplyTouched(false);
      setSelectedTicketId(id);
    },
    reply,
    replyError: replyMutation.error,
    replyPending: replyMutation.isPending,
    replyTouched,
    replyValid,
    selectedTicket: ticketQuery.data,
    selectedTicketError: ticketQuery.error,
    selectedTicketLoading: ticketQuery.isLoading,
    sendReply: () =>
      selectedTicketId && replyValid && replyMutation.mutate({ id: selectedTicketId, message: reply }),
    setReply,
    touchReply: () => setReplyTouched(true),
    tickets: ticketsQuery.data ?? [],
    ticketsError: ticketsQuery.error,
    ticketsLoading: ticketsQuery.isLoading,
    retryTickets: ticketsQuery.refetch,
  };
}
