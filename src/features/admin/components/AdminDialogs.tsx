import { useTranslation } from 'react-i18next';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { NAMESPACES } from '@app/i18n';

import type { AdminController } from '../hooks';
import { styles } from '../Admin.styles';

export function AdminDialogs({ controller }: { controller: AdminController }) {
  const { t } = useTranslation(NAMESPACES.admin);

  return (
    <>
      <Dialog
        open={Boolean(controller.selectedUser)}
        onClose={() => controller.setSelectedUser(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{t('userDetails')}</DialogTitle>
        <DialogContent>
          {controller.selectedUser && (
            <Stack spacing={1.5} sx={styles.dialogContent}>
              <Typography>
                <strong>{t('table.user')}:</strong> {controller.selectedUser.name}
              </Typography>
              <Typography>
                <strong>{t('email')}:</strong> {controller.selectedUser.email}
              </Typography>
              <Typography>
                <strong>{t('table.level')}:</strong> {controller.selectedUser.level}
              </Typography>
              <Typography>
                <strong>{t('table.balance')}:</strong> {controller.selectedUser.balance}
              </Typography>
              <Chip
                color={controller.selectedUser.status === 'active' ? 'success' : 'error'}
                label={t(`statuses.${controller.selectedUser.status}`)}
                size="small"
                sx={styles.dialogStatus}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => controller.setSelectedUser(null)}>{t('close')}</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={Boolean(controller.selectedTicket)}
        onClose={controller.closeTicket}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{t('tickets.replyTitle')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={styles.dialogContent}>
            <Typography color="text.secondary">
              {controller.selectedTicket ? t(`tickets.${controller.selectedTicket.subjectKey}`) : ''}
            </Typography>
            <TextField
              autoFocus
              label={t('tickets.replyMessage')}
              multiline
              minRows={4}
              value={controller.reply}
              onChange={(event) => controller.setReply(event.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={controller.closeTicket}>{t('cancel')}</Button>
          <Button
            variant="contained"
            disabled={controller.reply.trim().length < 3}
            onClick={controller.submitReply}
          >
            {t('tickets.sendReply')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
