import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { settingsApi, settingsKeys } from '../api';
import type { ChangePasswordInput } from '../model';

export function useAccountSecurity() {
  const queryClient = useQueryClient();
  const security = useQuery({ queryKey: settingsKeys.security(), queryFn: settingsApi.getSecurity });
  const changePassword = useMutation({
    mutationFn: (input: ChangePasswordInput) => settingsApi.changePassword(input),
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: settingsKeys.security() }),
  });
  const revokeSession = useMutation({
    mutationFn: settingsApi.revokeSession,
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: settingsKeys.security() }),
  });
  const beginMfa = useMutation({ mutationFn: settingsApi.beginMfaSetup });
  const confirmMfa = useMutation({
    mutationFn: settingsApi.confirmMfaSetup,
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: settingsKeys.security() }),
  });
  const disableMfa = useMutation({
    mutationFn: settingsApi.disableMfa,
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: settingsKeys.security() }),
  });

  const resetMfa = () => {
    beginMfa.reset();
    confirmMfa.reset();
    disableMfa.reset();
  };

  return {
    changePassword: changePassword.mutateAsync,
    changePasswordError: changePassword.error,
    changePasswordPending: changePassword.isPending,
    clearChangePasswordError: changePassword.reset,
    error: security.error,
    loading: security.isLoading,
    refresh: security.refetch,
    revokeError: revokeSession.error,
    revokePendingId: revokeSession.isPending ? revokeSession.variables : undefined,
    revokeSession: revokeSession.mutate,
    security: security.data,
    beginMfa: beginMfa.mutateAsync,
    confirmMfa: confirmMfa.mutateAsync,
    disableMfa: disableMfa.mutateAsync,
    mfaError: beginMfa.error ?? confirmMfa.error ?? disableMfa.error,
    mfaPending: beginMfa.isPending || confirmMfa.isPending || disableMfa.isPending,
    mfaRecoveryCodes: confirmMfa.data?.recoveryCodes,
    mfaSetup: beginMfa.data,
    resetMfa,
  };
}
