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
  Typography,
} from '@mui/material';

import { NAMESPACES } from '@app/i18n';
import { DetailRow } from '@shared/ui';

import type { ConversionQuote } from '../api';
import { convertStyles } from '../Convert.styles';

interface ConversionConfirmationDialogProps {
  errorKey?: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onRefresh: () => void;
  open: boolean;
  quote?: ConversionQuote;
  quoteExpired: boolean;
  refreshing: boolean;
  secondsRemaining: number;
}

const format = (value: number) => value.toLocaleString(undefined, { maximumFractionDigits: 8 });

export function ConversionConfirmationDialog({
  errorKey,
  loading,
  onClose,
  onConfirm,
  onRefresh,
  open,
  quote,
  quoteExpired,
  refreshing,
  secondsRemaining,
}: ConversionConfirmationDialogProps) {
  const { t } = useTranslation(NAMESPACES.convert);
  const busy = loading || refreshing;

  return (
    <Dialog fullWidth maxWidth="xs" onClose={onClose} open={open}>
      <DialogTitle>{t('quote.title')}</DialogTitle>
      <DialogContent sx={convertStyles.dialogContent}>
        {quote && (
          <Stack spacing={1.5}>
            <Typography color="text.secondary" variant="body2">
              {t('quote.description')}
            </Typography>
            <DetailRow label={t('quote.pay')} value={`${format(quote.sourceAmount)} ${quote.fromAsset}`} />
            <DetailRow
              label={t('quote.rate')}
              value={`1 ${quote.fromAsset} ≈ ${format(quote.rate)} ${quote.toAsset}`}
            />
            <DetailRow label={t('quote.fee')} value={`${format(quote.feeAmount)} ${quote.fromAsset}`} />
            <DetailRow
              emphasize
              label={t('quote.receive')}
              value={`${format(quote.destinationAmount)} ${quote.toAsset}`}
            />
            <Alert severity={quoteExpired ? 'warning' : 'info'}>
              {quoteExpired ? t('quote.expired') : t('quote.expiresIn', { seconds: secondsRemaining })}
            </Alert>
            {errorKey && <Alert severity="error">{t(errorKey)}</Alert>}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button disabled={busy} onClick={onClose}>
          {t('cancel')}
        </Button>
        <Button
          disabled={!quote || busy}
          onClick={quoteExpired ? onRefresh : onConfirm}
          startIcon={busy ? <CircularProgress color="inherit" size={18} /> : undefined}
          variant="contained"
        >
          {refreshing
            ? t('gettingQuote')
            : loading
              ? t('processing')
              : quoteExpired
                ? t('quote.refresh')
                : t('confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
