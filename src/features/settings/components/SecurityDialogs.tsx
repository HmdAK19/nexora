import { useTranslation } from 'react-i18next';
import { Laptop, Smartphone } from 'lucide-react';
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
} from '@mui/material';

import type { SettingsController } from '../hooks';
import { styles } from '../Settings.styles';
import { SettingRow } from './SettingRow';
import { MfaSetupDialog } from './MfaSetupDialog';

export function SecurityDialogs({ controller }: { controller: SettingsController }) {
  const { i18n, t } = useTranslation();
  const message = controller.securityMessage ? t(`settings.${controller.securityMessage}`) : '';
  const { accountSecurity } = controller;

  return (
    <>
      <MfaSetupDialog
        code={controller.mfaCode}
        enabled={Boolean(accountSecurity.security?.twoFactorEnabled)}
        errorMessage={accountSecurity.mfaError ? t('settings.mfa.error') : undefined}
        labels={{
          cancel: t('settings.cancel'),
          code: t('settings.mfa.code'),
          confirm: t('settings.confirm'),
          copy: t('settings.mfa.copy'),
          disable: t('settings.disable'),
          disableHint: t('settings.mfa.disableHint'),
          done: t('settings.done'),
          password: t('settings.currentPassword'),
          recoveryHint: t('settings.mfa.recoveryHint'),
          recoveryTitle: t('settings.mfa.recoveryTitle'),
          setup: t('settings.enable'),
          setupHint: t('settings.mfa.setupHint'),
          title: t('settings.twoFactorDialog'),
        }}
        onBegin={() => void controller.beginMfaSetup()}
        onClose={controller.closeSecurityDialog}
        onCodeChange={controller.setMfaCode}
        onConfirm={() => void controller.confirmMfaSetup()}
        onCopy={(value) => {
          if (navigator.clipboard) void navigator.clipboard.writeText(value).catch(() => undefined);
        }}
        onDisable={() => void controller.disableMfa()}
        onPasswordChange={controller.setMfaPassword}
        open={controller.securityDialog === 'mfa'}
        password={controller.mfaPassword}
        pending={accountSecurity.mfaPending}
        recoveryCodes={accountSecurity.mfaRecoveryCodes}
        setup={accountSecurity.mfaSetup}
      />
      <Dialog
        open={controller.securityDialog === 'sessions'}
        onClose={controller.closeSecurityDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{t('settings.sessionsDialog')}</DialogTitle>
        <DialogContent>
          <Stack divider={<Divider flexItem />} spacing={2} sx={styles.dialogContent}>
            {accountSecurity.security?.sessions.map((session) => {
              const Icon = /mobile|android|ios|iphone/i.test(session.device) ? Smartphone : Laptop;
              const lastActive = new Intl.DateTimeFormat(i18n.language, {
                dateStyle: 'medium',
                timeStyle: 'short',
              }).format(new Date(session.lastActiveAt));

              return (
                <SettingRow
                  key={session.id}
                  icon={<Icon size={19} />}
                  title={`${session.browser} · ${session.device}`}
                  description={`${session.location} · ${session.ipAddress} · ${lastActive}`}
                  control={
                    session.current ? (
                      <Chip color="success" label={t('settings.current')} size="small" />
                    ) : (
                      <Button
                        color="error"
                        disabled={accountSecurity.revokePendingId === session.id}
                        onClick={() => accountSecurity.revokeSession(session.id)}
                      >
                        {t('settings.revoke')}
                      </Button>
                    )
                  }
                />
              );
            })}
            {accountSecurity.security?.sessions.length === 1 && (
              <Alert severity="info">{t('settings.noOtherSessions')}</Alert>
            )}
            {accountSecurity.revokeError && (
              <Alert severity="error">{t('settings.sessionRevokeError')}</Alert>
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
            {accountSecurity.changePasswordError && (
              <Alert severity="error">{t('settings.passwordUpdateError')}</Alert>
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
            onClick={() => void controller.updatePassword()}
            loading={accountSecurity.changePasswordPending}
          >
            {t('settings.changePassword')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
