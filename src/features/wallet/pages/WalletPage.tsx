import { useTranslation } from 'react-i18next';
import { ArrowDownLeft, ArrowUpRight, Eye, EyeOff, Search } from 'lucide-react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  InputAdornment,
  Skeleton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { formatCurrency } from '@shared/lib';
import { useLanguage } from '@shared/hooks';
import { AssetAvatar, PageFeedback, PageLoader } from '@shared/ui';

import { WalletTransferDialog } from '../components';
import { useWalletPage } from '../hooks';
import { styles } from './WalletPage.styles';

export default function WalletPage() {
  const { t } = useTranslation();
  const { lang } = useLanguage();
  const {
    assets,
    assetsQuery,
    completed,
    filteredAssets,
    hidden,
    openTransfer,
    search,
    setCompleted,
    setHidden,
    setSearch,
    setTransfer,
    total,
    transactionsQuery,
    transfer,
  } = useWalletPage();
  if (assetsQuery.isLoading) return <PageLoader />;
  if (assetsQuery.isError)
    return (
      <PageFeedback
        type="error"
        title={t('wallet.loadError')}
        description={t('wallet.loadErrorDescription')}
        actionLabel={t('common.retry')}
        onAction={() => void assetsQuery.refetch()}
      />
    );
  const successMessage = completed
    ? t(completed.type === 'deposit' ? 'wallet.successDeposit' : 'wallet.successWithdraw', {
        amount: completed.amount.toLocaleString(undefined, {
          maximumFractionDigits: 8,
        }),
        asset: completed.asset,
      })
    : '';
  return (
    <Stack spacing={3}>
      <Box sx={styles.box1}>
        <Box>
          <Typography component="h1" variant="h1">
            {t('wallet.title')}
          </Typography>
          <Typography color="text.secondary" sx={styles.typography2}>
            {t('wallet.subtitle')}
          </Typography>
        </Box>
        <Box sx={styles.box3}>
          <Button
            fullWidth
            onClick={() => openTransfer('deposit', 'USDT')}
            startIcon={<ArrowDownLeft size={17} />}
            variant="contained"
          >
            {t('wallet.deposit')}
          </Button>
          <Button
            fullWidth
            onClick={() => openTransfer('withdraw', 'USDT')}
            startIcon={<ArrowUpRight size={17} />}
            variant="outlined"
          >
            {t('wallet.withdraw')}
          </Button>
        </Box>
      </Box>

      <Card sx={styles.card4}>
        <CardContent sx={styles.cardContent5}>
          <Box>
            <Typography sx={styles.typography6}>{t('wallet.balance')}</Typography>
            <Box sx={styles.box7}>
              <Typography sx={styles.typography8}>{hidden ? '••••••••' : formatCurrency(total)}</Typography>
              <IconButton
                aria-label={hidden ? 'Show balance' : 'Hide balance'}
                color="inherit"
                onClick={() => setHidden((value) => !value)}
              >
                {hidden ? <Eye size={20} /> : <EyeOff size={20} />}
              </IconButton>
            </Box>
            <Typography sx={styles.typography9}>≈ 2.784 BTC · +4.8% this month</Typography>
          </Box>
          <Box aria-hidden="true" sx={styles.box10}>
            <Typography fontSize={32} fontWeight={900}>
              N
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Box sx={styles.box11}>
        <Typography variant="h2">{t('wallet.asset')}</Typography>
        <TextField
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t('common.search')}
          value={search}
          sx={styles.textField12}
          slotProps={{
            htmlInput: {
              'aria-label': t('common.search'),
            },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Card sx={styles.card13}>
        <Box sx={styles.box14}>
          {[t('wallet.asset'), 'Balance', t('wallet.available'), t('wallet.value'), ''].map(
            (label, index) => (
              <Typography key={`${label}-${index}`} color="text.secondary" variant="caption">
                {label}
              </Typography>
            )
          )}
        </Box>
        {filteredAssets.length === 0 ? (
          <PageFeedback title={t('wallet.searchEmpty')} />
        ) : (
          filteredAssets.map((asset) => (
            <Box key={asset.id} sx={styles.box15}>
              <Box sx={styles.box16}>
                <AssetAvatar symbol={asset.symbol} />
                <span>
                  <Typography fontWeight={750} variant="body2">
                    {asset.symbol}
                  </Typography>
                  <Typography color="text.secondary" variant="caption">
                    {asset.name}
                  </Typography>
                </span>
              </Box>
              <Box sx={styles.box17}>
                <Typography fontWeight={700}>{hidden ? '••••' : asset.balance.toLocaleString()}</Typography>
                <Typography color="text.secondary" sx={styles.typography18} variant="caption">
                  {hidden ? '••••' : formatCurrency(asset.value)}
                </Typography>
              </Box>
              <Typography sx={styles.typography19}>
                {hidden ? '••••' : asset.available.toLocaleString()}
              </Typography>
              <Typography sx={styles.typography20}>
                {hidden ? '••••' : formatCurrency(asset.value)}
              </Typography>
              <Box sx={styles.box21}>
                <Button onClick={() => openTransfer('deposit', asset.symbol)} size="small">
                  {t('wallet.deposit')}
                </Button>
                <Button color="inherit" onClick={() => openTransfer('withdraw', asset.symbol)} size="small">
                  {t('wallet.withdraw')}
                </Button>
              </Box>
            </Box>
          ))
        )}
      </Card>

      <Card>
        <CardContent sx={styles.cardContent22}>
          <Typography sx={styles.typography23} variant="h2">
            {t('wallet.activity')}
          </Typography>
          {transactionsQuery.isLoading && (
            <Stack spacing={1} sx={styles.stack24}>
              {[1, 2, 3].map((item) => (
                <Skeleton height={52} key={item} />
              ))}
            </Stack>
          )}
          {transactionsQuery.isError && (
            <Alert
              action={
                <Button color="inherit" onClick={() => void transactionsQuery.refetch()} size="small">
                  {t('common.retry')}
                </Button>
              }
              severity="error"
              sx={styles.alert25}
            >
              {t('wallet.loadError')}
            </Alert>
          )}
          {transactionsQuery.data?.length === 0 && <PageFeedback title={t('wallet.noActivity')} />}
          {transactionsQuery.data?.slice(0, 6).map((transaction) => (
            <Box key={transaction.id} sx={styles.box26}>
              <Box sx={styles.box27}>
                <Box sx={styles.box28(transaction.type)}>
                  {transaction.type === 'deposit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                </Box>
                <Box>
                  <Typography fontWeight={750} variant="body2">
                    {t(`wallet.${transaction.type}`)} {transaction.asset}
                  </Typography>
                  <Typography color="text.secondary" variant="caption">
                    {new Intl.DateTimeFormat(lang, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    }).format(new Date(transaction.createdAt))}
                  </Typography>
                </Box>
              </Box>
              <Typography color="text.secondary" sx={styles.typography29} variant="body2">
                {transaction.network}
              </Typography>
              <Chip
                color="success"
                label={t('wallet.completed')}
                size="small"
                sx={styles.chip30}
                variant="outlined"
              />
              <Typography
                color={transaction.type === 'deposit' ? 'success.main' : 'text.primary'}
                fontWeight={800}
                sx={styles.typography31}
              >
                {transaction.type === 'deposit' ? '+' : '−'}
                {transaction.amount.toLocaleString(undefined, {
                  maximumFractionDigits: 8,
                })}{' '}
                {transaction.asset}
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Card>

      {transfer && (
        <WalletTransferDialog
          assets={assets}
          initialAsset={transfer.asset}
          mode={transfer.mode}
          onClose={() => setTransfer(null)}
          onCompleted={setCompleted}
          open
        />
      )}
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        autoHideDuration={4000}
        onClose={() => setCompleted(null)}
        open={Boolean(completed)}
      >
        <Alert onClose={() => setCompleted(null)} severity="success" variant="filled">
          {successMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
