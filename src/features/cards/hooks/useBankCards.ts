import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { cardKeys, cardsApi } from '../api';
import type { AddBankCardInput } from '../model';

export function useBankCards() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [removeTargetId, setRemoveTargetId] = useState<string | null>(null);
  const cards = useQuery({ queryKey: cardKeys.list(), queryFn: cardsApi.list });
  const create = useMutation({
    mutationFn: cardsApi.create,
    onSuccess: async () => {
      setDialogOpen(false);
      await queryClient.invalidateQueries({ queryKey: cardKeys.list() });
    },
  });
  const remove = useMutation({
    mutationFn: cardsApi.remove,
    onSuccess: async () => {
      setRemoveTargetId(null);
      await queryClient.invalidateQueries({ queryKey: cardKeys.list() });
    },
  });
  const setDefault = useMutation({
    mutationFn: cardsApi.setDefault,
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: cardKeys.list() }),
  });
  return {
    cards: cards.data ?? [],
    closeDialog: () => !create.isPending && setDialogOpen(false),
    createError: create.error,
    createPending: create.isPending,
    dialogOpen,
    error: cards.error,
    loading: cards.isLoading,
    mutationError: remove.error ?? setDefault.error,
    mutationPending: remove.isPending || setDefault.isPending,
    openDialog: () => {
      create.reset();
      setDialogOpen(true);
    },
    removeDialogOpen: removeTargetId !== null,
    requestRemove: setRemoveTargetId,
    cancelRemove: () => !remove.isPending && setRemoveTargetId(null),
    confirmRemove: () => removeTargetId && remove.mutate(removeTargetId),
    removePending: remove.isPending,
    retry: cards.refetch,
    save: (input: AddBankCardInput) => create.mutate(input),
    setDefault: (id: string) => setDefault.mutate(id),
  };
}
