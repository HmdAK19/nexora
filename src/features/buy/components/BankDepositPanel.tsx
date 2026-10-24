import { useTranslation } from 'react-i18next';
import { Building2 } from 'lucide-react';
import { Alert, Card, CardContent, Stack, Typography } from '@mui/material';

import { NAMESPACES } from '@app/i18n';

import { buyStyles } from '../Buy.styles';

export function BankDepositPanel() {
  const { t } = useTranslation(NAMESPACES.buy);

  return (
    <Card>
      <CardContent sx={buyStyles.bankCardContent}>
        <Building2 aria-hidden size={28} />
        <Typography fontWeight={800} sx={buyStyles.bankTitle} variant="h6">
          {t('depositTitle')}
        </Typography>
        <Alert severity="warning" sx={buyStyles.bankAlert}>
          {t('depositWarning')}
        </Alert>
        <Stack spacing={1}>
          <Typography>{t('bank')}</Typography>
          <Typography>{t('iban')}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
