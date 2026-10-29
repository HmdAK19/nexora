import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@app/i18n';
import { PageFeedback, PageLoader } from '@shared/ui';

interface AdminQueryStateProps {
  error: unknown;
  loading: boolean;
  retry: () => void;
}

export function AdminQueryState({ error, loading, retry }: AdminQueryStateProps) {
  const { t } = useTranslation(NAMESPACES.admin);

  if (loading) return <PageLoader />;
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
