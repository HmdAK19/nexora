import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowDownUp, Repeat2 } from 'lucide-react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { NAMESPACES } from '@app/i18n';

import { convertStyles } from '../Convert.styles';
import type { ConversionAmountError } from '../lib';
import { conversionLimits, supportedConversionAssets, type ConversionAsset } from '../model';

interface ConversionFormProps {
  amount: string;
  amountError: ConversionAmountError;
  errorKey?: string;
  fromAsset: ConversionAsset;
  loading: boolean;
  onAmountChange: (value: string) => void;
  onFromAssetChange: (value: ConversionAsset) => void;
  onSubmit: () => void;
  onSwap: () => void;
  onToAssetChange: (value: ConversionAsset) => void;
  toAsset: ConversionAsset;
}

const errorKeys: Record<Exclude<ConversionAmountError, null>, string> = {
  invalid: 'validation.invalid',
  maximum: 'validation.maximum',
  minimum: 'validation.minimum',
  precision: 'validation.precision',
};

export function ConversionForm({
  amount,
  amountError,
  errorKey,
  fromAsset,
  loading,
  onAmountChange,
  onFromAssetChange,
  onSubmit,
  onSwap,
  onToAssetChange,
  toAsset,
}: ConversionFormProps) {
  const { t } = useTranslation(NAMESPACES.convert);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <Card component="form" noValidate onSubmit={handleSubmit}>
      <CardContent sx={convertStyles.cardContent}>
        <Stack spacing={2}>
          <Typography fontWeight={750}>{t('youPay')}</Typography>
          <TextField
            autoComplete="off"
            error={Boolean(amountError)}
            helperText={
              amountError
                ? t(errorKeys[amountError], {
                    maximum: conversionLimits.maximum.toLocaleString(),
                    minimum: conversionLimits.minimum,
                  })
                : t('validation.hint', { decimals: conversionLimits.maximumDecimals })
            }
            inputMode="decimal"
            label={t('amount')}
            onChange={(event) => onAmountChange(event.target.value)}
            value={amount}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <TextField
                      aria-label={t('fromAsset')}
                      onChange={(event) => onFromAssetChange(event.target.value as ConversionAsset)}
                      select
                      sx={convertStyles.assetSelect}
                      value={fromAsset}
                      variant="standard"
                    >
                      {supportedConversionAssets.map((asset) => (
                        <MenuItem key={asset} value={asset}>
                          {asset}
                        </MenuItem>
                      ))}
                    </TextField>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Box sx={convertStyles.swapRow}>
            <Box sx={convertStyles.divider} />
            <IconButton aria-label={t('swap')} onClick={onSwap} sx={convertStyles.swapButton}>
              <ArrowDownUp size={18} />
            </IconButton>
            <Box sx={convertStyles.divider} />
          </Box>
          <Typography fontWeight={750}>{t('youReceive')}</Typography>
          <TextField
            label={t('destinationAsset')}
            select
            value={toAsset}
            onChange={(event) => onToAssetChange(event.target.value as ConversionAsset)}
          >
            {supportedConversionAssets.map((asset) => (
              <MenuItem key={asset} value={asset}>
                {asset}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={convertStyles.quotePreview}>
            <Typography color="text.secondary" variant="body2">
              {t('liveQuote')}
            </Typography>
            <Typography fontWeight={700}>{t('liveQuoteDescription')}</Typography>
          </Box>
          {errorKey && <Alert severity="error">{t(errorKey)}</Alert>}
          <Button
            disabled={Boolean(amountError) || loading}
            size="large"
            startIcon={loading ? <CircularProgress color="inherit" size={18} /> : <Repeat2 size={18} />}
            type="submit"
            variant="contained"
          >
            {loading ? t('gettingQuote') : t('submit')}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
