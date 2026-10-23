import { useTranslation } from 'react-i18next';
import { MonitorCog } from 'lucide-react';
import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import type { SettingsController } from '../hooks';
import { styles } from '../Settings.styles';
import { SettingRow } from './SettingRow';

export function SecurityDialogs({ controller }: { controller: SettingsController }) {
  const { t } = useTranslation();
  const message = controller.securityMessage ? t(`settings.${controller.securityMessage}`) : '';

  return (
    <>
      <Dialog
        open={controller.securityDialog === 'twoFactor'}
        onClose={controller.closeSecurityDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>{t('settings.twoFactorDialog')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={styles.dialogContent}>
            <Typography color="text.secondary">{t('settings.twoFactorHint')}</Typography>
            <TextField
              autoFocus
              label={t('settings.verificationCode')}
              value={controller.verificationCode}
              onChange={(event) =>
                controller.setVerificationCode(event.target.value.replace(/\D/g, '').slice(0, 6))
              }
              inputProps={{ inputMode: 'numeric', maxLength: 6 }}
            />
            {message && <Alert severity="success">{message}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={controller.closeSecurityDialog}>{t('settings.cancel')}</Button>
          <Button
            variant="contained"
            disabled={controller.verificationCode.length !== 6}
            onClick={controller.confirmTwoFactor}
          >
            {t('settings.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={controller.securityDialog === 'sessions'}
        onClose={controller.closeSecurityDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{t('settings.sessionsDialog')}</DialogTitle>
        <DialogContent>
          <Stack divider={<Divider flexItem />} spacing={2} sx={styles.dialogContent}>
            <SettingRow
              icon={<MonitorCog size={19} />}
              title={t('settings.currentDevice')}
              description="Tehran · 127.0.0.1"
              control={<Chip color="success" label={t('settings.current')} size="small" />}
            />
            {controller.hasMobileSession ? (
              <SettingRow
                icon={<MonitorCog size={19} />}
                title={t('settings.mobileDevice')}
                description="Tehran · 2 hours ago"
                control={
                  <Button color="error" onClick={() => controller.setHasMobileSession(false)}>
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
          <Button onClick={controller.closeSecurityDialog}>{t('settings.done')}</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={controller.securityDialog === 'password'}
        onClose={controller.closeSecurityDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>{t('settings.passwordDialog')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={styles.dialogContent}>
            <TextField
              label={t('settings.currentPassword')}
              type="password"
              value={controller.passwords.current}
              onChange={(event) =>
                controller.setPasswords((value) => ({ ...value, current: event.target.value }))
              }
            />
            <TextField
              label={t('settings.newPassword')}
              type="password"
              value={controller.passwords.next}
              onChange={(event) =>
                controller.setPasswords((value) => ({ ...value, next: event.target.value }))
              }
            />
            <TextField
              label={t('settings.confirmPassword')}
              type="password"
              value={controller.passwords.confirm}
              onChange={(event) =>
                controller.setPasswords((value) => ({ ...value, confirm: event.target.value }))
              }
            />
            {message && (
              <Alert severity={controller.securityMessage === 'passwordMismatch' ? 'error' : 'success'}>
                {message}
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={controller.closeSecurityDialog}>{t('settings.cancel')}</Button>
          <Button
            variant="contained"
            disabled={
              controller.passwords.current.length < 8 ||
              controller.passwords.next.length < 8 ||
              controller.passwords.confirm.length < 8
            }
            onClick={controller.updatePassword}
          >
            {t('settings.changePassword')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
