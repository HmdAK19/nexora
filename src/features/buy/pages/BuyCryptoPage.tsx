import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BadgeDollarSign, Building2, Zap } from 'lucide-react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';

import { PageHeading } from '@shared/ui';
import { NAMESPACES } from '@app/i18n';

import { styles } from './BuyCryptoPage.styles';

const rates: Record<string, number> = {
  USDT: 1,
  BTC: 68124,
  ETH: 3642,
};
export default function BuyCryptoPage() {
  const { t } = useTranslation(NAMESPACES.buy);
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [amount, setAmount] = useState('1000');
  const [asset, setAsset] = useState('USDT');
  const [submitted, setSubmitted] = useState(false);
  const receive = useMemo(() => ((Number(amount) || 0) / (rates[asset] ?? 1)) * 0.995, [amount, asset]);
  return (
    <Box>
      <PageHeading title={t('title')} description={t('description')} />
      <Tabs
        value={tab}
        onChange={(_, value: number) => {
          setTab(value);
          setSubmitted(false);
        }}
        sx={styles.tabs1}
      >
        <Tab label={t('tabs.express')} />
        <Tab label={t('tabs.p2p')} />
        <Tab label={t('tabs.bank')} />
      </Tabs>
      {tab === 0 && (
        <Grid container spacing={2.5}>
          <Grid
            size={{
              xs: 12,
              md: 7,
            }}
          >
            <Card>
              <CardContent sx={styles.cardContent2}>
                <Stack spacing={2.25}>
                  <Typography fontWeight={800} variant="h6">
                    {t('instant')}
                  </Typography>
                  <TextField
                    label={t('spend')}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
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
                    onChange={(e) => setAsset(e.target.value)}
                  >
                    {Object.keys(rates).map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Box sx={styles.box3}>
                    <Typography color="text.secondary" variant="body2">
                      {t('estimated')}
                    </Typography>
                    <Typography fontWeight={850} variant="h5">
                      {receive.toLocaleString(undefined, {
                        maximumFractionDigits: 8,
                      })}{' '}
                      {asset}
                    </Typography>
                  </Box>
                  {submitted && <Alert severity="success">{t('success')}</Alert>}
                  <Button
                    variant="contained"
                    size="large"
                    disabled={Number(amount) <= 0}
                    onClick={() => setSubmitted(true)}
                  >
                    {t('continue')}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 5,
            }}
          >
            <Card>
              <CardContent>
                <Zap size={26} />
                <Typography fontWeight={750} sx={styles.typography4}>
                  {t('fast')}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {t('rateNotice')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      {tab === 1 && (
        <Grid container spacing={2}>
          {[
            { asset: 'USDT', offer: 'USDT · 0.999 USD' },
            { asset: 'BTC', offer: 'BTC · 67,980 USD' },
            { asset: 'ETH', offer: 'ETH · 3,625 USD' },
          ].map(({ asset: offerAsset, offer }, index) => (
            <Grid
              key={offer}
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <Card>
                <CardContent>
                  <BadgeDollarSign size={24} />
                  <Typography fontWeight={800} sx={styles.typography5}>
                    {offer}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {t('merchantCompletion', { completion: 98 + index / 2 })}
                  </Typography>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={styles.button6}
                    onClick={() => navigate(`/trade/${offerAsset}-USDT`)}
                  >
                    {t('buy')}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {tab === 2 && (
        <Card>
          <CardContent sx={styles.cardContent7}>
            <Building2 size={28} />
            <Typography fontWeight={800} variant="h6" sx={styles.typography8}>
              {t('depositTitle')}
            </Typography>
            <Alert severity="warning" sx={styles.alert9}>
              {t('depositWarning')}
            </Alert>
            <Stack spacing={1}>
              <Typography>{t('bank')}</Typography>
              <Typography>{t('iban')}</Typography>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
