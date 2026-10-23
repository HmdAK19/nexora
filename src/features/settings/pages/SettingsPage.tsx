import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { Bell, LockKeyhole, MonitorCog, UserRound } from 'lucide-react';
import * as yup from 'yup';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';

import { setColorMode, useAppDispatch, useAppSelector } from '@app/store';
import { useAuth } from '@features/auth/context';
import { useLanguage, useTransientState } from '@shared/hooks';
import type { Language } from '@shared/model';

import { styles } from './SettingsPage.styles';

interface ProfileValues {
  name: string;
  email: string;
  phone: string;
}
const schema = yup.object({
  name: yup.string().min(2).required(),
  email: yup.string().email().required(),
  phone: yup
    .string()
    .matches(/^\+?[\d\s-]{8,16}$/)
    .required(),
});
export default function SettingsPage() {
  const { t } = useTranslation();
  const { changeLanguage, lang } = useLanguage();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const colorMode = useAppSelector((state) => state.preferences.colorMode);
  const [tab, setTab] = useState(0);
  const [saved, showSaved] = useTransientState(false, 2500);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: '+98 912 000 0000',
    },
    resolver: yupResolver(schema),
  });
  const save = async () => {
    showSaved(true);
  };
  return (
    <Stack spacing={3}>
      <Box>
        <Typography component="h1" variant="h1">
          {t('settings.title')}
        </Typography>
        <Typography color="text.secondary" sx={styles.typography1}>
          Manage your identity, security and application preferences
        </Typography>
      </Box>
      <Card>
        <Tabs
          value={tab}
          onChange={(_, value: number) => setTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={styles.tabs2}
        >
          <Tab icon={<UserRound size={17} />} iconPosition="start" label={t('settings.profile')} />
          <Tab icon={<LockKeyhole size={17} />} iconPosition="start" label={t('settings.security')} />
          <Tab icon={<MonitorCog size={17} />} iconPosition="start" label={t('settings.preferences')} />
        </Tabs>
        <CardContent sx={styles.cardContent3}>
          {saved && (
            <Alert severity="success" sx={styles.alert4}>
              Settings saved successfully.
            </Alert>
          )}
          {tab === 0 && (
            <Box component="form" onSubmit={(event) => void handleSubmit(save)(event)}>
              <Box sx={styles.box5}>
                <Avatar sx={styles.avatar6}>{user?.name.slice(0, 1)}</Avatar>
                <Box>
                  <Typography variant="h3">{user?.name}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Verification level: {user?.level}
                  </Typography>
                  <Button size="small" sx={styles.button7}>
                    Change photo
                  </Button>
                </Box>
              </Box>
              <Box sx={styles.box8}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      error={Boolean(errors.name)}
                      helperText={errors.name?.message}
                      label="Full name"
                    />
                  )}
                />
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      error={Boolean(errors.email)}
                      helperText={errors.email?.message}
                      label="Email"
                    />
                  )}
                />
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      error={Boolean(errors.phone)}
                      helperText={errors.phone?.message}
                      label="Phone"
                    />
                  )}
                />
              </Box>
              <Button disabled={isSubmitting} sx={styles.button9} type="submit" variant="contained">
                {t('common.save')}
              </Button>
            </Box>
          )}
          {tab === 1 && (
            <Stack divider={<Divider flexItem />} spacing={2.5}>
              <SettingRow
                icon={<LockKeyhole size={19} />}
                title={t('settings.twoFactor')}
                description="Protect your account with an authenticator app"
                control={<Button variant="outlined">Enable</Button>}
              />
              <SettingRow
                icon={<Bell size={19} />}
                title="Login activity"
                description="Review devices with access to your account"
                control={<Button>View sessions</Button>}
              />
              <SettingRow
                icon={<LockKeyhole size={19} />}
                title="Password"
                description="Last changed 43 days ago"
                control={<Button>Change password</Button>}
              />
            </Stack>
          )}
          {tab === 2 && (
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
              <FormControlLabel control={<Switch defaultChecked />} label={t('settings.notifications')} />
              <FormControlLabel control={<Switch defaultChecked />} label="Price alerts" />
            </Stack>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
function SettingRow({
  icon,
  title,
  description,
  control,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  control: React.ReactNode;
}) {
  return (
    <Box sx={styles.box12}>
      <Box sx={styles.box13}>{icon}</Box>
      <Box flex={1}>
        <Typography fontWeight={700}>{title}</Typography>
        <Typography color="text.secondary" variant="body2">
          {description}
        </Typography>
      </Box>
      {control}
    </Box>
  );
}
