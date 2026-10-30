import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { settingsApi, settingsKeys } from '../api';
import type { AccountPreferences, ProfileValues } from '../model';

export function useAccountSettings() {
  const queryClient = useQueryClient();
  const profile = useQuery({ queryKey: settingsKeys.profile(), queryFn: settingsApi.getProfile });
  const preferences = useQuery({ queryKey: settingsKeys.preferences(), queryFn: settingsApi.getPreferences });
  const updateProfile = useMutation({
    mutationFn: (input: ProfileValues) => settingsApi.updateProfile(input),
    onSuccess: (data) => queryClient.setQueryData(settingsKeys.profile(), data),
  });
  const updateAvatar = useMutation({
    mutationFn: settingsApi.updateAvatar,
    onSuccess: (data) => queryClient.setQueryData(settingsKeys.profile(), data),
  });
  const updatePreferences = useMutation({
    mutationFn: (input: AccountPreferences) => settingsApi.updatePreferences(input),
    onSuccess: (data) => queryClient.setQueryData(settingsKeys.preferences(), data),
  });

  return {
    avatarPending: updateAvatar.isPending,
    error: profile.error ?? preferences.error,
    loading: profile.isLoading || preferences.isLoading,
    preferences: preferences.data,
    profile: profile.data,
    retry: async () => Promise.all([profile.refetch(), preferences.refetch()]),
    saveAvatar: updateAvatar.mutateAsync,
    saveError: updateProfile.error ?? updateAvatar.error ?? updatePreferences.error,
    savePreferences: updatePreferences.mutateAsync,
    saveProfile: updateProfile.mutateAsync,
    savingPreferences: updatePreferences.isPending,
  };
}
