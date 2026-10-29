import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { NAMESPACES } from '@app/i18n';
import type { SupportTicket } from '../api';
import { getSupportErrorKey } from '../lib';
import { supportLimits } from '../model';
import { supportStyles } from '../Support.styles';
import { TicketStatusChip } from './TicketStatusChip';

interface TicketDetailsDialogProps {
  closeError: unknown;
  closing: boolean;
  error: unknown;
  formatDate: (value: string) => string;
  loading: boolean;
  onClose: () => void;
  onCloseTicket: () => void;
  onReply: () => void;
  open: boolean;
  reply: string;
  replyError: unknown;
  replyPending: boolean;
  replyTouched: boolean;
  replyValid: boolean;
  setReply: (value: string) => void;
  touchReply: () => void;
  ticket?: SupportTicket;
}

export function TicketDetailsDialog(props: TicketDetailsDialogProps) {
  const { t } = useTranslation(NAMESPACES.support);
  const closed = props.ticket?.status === 'closed';

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Stack alignItems="center" direction="row" gap={1} justifyContent="space-between">
          <Typography component="span" variant="h3">
            {props.ticket?.subject ?? t('details.title')}
          </Typography>
          {props.ticket && <TicketStatusChip status={props.ticket.status} />}
        </Stack>
      </DialogTitle>
      <DialogContent>
        {props.loading && (
          <Stack alignItems="center" py={5}>
            <CircularProgress size={28} />
          </Stack>
        )}
        {Boolean(props.error) && <Alert severity="error">{t(getSupportErrorKey(props.error))}</Alert>}
        {props.ticket && (
          <Stack spacing={2}>
            <Typography color="text.secondary" variant="body2">
              {t(`category.${props.ticket.category}`)} · {props.formatDate(props.ticket.createdAt)}
            </Typography>
            <Stack spacing={1.5} sx={supportStyles.conversation}>
              {props.ticket.messages.map((message) => (
                <Box key={message.id} sx={supportStyles.message(message.author === 'user')}>
                  <Typography sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }} variant="body2">
                    {message.body}
                  </Typography>
                  <Typography sx={supportStyles.messageMeta} variant="caption">
                    {t(`author.${message.author}`)} · {props.formatDate(message.createdAt)}
                  </Typography>
                </Box>
              ))}
            </Stack>
            {!closed && <Divider />}
            {Boolean(props.replyError || props.closeError) && (
              <Alert severity="error">{t(getSupportErrorKey(props.replyError ?? props.closeError))}</Alert>
            )}
            {!closed && (
              <TextField
                disabled={props.replyPending || props.closing}
                inputProps={{ maxLength: supportLimits.messageMaxLength }}
                label={t('fields.reply')}
                minRows={3}
                multiline
                value={props.reply}
                onChange={(event) => props.setReply(event.target.value)}
                onBlur={props.touchReply}
                error={props.replyTouched && !props.replyValid}
                helperText={
                  props.replyTouched && !props.replyValid
                    ? t(
                        props.reply.trim().length === 0
                          ? 'validation.messageRequired'
                          : 'validation.messageMin',
                        { min: supportLimits.messageMinLength }
                      )
                    : undefined
                }
              />
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        {props.ticket && !closed && (
          <Button
            color="inherit"
            disabled={props.closing || props.replyPending}
            onClick={props.onCloseTicket}
          >
            {props.closing ? t('actions.closing') : t('actions.closeTicket')}
          </Button>
        )}
        <Button disabled={props.replyPending || props.closing} onClick={props.onClose}>
          {t('actions.close')}
        </Button>
        {props.ticket && !closed && (
          <Button
            disabled={!props.replyValid || props.replyPending || props.closing}
            onClick={props.onReply}
            variant="contained"
          >
            {props.replyPending ? t('actions.sending') : t('actions.sendReply')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
