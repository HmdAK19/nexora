import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Zap } from 'lucide-react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { NAMESPACES } from '@app/i18n';

import { buyStyles } from '../Buy.styles';
import type { PurchaseAmountError } from '../lib';
import { purchaseLimits, supportedPurchaseAssets, type PurchaseAsset } from '../model';

interface ExpressPurchaseFormProps {
  amount: string;
  amountError: PurchaseAmountError;
  asset: PurchaseAsset;
  errorKey?: string;
  loading: boolean;
  onAmountChange: (value: string) => void;
  onAssetChange: (value: PurchaseAsset) => void;
  onSubmit: () => void;
}

const amountErrorKeys: Record<Exclude<PurchaseAmountError, null>, string> = {
  invalid: 'validation.invalid',
  maximum: 'validation.maximum',
  minimum: 'validation.minimum',
};

export function ExpressPurchaseForm({
  amount,
  amountError,
  asset,
  errorKey,
  loading,
  onAmountChange,
  onAssetChange,
  onSubmit,
}: ExpressPurchaseFormProps) {
  const { t } = useTranslation(NAMESPACES.buy);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12, md: 7 }}>
        <Card component="form" onSubmit={handleSubmit} noValidate>
          <CardContent sx={buyStyles.formCardContent}>
            <Stack spacing={2.25}>
              <Typography fontWeight={800} variant="h6">
                {t('instant')}
              </Typography>
              <TextField
                autoComplete="off"
                error={Boolean(amountError)}
                helperText={
                  amountError
                    ? t(amountErrorKeys[amountError], {
                        maximum: purchaseLimits.maximum.toLocaleString(),
                        minimum: purchaseLimits.minimum,
                      })
                    : t('validation.hint', {
                        maximum: purchaseLimits.maximum.toLocaleString(),
                        minimum: purchaseLimits.minimum,
                      })
                }
                inputMode="decimal"
                label={t('spend')}
                value={amount}
                onChange={(event) => onAmountChange(event.target.value)}
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end">USD</InputAdornment>,
                  },
                }}
              />
              <TextField
                select
                label={t('receive')}
                value={asset}
                onChange={(event) => onAssetChange(event.target.value as PurchaseAsset)}
              >
                {supportedPurchaseAssets.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
              <Box sx={buyStyles.estimate}>
                <Typography color="text.secondary" variant="body2">
                  {t('serverQuote')}
                </Typography>
                <Typography fontWeight={750}>{t('serverQuoteDescription')}</Typography>
              </Box>
              {errorKey && <Alert severity="error">{t(errorKey)}</Alert>}
              <Button
                disabled={Boolean(amountError) || loading}
                size="large"
                startIcon={loading ? <CircularProgress color="inherit" size={18} /> : undefined}
                type="submit"
                variant="contained"
              >
                {loading ? t('quoteLoading') : t('getQuote')}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <Card sx={buyStyles.featureCard}>
          <CardContent>
            <Zap aria-hidden size={26} />
            <Typography fontWeight={750} sx={buyStyles.featureTitle}>
              {t('fast')}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {t('rateNotice')}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
