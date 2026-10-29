import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useTransientState } from '@shared/hooks';

import { referralKeys, referralsApi } from '../api';

type ShareFeedback = 'copied' | 'error' | null;

export function useReferrals() {
  const summary = useQuery({ queryKey: referralKeys.summary, queryFn: referralsApi.getSummary });
  const [feedback, showFeedback] = useTransientState<ShareFeedback>(null);

  const copyCode = useCallback(async () => {
    if (!summary.data) return;

    try {
      await navigator.clipboard.writeText(summary.data.code);
      showFeedback('copied');
    } catch {
      showFeedback('error');
    }
  }, [showFeedback, summary.data]);

  const share = useCallback(
    async (title: string, text: string) => {
      if (!summary.data) return;
      const url = `${window.location.origin}/login?ref=${encodeURIComponent(summary.data.code)}`;

      if (navigator.share) {
        try {
          await navigator.share({ title, text, url });
          return;
        } catch (error) {
          if (error instanceof DOMException && error.name === 'AbortError') return;
        }
      }

      try {
        await navigator.clipboard.writeText(url);
        showFeedback('copied');
      } catch {
        showFeedback('error');
      }
    },
    [showFeedback, summary.data]
  );

  return {
    copyCode,
    error: summary.error,
    feedback,
    loading: summary.isLoading,
    retry: summary.refetch,
    share,
    summary: summary.data,
  };
}
