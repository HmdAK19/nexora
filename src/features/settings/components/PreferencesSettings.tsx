import { useTranslation } from 'react-i18next';
import { FormControlLabel, MenuItem, Stack, Switch, TextField } from '@mui/material';

import type { SettingsController } from '../hooks';
import { styles } from '../Settings.styles';

export function PreferencesSettings({ controller }: { controller: SettingsController }) {
  const { t } = useTranslation();
  const preferences = controller.accountSettings.preferences;

  if (!preferences) return null;

  return (
    <Stack spacing={3}>
      <TextField
        label={t('settings.language')}
        select
        disabled={controller.accountSettings.savingPreferences}
        value={preferences.language}
        onChange={(event) =>
          void controller.updatePreferences({ language: event.target.value as 'en' | 'fa' })
        }
        sx={styles.textField10}
      >
        <MenuItem value="fa">{t('settings.languages.fa')}</MenuItem>
        <MenuItem value="en">{t('settings.languages.en')}</MenuItem>
      </TextField>
      <TextField
        label={t('settings.theme')}
        select
        disabled={controller.accountSettings.savingPreferences}
        value={preferences.colorMode}
        onChange={(event) =>
          void controller.updatePreferences({ colorMode: event.target.value as 'dark' | 'light' })
        }
        sx={styles.textField11}
      >
        <MenuItem value="dark">{t('settings.themes.dark')}</MenuItem>
        <MenuItem value="light">{t('settings.themes.light')}</MenuItem>
      </TextField>
      <FormControlLabel
        control={
          <Switch
            checked={preferences.tradingNotifications}
            disabled={controller.accountSettings.savingPreferences}
            onChange={(event) =>
              void controller.updatePreferences({ tradingNotifications: event.target.checked })
            }
          />
        }
        label={t('settings.notifications')}
      />
      <FormControlLabel
        control={
          <Switch
            checked={preferences.priceAlerts}
            disabled={controller.accountSettings.savingPreferences}
            onChange={(event) => void controller.updatePreferences({ priceAlerts: event.target.checked })}
          />
        }
        label={t('settings.priceAlerts')}
      />
    </Stack>
  );
}
