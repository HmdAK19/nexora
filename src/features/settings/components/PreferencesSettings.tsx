import { useTranslation } from 'react-i18next';
import { FormControlLabel, MenuItem, Stack, Switch, TextField } from '@mui/material';

import { setColorMode, useAppDispatch, useAppSelector } from '@app/store';
import { useLanguage } from '@shared/hooks';
import type { Language } from '@shared/model';

import type { SettingsController } from '../hooks';
import { styles } from '../Settings.styles';

export function PreferencesSettings({ controller }: { controller: SettingsController }) {
  const { t } = useTranslation();
  const { changeLanguage, lang } = useLanguage();
  const dispatch = useAppDispatch();
  const colorMode = useAppSelector((state) => state.preferences.colorMode);

  return (
    <Stack spacing={3}>
      <TextField
        label={t('settings.language')}
        select
        value={lang}
        onChange={(event) => changeLanguage(event.target.value as Language)}
        sx={styles.textField10}
      >
        <MenuItem value="fa">{t('settings.languages.fa')}</MenuItem>
        <MenuItem value="en">{t('settings.languages.en')}</MenuItem>
      </TextField>
      <TextField
        label={t('settings.theme')}
        select
        value={colorMode}
        onChange={(event) => dispatch(setColorMode(event.target.value as 'dark' | 'light'))}
        sx={styles.textField11}
      >
        <MenuItem value="dark">{t('settings.themes.dark')}</MenuItem>
        <MenuItem value="light">{t('settings.themes.light')}</MenuItem>
      </TextField>
      <FormControlLabel
        control={
          <Switch
            checked={controller.tradingNotifications}
            onChange={(event) => controller.setTradingNotifications(event.target.checked)}
          />
        }
        label={t('settings.notifications')}
      />
      <FormControlLabel
        control={
          <Switch
            checked={controller.priceAlerts}
            onChange={(event) => controller.setPriceAlerts(event.target.checked)}
          />
        }
        label={t('settings.priceAlerts')}
      />
    </Stack>
  );
}
