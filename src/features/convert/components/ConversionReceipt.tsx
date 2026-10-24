import { useTranslation } from 'react-i18next';
import { Alert, Button, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material';

import { NAMESPACES } from '@app/i18n';
import { DetailRow } from '@shared/ui';

import type { ConversionOrder } from '../api';
import { convertStyles } from '../Convert.styles';

interface ConversionReceiptProps {
  errorKey?: string;
  onReset: () => void;
  order: ConversionOrder;
}

export function ConversionReceipt({ errorKey, onReset, order }: ConversionReceiptProps) {
  const { t } = useTranslation(NAMESPACES.convert);
  const severity = order.status === 'completed' ? 'success' : order.status === 'failed' ? 'error' : 'info';

  return (
    <Card sx={convertStyles.receipt}>
      <CardContent>
        <Stack aria-live="polite" spacing={2}>
          <Alert severity={severity}>{t(`order.${order.status}`)}</Alert>
          {order.status === 'pending' && <CircularProgress size={24} />}
          <DetailRow
            label={t('order.reference')}
            value={
              <Typography component="code" sx={convertStyles.orderId}>
                {order.id}
              </Typography>
            }
          />
          <DetailRow
            emphasize
            label={t('quote.receive')}
            value={`${order.destinationAmount.toLocaleString(undefined, { maximumFractionDigits: 8 })} ${order.toAsset}`}
          />
          {errorKey && <Alert severity="error">{t(errorKey)}</Alert>}
          {order.status !== 'pending' && (
            <Button onClick={onReset} variant="outlined">
              {t('order.newConversion')}
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
