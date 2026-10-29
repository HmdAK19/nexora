import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquareReply } from 'lucide-react';
import {
  Alert,
  Button,
  Card,
  CardContent,
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
import { Authorized } from '@features/auth';
import { PERMISSIONS } from '@shared/lib';
import { PageFeedback } from '@shared/ui';

import { AdminQueryState } from '../components';
import { useAdminTickets } from '../hooks';
import type { AdminTicket } from '../model';
import { styles } from '../Admin.styles';

export default function AdminSupportPage() {
  const { t } = useTranslation(NAMESPACES.admin);
  const { reply, tickets } = useAdminTickets();
  const [selectedTicket, setSelectedTicket] = useState<AdminTicket | null>(null);
  const [message, setMessage] = useState('');

  const closeDialog = () => {
    if (reply.isPending) return;
    setSelectedTicket(null);
    setMessage('');
    reply.reset();
  };

  const submit = async () => {
    if (!selectedTicket || message.trim().length < 10) return;
    try {
      await reply.mutateAsync({ message: message.trim(), ticketId: selectedTicket.id });
      closeDialog();
    } catch {
      // Mutation state keeps the dialog open and exposes a recoverable localized error.
    }
  };

  if (!tickets.data) {
    return (
      <AdminQueryState
        error={tickets.error}
        loading={tickets.isLoading}
        retry={() => void tickets.refetch()}
      />
    );
  }

  if (tickets.data.length === 0) {
    return <PageFeedback title={t('support.empty')} description={t('support.emptyDescription')} />;
  }

  return (
    <>
      <Stack spacing={1.5}>
        {tickets.data.map((ticket) => (
          <Card key={ticket.id}>
            <CardContent sx={styles.ticketContent}>
              <MessageSquareReply aria-hidden size={22} />
              <span>
                <Typography fontWeight={750}>{ticket.subject}</Typography>
                <Typography color="text.secondary" variant="body2">
                  {ticket.user.email} · {ticket.lastMessagePreview}
                </Typography>
              </span>
              <Chip label={t(`ticketStatuses.${ticket.status}`)} size="small" sx={styles.trailingChip} />
              <Authorized permission={PERMISSIONS.admin.supportReply}>
                <Button disabled={ticket.status === 'closed'} onClick={() => setSelectedTicket(ticket)}>
                  {t('actions.reply')}
                </Button>
              </Authorized>
            </CardContent>
          </Card>
        ))}
      </Stack>
      <Dialog open={Boolean(selectedTicket)} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{t('support.replyTitle')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={styles.dialogContent}>
            <Typography color="text.secondary">{selectedTicket?.subject}</Typography>
            {reply.error && <Alert severity="error">{t('states.mutationError')}</Alert>}
            <TextField
              autoFocus
              error={message.length > 0 && message.trim().length < 10}
              helperText={message.length > 0 && message.trim().length < 10 ? t('support.replyMinimum') : ' '}
              label={t('support.replyMessage')}
              minRows={4}
              multiline
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button disabled={reply.isPending} onClick={closeDialog}>
            {t('actions.cancel')}
          </Button>
          <Button
            disabled={reply.isPending || message.trim().length < 10}
            onClick={() => void submit()}
            variant="contained"
          >
            {t('actions.send')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
