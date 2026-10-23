import { useEffect, useMemo, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import * as yup from 'yup';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';

import { useMarketFavorites, useMarketStream } from '@features/markets';
import { useCreateOrder } from '@features/orders';
import { useTransientState } from '@shared/hooks';
import { formatCurrency, formatPercent } from '@shared/lib';
import { AssetAvatar } from '@shared/ui';

import { CandlestickChart, OrderBook, TradeOrdersPanel } from '../components';
import { styles } from './TradePage.styles';

interface OrderFormValues {
  price: number;
  amount: number;
}
const schema = yup.object({
  price: yup.number().positive().required(),
  amount: yup.number().positive().max(50).required(),
});
const makeBook = (center: number, side: 'buy' | 'sell') =>
  Array.from(
    {
      length: 10,
    },
    (_, index) => ({
      price: center * (1 + (side === 'sell' ? 1 : -1) * (index + 1) * 0.0008),
      amount: Number((0.02 + ((index * 0.017) % 0.18)).toFixed(4)),
    })
  );
export default function TradePage() {
  const { symbol = 'BTC-USDT' } = useParams();
  const { t } = useTranslation();
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [chartTab, setChartTab] = useState(0);
  const [notice, showNotice] = useTransientState<string | null>(null);
  const { isFavorite, toggleFavorite } = useMarketFavorites();
  const tick = useMarketStream(symbol);
  const createOrder = useCreateOrder();
  const price = tick?.price ?? 67_842.29;
  const base = symbol.split('-')[0] ?? 'BTC';
  const book = useMemo(
    () => ({
      asks: makeBook(price, 'sell').reverse(),
      bids: makeBook(price, 'buy'),
    }),
    [price]
  );
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OrderFormValues>({
    defaultValues: {
      price,
      amount: 0.01,
    },
    resolver: yupResolver(schema),
  });
  const orderPrice = watch('price');
  const amount = watch('amount');
  const favorite = isFavorite(symbol);
  useEffect(() => {
    if (tick) setValue('price', Number(tick.price.toFixed(2)));
  }, [setValue, tick]);
  const submit = async (values: OrderFormValues) => {
    await createOrder.mutateAsync({
      symbol,
      side,
      type: orderType,
      ...values,
      price: orderType === 'market' ? price : values.price,
    });
    showNotice(`${side === 'buy' ? 'Buy' : 'Sell'} order placed successfully`);
  };
  return (
    <Stack spacing={2}>
      <Box sx={styles.box1}>
        <Box sx={styles.box2}>
          <AssetAvatar size={42} symbol={base} />
          <Box>
            <Typography component="h1" variant="h2">
              {symbol.replace('-', ' / ')}
            </Typography>
            <Typography color="text.secondary" variant="caption">
              Bitcoin / Tether
            </Typography>
          </Box>
          <IconButton
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={favorite}
            onClick={() => toggleFavorite(symbol)}
          >
            <Star fill={favorite ? 'currentColor' : 'none'} size={18} />
          </IconButton>
        </Box>
        <Box sx={styles.box3}>
          <Box>
            <Typography color="text.secondary" variant="caption">
              Last price
            </Typography>
            <Typography fontSize={20} fontWeight={780}>
              {formatCurrency(price)}
            </Typography>
          </Box>
          <Box>
            <Typography color="text.secondary" variant="caption">
              24h change
            </Typography>
            <Typography
              color={(tick?.change24h ?? 2.47) >= 0 ? 'success.main' : 'error.main'}
              fontWeight={750}
            >
              {formatPercent(tick?.change24h ?? 2.47)}
            </Typography>
          </Box>
          <Box sx={styles.box4}>
            <Typography color="text.secondary" variant="caption">
              24h volume
            </Typography>
            <Typography fontWeight={750}>$1.82B</Typography>
          </Box>
        </Box>
      </Box>
      {notice && (
        <Box role="status" sx={styles.box5}>
          {notice}
        </Box>
      )}
      <Box sx={styles.box6}>
        <OrderBook
          asks={book.asks}
          bids={book.bids}
          currentPrice={price}
          onSelectPrice={(selectedPrice) => setValue('price', Number(selectedPrice.toFixed(2)))}
          title={t('trade.orderBook')}
        />
        <Card sx={styles.chartCard}>
          <CardContent sx={styles.cardContent11}>
            <Box sx={styles.box12}>
              <Tabs value={chartTab} onChange={(_, value: number) => setChartTab(value)}>
                <Tab label="Trading chart" />
                <Tab label="Market info" />
              </Tabs>
            </Box>
            {chartTab === 0 ? (
              <CandlestickChart />
            ) : (
              <Box sx={styles.marketInfo}>
                <Typography variant="h3">{symbol.replace('-', ' / ')}</Typography>
                <Box sx={styles.marketInfoGrid}>
                  <MarketMetric label="24h high" value={formatCurrency(price * 1.031)} />
                  <MarketMetric label="24h low" value={formatCurrency(price * 0.974)} />
                  <MarketMetric label="24h volume" value="$1.82B" />
                  <MarketMetric label="Market rank" value="#1" />
                  <MarketMetric label="Circulating supply" value="19.7M BTC" />
                  <MarketMetric label="Market cap" value="$1.34T" />
                </Box>
                <Typography color="text.secondary" variant="body2">
                  Bitcoin is traded continuously. Prices and statistics shown here are demo market data
                  updated by the live stream.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
        <Card sx={styles.orderCard}>
          <CardContent sx={styles.cardContent13}>
            <Tabs
              variant="fullWidth"
              value={side}
              onChange={(_, value: 'buy' | 'sell') => setSide(value)}
              sx={styles.tabs14}
            >
              <Tab label={t('trade.buy')} value="buy" sx={styles.tab15(side)} />
              <Tab label={t('trade.sell')} value="sell" sx={styles.tab16(side)} />
            </Tabs>
            <Tabs
              variant="fullWidth"
              value={orderType}
              onChange={(_, value: 'limit' | 'market') => setOrderType(value)}
              sx={styles.orderTypeTabs}
            >
              <Tab label="Limit" value="limit" />
              <Tab label="Market" value="market" />
            </Tabs>
            <Box component="form" onSubmit={(event) => void handleSubmit(submit)(event)}>
              <Stack spacing={2}>
                <Typography color="text.secondary" variant="body2">
                  Available <b style={styles.availableValue}>$24,320.50</b>
                </Typography>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      disabled={orderType === 'market'}
                      error={Boolean(errors.price)}
                      label={orderType === 'market' ? 'Market price' : t('trade.price')}
                      type="number"
                      value={orderType === 'market' ? price.toFixed(2) : field.value}
                      slotProps={{
                        input: {
                          endAdornment: 'USDT',
                        },
                      }}
                    />
                  )}
                />
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      error={Boolean(errors.amount)}
                      label={t('trade.amount')}
                      type="number"
                      slotProps={{
                        input: {
                          endAdornment: base,
                        },
                      }}
                    />
                  )}
                />
                <Box sx={styles.box17}>
                  {[25, 50, 75, 100].map((percent) => (
                    <Button
                      key={percent}
                      onClick={() =>
                        setValue('amount', Number(((24_320.5 * percent) / 100 / orderPrice).toFixed(6)))
                      }
                      size="small"
                      variant="outlined"
                      sx={styles.button18}
                    >
                      {percent}%
                    </Button>
                  ))}
                </Box>
                <Divider />
                <Box sx={styles.box19}>
                  <Typography color="text.secondary">{t('trade.total')}</Typography>
                  <Typography fontWeight={800}>
                    {formatCurrency((amount || 0) * (orderPrice || 0))}
                  </Typography>
                </Box>
                <Button
                  disabled={createOrder.isPending}
                  type="submit"
                  variant="contained"
                  sx={styles.button20(side)}
                >
                  {t(side === 'buy' ? 'trade.submitBuy' : 'trade.submitSell', {
                    symbol: base,
                  })}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <OrderBook
        asks={book.asks}
        bids={book.bids}
        currentPrice={price}
        onSelectPrice={(selectedPrice) => setValue('price', Number(selectedPrice.toFixed(2)))}
        title={t('trade.orderBook')}
        variant="compact"
      />
      <TradeOrdersPanel symbol={symbol} />
    </Stack>
  );
}
function MarketMetric({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography color="text.secondary" variant="caption">
        {label}
      </Typography>
      <Typography fontWeight={750}>{value}</Typography>
    </Box>
  );
}
