import { useEffect, useState } from 'react';
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
  Chip,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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

type SecurityDialog = 'password' | 'sessions' | 'twoFactor' | null;
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
  const [securityDialog, setSecurityDialog] = useState<SecurityDialog>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [hasMobileSession, setHasMobileSession] = useState(true);
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [securityMessage, setSecurityMessage] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [tradingNotifications, setTradingNotifications] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
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
  useEffect(
    () => () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    },
    [photoUrl]
  );

  const save = async (values: ProfileValues) => {
    localStorage.setItem('nexora-profile', JSON.stringify(values));
    showSaved(true);
  };

  const closeSecurityDialog = () => {
    setSecurityDialog(null);
    setVerificationCode('');
    setPasswords({ current: '', next: '', confirm: '' });
    setSecurityMessage('');
  };

  const confirmTwoFactor = () => {
    if (!/^\d{6}$/.test(verificationCode)) return;

    setTwoFactorEnabled(true);
    setSecurityMessage(t('settings.twoFactorEnabled'));
  };

  const updatePassword = () => {
    if (passwords.next !== passwords.confirm) {
      setSecurityMessage(t('settings.passwordMismatch'));

      return;
    }

    if (passwords.current.length < 8 || passwords.next.length < 8) return;

    setSecurityMessage(t('settings.passwordUpdated'));
    setPasswords({ current: '', next: '', confirm: '' });
  };
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
              {t('settings.saved')}
            </Alert>
          )}
          {tab === 0 && (
            <Box component="form" onSubmit={(event) => void handleSubmit(save)(event)}>
              <Box sx={styles.box5}>
                <Avatar src={photoUrl || undefined} sx={styles.avatar6}>
                  {user?.name.slice(0, 1)}
                </Avatar>
                <Box>
                  <Typography variant="h3">{user?.name}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {t('settings.verificationLevel', { level: user?.level })}
                  </Typography>
                  <Button component="label" size="small" sx={styles.button7}>
                    {t('settings.changePhoto')}
                    <input
                      hidden
                      accept="image/png,image/jpeg,image/webp"
                      type="file"
                      onChange={(event) => {
                        const file = event.target.files?.[0];

                        if (!file) return;
                        if (photoUrl) URL.revokeObjectURL(photoUrl);
                        setPhotoUrl(URL.createObjectURL(file));
                      }}
                    />
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
                      label={t('settings.fullName')}
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
                      label={t('settings.email')}
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
                      label={t('settings.phone')}
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
                description={t('settings.twoFactorDescription')}
                control={
                  <Button
                    variant="outlined"
                    onClick={() => {
                      if (twoFactorEnabled) setTwoFactorEnabled(false);
                      else setSecurityDialog('twoFactor');
                    }}
                  >
                    {t(twoFactorEnabled ? 'settings.disable' : 'settings.enable')}
                  </Button>
                }
              />
              <SettingRow
                icon={<Bell size={19} />}
                title={t('settings.loginActivity')}
                description={t('settings.loginActivityDescription')}
                control={
                  <Button onClick={() => setSecurityDialog('sessions')}>{t('settings.viewSessions')}</Button>
                }
              />
              <SettingRow
                icon={<LockKeyhole size={19} />}
                title={t('settings.password')}
                description={t('settings.passwordDescription')}
                control={
                  <Button onClick={() => setSecurityDialog('password')}>
                    {t('settings.changePassword')}
                  </Button>
                }
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
              <FormControlLabel
                control={
                  <Switch
                    checked={tradingNotifications}
                    onChange={(event) => setTradingNotifications(event.target.checked)}
                  />
                }
                label={t('settings.notifications')}
              />
              <FormControlLabel
                control={
                  <Switch checked={priceAlerts} onChange={(event) => setPriceAlerts(event.target.checked)} />
                }
                label={t('settings.priceAlerts')}
              />
            </Stack>
          )}
        </CardContent>
      </Card>
      <Dialog open={securityDialog === 'twoFactor'} onClose={closeSecurityDialog} fullWidth maxWidth="xs">
        <DialogTitle>{t('settings.twoFactorDialog')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={styles.dialogContent}>
            <Typography color="text.secondary">{t('settings.twoFactorHint')}</Typography>
            <TextField
              autoFocus
              label={t('settings.verificationCode')}
              value={verificationCode}
              onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
              inputProps={{ inputMode: 'numeric', maxLength: 6 }}
            />
            {securityMessage && <Alert severity="success">{securityMessage}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSecurityDialog}>{t('settings.cancel')}</Button>
          <Button variant="contained" disabled={verificationCode.length !== 6} onClick={confirmTwoFactor}>
            {t('settings.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={securityDialog === 'sessions'} onClose={closeSecurityDialog} fullWidth maxWidth="sm">
        <DialogTitle>{t('settings.sessionsDialog')}</DialogTitle>
        <DialogContent>
          <Stack divider={<Divider flexItem />} spacing={2} sx={styles.dialogContent}>
            <SettingRow
              icon={<MonitorCog size={19} />}
              title={t('settings.currentDevice')}
              description="Tehran · 127.0.0.1"
              control={<Chip color="success" label={t('settings.current')} size="small" />}
            />
            {hasMobileSession ? (
              <SettingRow
                icon={<MonitorCog size={19} />}
                title={t('settings.mobileDevice')}
                description="Tehran · 2 hours ago"
                control={
                  <Button color="error" onClick={() => setHasMobileSession(false)}>
                    {t('settings.revoke')}
                  </Button>
                }
              />
            ) : (
              <Alert severity="info">{t('settings.noOtherSessions')}</Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSecurityDialog}>{t('settings.done')}</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={securityDialog === 'password'} onClose={closeSecurityDialog} fullWidth maxWidth="xs">
        <DialogTitle>{t('settings.passwordDialog')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={styles.dialogContent}>
            <TextField
              label={t('settings.currentPassword')}
              type="password"
              value={passwords.current}
              onChange={(event) => setPasswords((value) => ({ ...value, current: event.target.value }))}
            />
            <TextField
              label={t('settings.newPassword')}
              type="password"
              value={passwords.next}
              onChange={(event) => setPasswords((value) => ({ ...value, next: event.target.value }))}
            />
            <TextField
              label={t('settings.confirmPassword')}
              type="password"
              value={passwords.confirm}
              onChange={(event) => setPasswords((value) => ({ ...value, confirm: event.target.value }))}
            />
            {securityMessage && (
              <Alert severity={securityMessage === t('settings.passwordMismatch') ? 'error' : 'success'}>
                {securityMessage}
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSecurityDialog}>{t('settings.cancel')}</Button>
          <Button
            variant="contained"
            disabled={
              passwords.current.length < 8 || passwords.next.length < 8 || passwords.confirm.length < 8
            }
            onClick={updatePassword}
          >
            {t('settings.changePassword')}
          </Button>
        </DialogActions>
      </Dialog>
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
