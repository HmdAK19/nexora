import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { verificationApi, verificationKeys } from '../api';
import { isValidVerificationProfile, validateVerificationDocument } from '../lib';
import type { VerificationProfile } from '../model';

export function useVerification() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [document, setDocument] = useState<File>();
  const verification = useQuery({ queryKey: verificationKeys.current(), queryFn: verificationApi.get });
  const saveProfile = useMutation({ mutationFn: verificationApi.saveProfile });
  const uploadDocument = useMutation({ mutationFn: verificationApi.uploadDocument });
  const submit = useMutation({ mutationFn: verificationApi.submit });

  useEffect(() => {
    if (!verification.data) return;
    if (verification.data.status === 'pending' || verification.data.status === 'verified') setStep(2);
  }, [verification.data]);

  const documentError = document ? validateVerificationDocument(document) : null;
  const locked = verification.data?.status === 'pending' || verification.data?.status === 'verified';

  async function continueToDocument(profile: VerificationProfile) {
    if (!isValidVerificationProfile(profile.fullName, profile.nationalId) || saveProfile.isPending) return;
    try {
      await saveProfile.mutateAsync({
        ...profile,
        fullName: profile.fullName.trim(),
        nationalId: profile.nationalId.trim(),
      });
      setStep(1);
    } catch {
      // Mutation state exposes a recoverable localized error.
    }
  }

  async function submitCase() {
    if (locked || submit.isPending || uploadDocument.isPending || documentError) return;
    try {
      if (document) await uploadDocument.mutateAsync(document);
      else if (!verification.data?.document) return;
      const result = await submit.mutateAsync();
      queryClient.setQueryData(verificationKeys.current(), result);
      setStep(2);
    } catch {
      // Mutation state exposes a recoverable localized error.
    }
  }

  return {
    continueToDocument,
    document,
    documentError,
    error: verification.error ?? saveProfile.error ?? uploadDocument.error ?? submit.error,
    loading: verification.isLoading,
    locked,
    pending: saveProfile.isPending || uploadDocument.isPending || submit.isPending,
    record: verification.data,
    retry: verification.refetch,
    setDocument,
    setStep,
    step,
    submitCase,
  };
}
