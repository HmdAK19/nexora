import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowDownUp, Repeat2 } from 'lucide-react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { PageHeading } from '@shared/ui';
import { NAMESPACES } from '@app/i18n';

import { styles } from './ConvertPage.styles';

const prices: Record<string, number> = {
  BTC: 68124,
  ETH: 3642,
  USDT: 1,
  SOL: 172.4,
};
export default function ConvertPage() {
  const { t } = useTranslation(NAMESPACES.convert);
  const [from, setFrom] = useState('USDT');
  const [to, setTo] = useState('BTC');
  const [amount, setAmount] = useState('1000');
  const [done, setDone] = useState(false);
  const result = useMemo(
    () => (((Number(amount) || 0) * (prices[from] ?? 0)) / (prices[to] ?? 1)) * 0.999,
    [amount, from, to]
  );
  const swap = () => {
    setFrom(to);
    setTo(from);
    setDone(false);
  };
  return (
    <Box sx={styles.box1}>
      <PageHeading title={t('title')} description={t('description')} />
      <Card>
        <CardContent sx={styles.cardContent2}>
          <Stack spacing={2}>
            <Typography fontWeight={750}>{t('youPay')}</Typography>
            <TextField
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setDone(false);
              }}
              inputProps={{
                inputMode: 'decimal',
              }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <TextField
                        select
                        variant="standard"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                      >
                        {Object.keys(prices)
                          .filter((asset) => asset !== to)
                          .map((asset) => (
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
            <Box sx={styles.box3}>
              <Box sx={styles.box4} />
              <IconButton aria-label={t('swap')} onClick={swap} sx={styles.iconButton5}>
                <ArrowDownUp size={18} />
              </IconButton>
              <Box sx={styles.box6} />
            </Box>
            <Typography fontWeight={750}>{t('youReceive')}</Typography>
            <TextField
              value={result.toLocaleString(undefined, {
                maximumFractionDigits: 8,
              })}
              slotProps={{
                input: {
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <TextField select variant="standard" value={to} onChange={(e) => setTo(e.target.value)}>
                        {Object.keys(prices)
                          .filter((asset) => asset !== from)
                          .map((asset) => (
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
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary" variant="body2">
                {t('estimatedRate')}
              </Typography>
              <Typography variant="body2">
                1 {from} ≈{' '}
                {((prices[from] ?? 0) / (prices[to] ?? 1)).toLocaleString(undefined, {
                  maximumFractionDigits: 8,
                })}{' '}
                {to}
              </Typography>
            </Stack>
            {done && <Alert severity="success">{t('success')}</Alert>}
            <Button
              size="large"
              startIcon={<Repeat2 size={18} />}
              variant="contained"
              disabled={Number(amount) <= 0}
              onClick={() => setDone(true)}
            >
              {t('submit')}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
