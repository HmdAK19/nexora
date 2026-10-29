import { useTranslation } from 'react-i18next';
import { Activity, CircleDollarSign, ShieldAlert, Users } from 'lucide-react';
import { Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';

import { NAMESPACES } from '@app/i18n';
import { formatCurrency } from '@shared/lib';

import { AdminMetricCard, AdminQueryState } from '../components';
import { useAdminOverview } from '../hooks';
import { styles } from '../Admin.styles';

export default function AdminOverviewPage() {
  const { t } = useTranslation(NAMESPACES.admin);
  const query = useAdminOverview();

  if (!query.data) {
    return (
      <AdminQueryState
        error={query.error}
        loading={query.isLoading}
        loadingVariant="dashboard"
        retry={() => void query.refetch()}
      />
    );
  }

  const { attention, metrics, services } = query.data;

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      <Grid container spacing={{ xs: 2, md: 2.5 }} alignItems="stretch">
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <AdminMetricCard
            icon={Users}
            label={t('metrics.activeUsers')}
            value={String(metrics.activeUsers)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <AdminMetricCard
            icon={CircleDollarSign}
            label={t('metrics.volume24h')}
            value={formatCurrency(metrics.volume24h)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <AdminMetricCard
            icon={Activity}
            label={t('metrics.tradesToday')}
            value={String(metrics.tradesToday)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <AdminMetricCard
            icon={ShieldAlert}
            label={t('metrics.openReviews')}
            value={String(metrics.openReviews)}
          />
        </Grid>
      </Grid>
      <Grid container spacing={{ xs: 2, md: 2.5 }} alignItems="stretch">
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={styles.fullHeightCard}>
            <CardContent>
              <Typography fontWeight={800} variant="h6">
                {t('overview.operationalStatus')}
              </Typography>
              <Stack spacing={1.5} sx={styles.sectionSpacing}>
                {services.map((service) => (
                  <Stack direction="row" gap={1.5} justifyContent="space-between" key={service.key}>
                    <Typography>{t(`services.${service.key}`)}</Typography>
                    <Chip
                      color={service.status === 'operational' ? 'success' : 'warning'}
                      label={t(`serviceStatuses.${service.status}`)}
                      size="small"
                    />
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={styles.fullHeightCard}>
            <CardContent>
              <Typography fontWeight={800} variant="h6">
                {t('overview.needsAttention')}
              </Typography>
              <Stack spacing={1.25} sx={styles.sectionSpacing}>
                <Typography>
                  {attention.openVerifications} {t('overview.verificationRequests')}
                </Typography>
                <Typography>
                  {attention.unansweredTickets} {t('overview.unansweredTickets')}
                </Typography>
                <Typography>
                  {attention.highRiskWithdrawals} {t('overview.highRiskWithdrawals')}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
