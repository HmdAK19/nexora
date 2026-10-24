import { useTranslation } from 'react-i18next';
import { Alert, Button, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material';

import { NAMESPACES } from '@app/i18n';
import { DetailRow } from '@shared/ui';

import type { PurchaseOrder } from '../api';
import { buyStyles } from '../Buy.styles';

interface PurchaseReceiptProps {
  errorKey?: string;
  onNewPurchase: () => void;
  order: PurchaseOrder;
}

export function PurchaseReceipt({ errorKey, onNewPurchase, order }: PurchaseReceiptProps) {
  const { t } = useTranslation(NAMESPACES.buy);
  const severity = order.status === 'completed' ? 'success' : order.status === 'failed' ? 'error' : 'info';

  return (
    <Card sx={buyStyles.statusCard}>
      <CardContent>
        <Stack spacing={2} aria-live="polite">
          <Alert severity={severity}>
            {order.status === 'completed' && t('order.completed')}
            {order.status === 'failed' && t('order.failed')}
            {order.status === 'pending' && t('order.pending')}
          </Alert>
          {order.status === 'pending' && <CircularProgress size={24} />}
          <DetailRow
            label={t('order.reference')}
            value={
              <Typography component="code" sx={buyStyles.orderId}>
                {order.id}
              </Typography>
            }
          />
          <DetailRow
            emphasize
            label={t('quote.receive')}
            value={`${order.assetAmount.toLocaleString(undefined, { maximumFractionDigits: 8 })} ${order.asset}`}
          />
          {errorKey && <Alert severity="error">{t(errorKey)}</Alert>}
          {order.status !== 'pending' && (
            <Button onClick={onNewPurchase} variant="outlined">
              {t('order.newPurchase')}
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
