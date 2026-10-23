import { useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { NAMESPACES } from '@app/i18n';

import type { PasswordResetController } from '../hooks';

export function ForgotPasswordDialog({ controller }: { controller: PasswordResetController }) {
  const { t } = useTranslation(NAMESPACES.auth);

  return (
    <Dialog open={controller.open} onClose={controller.close} fullWidth maxWidth="xs">
      <DialogTitle>{t('forgotTitle')}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography color="text.secondary" variant="body2">
            {t('forgotDescription')}
          </Typography>
          <TextField
            autoFocus
            autoComplete="email"
            error={controller.status === 'error'}
            label={t('forgotEmail')}
            type="email"
            value={controller.email}
            onChange={(event) => controller.setEmail(event.target.value)}
          />
          {controller.status === 'sent' && <Alert severity="success">{t('forgotSent')}</Alert>}
          {controller.status === 'error' && <Alert severity="error">{t('forgotError')}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={controller.close}>{t('cancel')}</Button>
        <Button
          variant="contained"
          disabled={controller.status === 'pending' || !controller.valid}
          onClick={() => void controller.submit()}
        >
          {controller.status === 'pending' ? (
            <CircularProgress color="inherit" size={20} />
          ) : (
            t('forgotSubmit')
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
