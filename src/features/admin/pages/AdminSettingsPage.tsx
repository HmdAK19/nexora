import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { Save } from 'lucide-react';
import {
  Alert,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

import { NAMESPACES } from '@app/i18n';
import { Authorized } from '@features/auth';
import { PERMISSIONS } from '@shared/lib';

import { AdminQueryState } from '../components';
import { useAdminSettings } from '../hooks';
import { createAdminSettingsSchema, type AdminSettingsFormValues } from '../lib';
import { styles } from '../Admin.styles';

export default function AdminSettingsPage() {
  const { t } = useTranslation(NAMESPACES.admin);
  const { settings, update } = useAdminSettings();
  const schema = useMemo(
    () =>
      createAdminSettingsSchema({
        minimumWithdrawal: t('settings.validation.minimumWithdrawal'),
        tradingFee: t('settings.validation.tradingFee'),
      }),
    [t]
  );
  const { control, formState, handleSubmit, reset } = useForm<AdminSettingsFormValues>({
    defaultValues: {
      minimumWithdrawal: 0,
      networkEnabled: false,
      paymentProvider: 'manual',
      tradingFeePercent: 0,
      withdrawalsEnabled: false,
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!settings.data) return;
    reset({
      minimumWithdrawal: settings.data.minimumWithdrawal,
      networkEnabled: settings.data.networkEnabled,
      paymentProvider: settings.data.paymentProvider,
      tradingFeePercent: settings.data.tradingFeePercent,
      withdrawalsEnabled: settings.data.withdrawalsEnabled,
    });
  }, [reset, settings.data]);

  if (!settings.data) {
    return (
      <AdminQueryState
        error={settings.error}
        loading={settings.isLoading}
        loadingVariant="form"
        retry={() => void settings.refetch()}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit((values) => update.mutate(values))} noValidate>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={styles.fullHeightCard}>
            <CardContent>
              <Typography fontWeight={800} variant="h6">
                {t('settings.operations')}
              </Typography>
              <Stack sx={styles.sectionSpacing}>
                <Controller
                  control={control}
                  name="networkEnabled"
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch checked={field.value} onChange={(_, checked) => field.onChange(checked)} />
                      }
                      label={t('settings.enableNetwork')}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="withdrawalsEnabled"
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch checked={field.value} onChange={(_, checked) => field.onChange(checked)} />
                      }
                      label={t('settings.enableWithdrawals')}
                    />
                  )}
                />
              </Stack>
              <Controller
                control={control}
                name="paymentProvider"
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t('settings.paymentProvider')}
                    select
                    sx={styles.fieldSpacing}
                  >
                    <MenuItem value="manual">{t('settings.providers.manual')}</MenuItem>
                    <MenuItem value="provider-a">{t('settings.providers.providerA')}</MenuItem>
                  </TextField>
                )}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={styles.fullHeightCard}>
            <CardContent>
              <Typography fontWeight={800} variant="h6">
                {t('settings.financial')}
              </Typography>
              <Controller
                control={control}
                name="tradingFeePercent"
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    error={Boolean(fieldState.error)}
                    fullWidth
                    helperText={fieldState.error?.message}
                    label={t('settings.tradingFee')}
                    sx={styles.fieldSpacing}
                    type="number"
                  />
                )}
              />
              <Controller
                control={control}
                name="minimumWithdrawal"
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    error={Boolean(fieldState.error)}
                    fullWidth
                    helperText={fieldState.error?.message}
                    label={t('settings.minimumWithdrawal')}
                    sx={styles.fieldSpacing}
                    type="number"
                  />
                )}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={12}>
          {update.error && <Alert severity="error">{t('states.mutationError')}</Alert>}
          {update.isSuccess && !formState.isDirty && <Alert severity="success">{t('settings.saved')}</Alert>}
          <Authorized permission={PERMISSIONS.admin.settingsManage}>
            <Button
              disabled={update.isPending || !formState.isDirty}
              startIcon={<Save size={17} />}
              sx={styles.saveButton}
              type="submit"
              variant="contained"
            >
              {t('actions.save')}
            </Button>
          </Authorized>
        </Grid>
      </Grid>
    </form>
  );
}
