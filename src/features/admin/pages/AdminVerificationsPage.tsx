import { useTranslation } from 'react-i18next';
import { Check, X } from 'lucide-react';
import { Alert, Avatar, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';

import { NAMESPACES } from '@app/i18n';
import { Authorized } from '@features/auth';
import { PERMISSIONS } from '@shared/lib';
import { PageFeedback } from '@shared/ui';

import { AdminQueryState } from '../components';
import { useAdminVerifications } from '../hooks';
import { styles } from '../Admin.styles';

export default function AdminVerificationsPage() {
  const { t } = useTranslation(NAMESPACES.admin);
  const { review, verifications } = useAdminVerifications();

  if (!verifications.data) {
    return (
      <AdminQueryState
        error={verifications.error}
        loading={verifications.isLoading}
        retry={() => void verifications.refetch()}
      />
    );
  }

  if (verifications.data.length === 0) {
    return (
      <PageFeedback title={t('verifications.empty')} description={t('verifications.emptyDescription')} />
    );
  }

  return (
    <Grid container spacing={2}>
      {review.error && (
        <Grid size={12}>
          <Alert severity="error">{t('states.mutationError')}</Alert>
        </Grid>
      )}
      {verifications.data.map((verification) => (
        <Grid key={verification.user.id} size={{ xs: 12, lg: 6 }}>
          <Card sx={styles.fullHeightCard}>
            <CardContent>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar>{verification.user.name[0]}</Avatar>
                <span>
                  <Typography fontWeight={800}>{verification.user.name}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {verification.document?.name ?? t('verifications.noDocument')}
                  </Typography>
                </span>
              </Stack>
              <Authorized permission={PERMISSIONS.admin.verificationReview}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={styles.actions}>
                  <Button
                    color="success"
                    disabled={review.isPending}
                    startIcon={<Check size={16} />}
                    variant="contained"
                    onClick={() => review.mutate({ decision: 'approved', userId: verification.user.id })}
                  >
                    {t('actions.approve')}
                  </Button>
                  <Button
                    color="error"
                    disabled={review.isPending}
                    startIcon={<X size={16} />}
                    variant="outlined"
                    onClick={() => review.mutate({ decision: 'rejected', userId: verification.user.id })}
                  >
                    {t('actions.reject')}
                  </Button>
                </Stack>
              </Authorized>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
