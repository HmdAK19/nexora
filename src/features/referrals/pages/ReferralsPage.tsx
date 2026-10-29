import { Copy, Gift, Share2, UserCheck, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { NAMESPACES } from '@app/i18n';
import { useLanguage } from '@shared/hooks';
import { DashboardPageSkeleton, PageFeedback, PageHeading, StatCard } from '@shared/ui';

import { ReferralList } from '../components';
import { useReferrals } from '../hooks';
import { styles } from './ReferralsPage.styles';

export default function ReferralsPage() {
  const { t } = useTranslation(NAMESPACES.referrals);
  const { lang } = useLanguage();
  const referrals = useReferrals();
  const locale = lang === 'fa' ? 'fa-IR' : 'en-US';

  if (referrals.loading) return <DashboardPageSkeleton />;
  if (referrals.error || !referrals.summary)
    return (
      <PageFeedback
        type="error"
        title={t('errors.load')}
        actionLabel={t('retry')}
        onAction={() => void referrals.retry()}
      />
    );

  const summary = referrals.summary;
  const formatNumber = (value: number) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);
  const formatDate = (value: string) =>
    new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(value));

  return (
    <Box>
      <PageHeading title={t('title')} description={t('description')} />
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={styles.inviteCard}>
            <CardContent sx={styles.inviteContent}>
              <Box sx={styles.gift}>
                <Gift size={28} />
              </Box>
              <Typography fontWeight={850} variant="h5">
                {t('reward', { rate: formatNumber(summary.rewardRate) })}
              </Typography>
              <Typography color="text.secondary">{t('shareHint')}</Typography>
              <TextField
                fullWidth
                label={t('codeLabel')}
                value={summary.code}
                sx={styles.code}
                slotProps={{
                  input: {
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button startIcon={<Copy size={16} />} onClick={() => void referrals.copyCode()}>
                          {t('copy')}
                        </Button>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Button
                startIcon={<Share2 size={17} />}
                variant="outlined"
                onClick={() => void referrals.share(t('share.title'), t('share.text'))}
              >
                {t('share.action')}
              </Button>
              {referrals.feedback && (
                <Alert role="status" severity={referrals.feedback === 'copied' ? 'success' : 'error'}>
                  {t(referrals.feedback === 'copied' ? 'copied' : 'errors.copy')}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 2.5 }}>
          <StatCard
            label={t('friends')}
            value={formatNumber(summary.inviteCount)}
            icon={<Users size={20} />}
            helper={t('friendsHelper')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 2.5 }}>
          <StatCard
            label={t('qualified')}
            value={formatNumber(summary.qualifiedCount)}
            icon={<UserCheck size={20} />}
            helper={t('qualifiedHelper')}
            accent="#10b981"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                gap={1}
                sx={styles.historyHeading}
              >
                <Typography variant="h6" fontWeight={800}>
                  {t('history')}
                </Typography>
                <Typography color="success.main" fontWeight={800}>
                  {t('earned', {
                    amount: formatNumber(summary.rewardTotal),
                    currency: summary.rewardCurrency,
                  })}
                </Typography>
              </Stack>
              <ReferralList
                currency={summary.rewardCurrency}
                entries={summary.referrals}
                emptyLabel={t('empty')}
                formatDate={formatDate}
                formatReward={(value, currency) => `${formatNumber(value)} ${currency}`}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
