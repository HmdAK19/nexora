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

import type { PurchaseQuote } from '../api';
import { buyStyles } from '../Buy.styles';

interface PurchaseConfirmationDialogProps {
  errorKey?: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onRefresh: () => void;
  open: boolean;
  quote?: PurchaseQuote;
  quoteExpired: boolean;
  refreshing: boolean;
  secondsRemaining: number;
}

function formatAmount(value: number, maximumFractionDigits = 2) {
  return value.toLocaleString(undefined, { maximumFractionDigits });
}

export function PurchaseConfirmationDialog({
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
}: PurchaseConfirmationDialogProps) {
  const { t } = useTranslation(NAMESPACES.buy);
  const busy = loading || refreshing;

  return (
    <Dialog fullWidth maxWidth="xs" onClose={onClose} open={open}>
      <DialogTitle>{t('quote.title')}</DialogTitle>
      <DialogContent sx={buyStyles.dialogContent}>
        {quote && (
          <Stack spacing={1.5}>
            <Typography color="text.secondary" variant="body2">
              {t('quote.description')}
            </Typography>
            <DetailRow
              label={t('quote.price')}
              value={`${formatAmount(quote.unitPrice, 8)} ${quote.fiatCurrency}`}
            />
            <DetailRow
              label={t('quote.receive')}
              value={`${formatAmount(quote.assetAmount, 8)} ${quote.asset}`}
            />
            <DetailRow
              label={t('quote.fee')}
              value={`${formatAmount(quote.feeAmount)} ${quote.fiatCurrency}`}
            />
            <DetailRow
              emphasize
              label={t('quote.total')}
              value={`${formatAmount(quote.totalAmount)} ${quote.fiatCurrency}`}
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
            ? t('quoteLoading')
            : loading
              ? t('processing')
              : quoteExpired
                ? t('quote.refresh')
                : t('confirmPurchase')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
