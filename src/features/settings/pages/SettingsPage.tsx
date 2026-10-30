import { useTranslation } from 'react-i18next';
import { LockKeyhole, MonitorCog, UserRound } from 'lucide-react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';

import { useAuth } from '@features/auth/context';

import { PreferencesSettings, ProfileSettings, SecurityDialogs, SecuritySettings } from '../components';
import { useSettingsPage } from '../hooks';
import { styles } from '../Settings.styles';

export default function SettingsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const controller = useSettingsPage(user);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography component="h1" variant="h1">
          {t('settings.title')}
        </Typography>
        <Typography color="text.secondary" sx={styles.typography1}>
          {t('settings.description')}
        </Typography>
      </Box>
      <Card>
        <Tabs
          value={controller.tab}
          onChange={(_, value: number) => controller.setTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={styles.tabs2}
        >
          <Tab icon={<UserRound size={17} />} iconPosition="start" label={t('settings.profile')} />
          <Tab icon={<LockKeyhole size={17} />} iconPosition="start" label={t('settings.security')} />
          <Tab icon={<MonitorCog size={17} />} iconPosition="start" label={t('settings.preferences')} />
        </Tabs>
        <CardContent sx={styles.cardContent3}>
          {controller.saved && (
            <Alert severity="success" sx={styles.alert4}>
              {t('settings.saved')}
            </Alert>
          )}
          {controller.accountSettings.saveError && (
            <Alert severity="error" sx={styles.alert4}>
              {t('settings.saveError')}
            </Alert>
          )}
          {controller.accountSettings.loading ? (
            <Stack alignItems="center" py={5}>
              <CircularProgress aria-label={t('settings.loading')} size={30} />
            </Stack>
          ) : controller.accountSettings.error ? (
            <Alert
              action={
                <Button onClick={() => void controller.accountSettings.retry()}>{t('common.retry')}</Button>
              }
              severity="error"
            >
              {t('settings.loadError')}
            </Alert>
          ) : (
            <>
              {controller.tab === 0 && <ProfileSettings controller={controller} user={user} />}
              {controller.tab === 1 && <SecuritySettings controller={controller} />}
              {controller.tab === 2 && <PreferencesSettings controller={controller} />}
            </>
          )}
        </CardContent>
      </Card>
      <SecurityDialogs controller={controller} />
    </Stack>
  );
}
