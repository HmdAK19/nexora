import { useTranslation } from 'react-i18next';
import { Bell, LockKeyhole } from 'lucide-react';
import { Button, Divider, Stack } from '@mui/material';

import type { SettingsController } from '../hooks';
import { SettingRow } from './SettingRow';

export function SecuritySettings({ controller }: { controller: SettingsController }) {
  const { t } = useTranslation();

  return (
    <Stack divider={<Divider flexItem />} spacing={2.5}>
      <SettingRow
        icon={<LockKeyhole size={19} />}
        title={t('settings.twoFactor')}
        description={t('settings.twoFactorDescription')}
        control={
          <Button variant="outlined" onClick={controller.toggleTwoFactor}>
            {t(controller.twoFactorEnabled ? 'settings.disable' : 'settings.enable')}
          </Button>
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
        description={t('settings.passwordDescription')}
        control={
          <Button onClick={() => controller.setSecurityDialog('password')}>
            {t('settings.changePassword')}
          </Button>
        }
      />
    </Stack>
  );
}
