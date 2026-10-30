import { useTranslation } from 'react-i18next';
import { Bell, LockKeyhole } from 'lucide-react';
import { Alert, Button, Chip, CircularProgress, Divider, Stack } from '@mui/material';

import type { SettingsController } from '../hooks';
import { SettingRow } from './SettingRow';

export function SecuritySettings({ controller }: { controller: SettingsController }) {
  const { i18n, t } = useTranslation();
  const { accountSecurity } = controller;

  if (accountSecurity.loading) {
    return (
      <Stack alignItems="center" py={4}>
        <CircularProgress aria-label={t('settings.loadingSecurity')} size={28} />
      </Stack>
    );
  }

  if (accountSecurity.error || !accountSecurity.security) {
    return (
      <Alert
        action={<Button onClick={() => void accountSecurity.refresh()}>{t('common.retry')}</Button>}
        severity="error"
      >
        {t('settings.securityLoadError')}
      </Alert>
    );
  }

  const passwordChangedAt = new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium' }).format(
    new Date(accountSecurity.security.passwordChangedAt)
  );

  return (
    <Stack divider={<Divider flexItem />} spacing={2.5}>
      <SettingRow
        icon={<LockKeyhole size={19} />}
        title={t('settings.twoFactor')}
        description={t('settings.twoFactorDescription')}
        control={
          <Stack alignItems="center" direction="row" spacing={1}>
            <Chip
              color={accountSecurity.security.twoFactorEnabled ? 'success' : 'default'}
              label={t(
                accountSecurity.security.twoFactorEnabled ? 'settings.enabled' : 'settings.setupRequired'
              )}
              size="small"
            />
            <Button onClick={() => controller.setSecurityDialog('mfa')} variant="outlined">
              {t(accountSecurity.security.twoFactorEnabled ? 'settings.disable' : 'settings.enable')}
            </Button>
          </Stack>
        }
      />
      <SettingRow
        icon={<Bell size={19} />}
        title={t('settings.loginActivity')}
        description={t('settings.loginActivityDescription')}
        control={
          <Button onClick={() => controller.setSecurityDialog('sessions')}>
            {t('settings.viewSessions')}
          </Button>
        }
      />
      <SettingRow
        icon={<LockKeyhole size={19} />}
        title={t('settings.password')}
        description={t('settings.passwordChangedAt', { date: passwordChangedAt })}
        control={
          <Button onClick={() => controller.setSecurityDialog('password')}>
            {t('settings.changePassword')}
          </Button>
        }
      />
    </Stack>
  );
}
