import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';

import { NAMESPACES } from '@app/i18n';
import {
  CardGridPageSkeleton,
  DashboardPageSkeleton,
  FormPageSkeleton,
  PageFeedback,
  TablePageSkeleton,
} from '@shared/ui';

type LoadingVariant = 'cards' | 'dashboard' | 'form' | 'table';

interface AdminQueryStateProps {
  error: unknown;
  loading: boolean;
  loadingVariant?: LoadingVariant;
  retry: () => void;
}

const loadingStates: Record<LoadingVariant, ReactNode> = {
  cards: <CardGridPageSkeleton />,
  dashboard: <DashboardPageSkeleton />,
  form: <FormPageSkeleton />,
  table: <TablePageSkeleton />,
};

export function AdminQueryState({ error, loading, loadingVariant = 'table', retry }: AdminQueryStateProps) {
  const { t } = useTranslation(NAMESPACES.admin);

  if (loading) return loadingStates[loadingVariant];
  if (error) {
    return (
      <PageFeedback
        type="error"
        title={t('states.loadError')}
        description={t('states.loadErrorDescription')}
        actionLabel={t('actions.retry')}
        onAction={retry}
      />
    );
  }

  return null;
}
