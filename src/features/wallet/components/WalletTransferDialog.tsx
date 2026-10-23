import { useEffect, useMemo } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import * as yup from 'yup';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { getApiErrorMessage } from '@shared/api';
import type { WalletAsset, WalletTransaction } from '@shared/model';

import { useCreateWalletTransfer } from '../hooks';
import { styles } from './WalletTransferDialog.styles';

interface WalletTransferDialogProps {
  assets: WalletAsset[];
  initialAsset?: string;
  mode: 'deposit' | 'withdraw';
  onClose: () => void;
  onCompleted: (transaction: WalletTransaction) => void;
  open: boolean;
}
interface TransferFormValues {
  asset: string;
  network: string;
  amount: number;
  address: string;
}
const networkOptions: Record<string, string[]> = {
  BTC: ['Bitcoin'],
  ETH: ['Ethereum', 'Arbitrum'],
  SOL: ['Solana'],
  USDT: ['TRC20', 'ERC20'],
  XRP: ['XRP Ledger'],
  ADA: ['Cardano'],
  DOGE: ['Dogecoin'],
};
const getNetworks = (asset: string) => networkOptions[asset] ?? ['Native'];
export function WalletTransferDialog({
  assets,
  initialAsset,
  mode,
  onClose,
  onCompleted,
  open,
}: WalletTransferDialogProps) {
  const { t } = useTranslation();
  const transfer = useCreateWalletTransfer();
  const resetMutation = transfer.reset;
  const schema = useMemo(
    () =>
      yup.object({
        asset: yup.string().required(t('wallet.validation.asset')),
        network: yup.string().required(t('wallet.validation.network')),
        amount: yup
          .number()
          .typeError(t('wallet.validation.amount'))
          .positive(t('wallet.validation.amount'))
          .max(1_000_000, t('wallet.validation.amount'))
          .required(t('wallet.validation.amount')),
        address: yup.string().defined(),
      }),
    [t]
  );
  const {
    clearErrors,
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransferFormValues>({
    defaultValues: {
      asset: initialAsset ?? 'USDT',
      network: getNetworks(initialAsset ?? 'USDT')[0] ?? 'Native',
      amount: 0,
      address: '',
    },
    resolver: yupResolver(schema),
  });
  const assetSymbol = watch('asset');
  const selectedAsset = assets.find((asset) => asset.symbol === assetSymbol);
  const networks = getNetworks(assetSymbol);
  useEffect(() => {
    if (!open) return;
    const asset = initialAsset ?? assets[0]?.symbol ?? 'USDT';
    reset({
      asset,
      network: getNetworks(asset)[0] ?? 'Native',
      amount: 0,
      address: '',
    });
    resetMutation();
  }, [assets, initialAsset, mode, open, reset, resetMutation]);
  useEffect(() => {
    setValue('network', networks[0] ?? 'Native');
  }, [assetSymbol, networks, setValue]);
  const close = () => {
    if (!transfer.isPending) onClose();
  };
  const submit = async (values: TransferFormValues) => {
    clearErrors('address');
    if (mode === 'withdraw' && values.address.trim().length < 12) {
      setError('address', {
        message: t('wallet.validation.address'),
      });
      return;
    }
    try {
      const transaction = await transfer.mutateAsync({
        asset: values.asset,
        type: mode,
        amount: values.amount,
        network: values.network,
        ...(mode === 'withdraw'
          ? {
              address: values.address.trim(),
            }
          : {}),
      });
      onCompleted(transaction);
      onClose();
    } catch {
      // The mutation error is rendered in the dialog and the form remains editable.
    }
  };
  const Icon = mode === 'deposit' ? ArrowDownLeft : ArrowUpRight;
  return (
    <Dialog fullWidth maxWidth="sm" onClose={close} open={open} aria-labelledby="wallet-transfer-title">
      <DialogTitle id="wallet-transfer-title" sx={styles.dialogTitle1}>
        <Box sx={styles.box2(mode)}>
          <Icon size={19} />
        </Box>
        {t(`wallet.${mode}`)}
      </DialogTitle>
      <Box component="form" noValidate onSubmit={(event) => void handleSubmit(submit)(event)}>
        <DialogContent dividers>
          <Stack spacing={2.25}>
            <Alert severity="info">{t(`wallet.${mode}DemoNotice`)}</Alert>
            {transfer.isError && (
              <Alert severity="error" role="alert">
                {getApiErrorMessage(transfer.error)}
              </Alert>
            )}
            <Controller
              name="asset"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={Boolean(errors.asset)}
                  helperText={errors.asset?.message}
                  label={t('wallet.asset')}
                  select
                >
                  {assets.map((asset) => (
                    <MenuItem key={asset.id} value={asset.symbol}>
                      {asset.symbol} · {asset.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="network"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={Boolean(errors.network)}
                  helperText={errors.network?.message}
                  label={t('wallet.network')}
                  select
                >
                  {networks.map((network) => (
                    <MenuItem key={network} value={network}>
                      {network}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            {mode === 'withdraw' && (
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    autoComplete="off"
                    error={Boolean(errors.address)}
                    helperText={errors.address?.message ?? t('wallet.addressHint')}
                    label={t('wallet.destinationAddress')}
                    required
                  />
                )}
              />
            )}
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={Boolean(errors.amount)}
                  helperText={errors.amount?.message}
                  label={t('wallet.amount')}
                  onChange={(event) =>
                    field.onChange(event.target.value === '' ? Number.NaN : Number(event.target.value))
                  }
                  slotProps={{
                    htmlInput: {
                      min: 0,
                      step: 'any',
                    },
                    input: {
                      endAdornment: <InputAdornment position="end">{assetSymbol}</InputAdornment>,
                    },
                  }}
                  type="number"
                />
              )}
            />
            {mode === 'withdraw' && selectedAsset && (
              <Box sx={styles.box3}>
                <Typography color="text.secondary" variant="body2">
                  {t('wallet.available')}:{' '}
                  {selectedAsset.available.toLocaleString(undefined, {
                    maximumFractionDigits: 8,
                  })}{' '}
                  {selectedAsset.symbol}
                </Typography>
                <Button
                  onClick={() =>
                    setValue('amount', selectedAsset.available, {
                      shouldValidate: true,
                    })
                  }
                  size="small"
                  type="button"
                >
                  {t('wallet.max')}
                </Button>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={styles.dialogActions4}>
          <Button color="inherit" disabled={transfer.isPending} onClick={close} type="button">
            {t('common.cancel')}
          </Button>
          <Button
            disabled={transfer.isPending || assets.length === 0}
            type="submit"
            variant="contained"
            startIcon={
              transfer.isPending ? <CircularProgress color="inherit" size={16} /> : <Icon size={17} />
            }
          >
            {transfer.isPending
              ? t('wallet.processing')
              : t(`wallet.confirm${mode === 'deposit' ? 'Deposit' : 'Withdraw'}`)}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
