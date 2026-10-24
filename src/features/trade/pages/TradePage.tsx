import { useEffect, useState } from 'react';
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
import { useWalletAssets } from '@features/wallet';
import { useTransientState } from '@shared/hooks';
import { formatCurrency, formatPercent } from '@shared/lib';
import { AssetAvatar } from '@shared/ui';

import { CandlestickChart, OrderBook, TradeOrdersPanel } from '../components';
import { useTradingMarket } from '../hooks';
import type { Timeframe } from '../lib';
import { styles } from './TradePage.styles';

interface OrderFormValues {
  price: number;
  amount: number;
}
const schema = yup.object({
  price: yup.number().positive().required(),
  amount: yup.number().positive().max(50).required(),
});
export default function TradePage() {
  const { symbol = 'BTC-USDT' } = useParams();
  const { t } = useTranslation();
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [chartTab, setChartTab] = useState(0);
  const [timeframe, setTimeframe] = useState<Timeframe>('15m');
  const [notice, showNotice] = useTransientState<string | null>(null);
  const { isFavorite, toggleFavorite } = useMarketFavorites();
  const tick = useMarketStream(symbol);
  const trading = useTradingMarket(symbol, timeframe);
  const wallet = useWalletAssets();
  const createOrder = useCreateOrder();
  const market = trading.market.data;
  const price = tick?.price ?? market?.lastPrice ?? 0;
  const base = market?.baseAsset ?? symbol.split('-')[0] ?? 'BTC';
  const quote = market?.quoteAsset ?? symbol.split('-')[1] ?? 'USDT';
  const book = market?.depth ?? { asks: [], bids: [], sequence: 0, symbol };
  const available =
    wallet.data?.find((asset) => asset.symbol === (side === 'buy' ? quote : base))?.available ?? 0;
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
    try {
      await createOrder.mutateAsync({
        symbol,
        side,
        type: orderType,
        ...values,
        price: orderType === 'market' ? price : values.price,
      });
      showNotice(t('trade.orderPlaced'));
    } catch {
      showNotice(t('trade.orderFailed'));
    }
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
              {market ? `${market.name} / ${market.quoteAsset}` : symbol.replace('-', ' / ')}
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
              color={(tick?.change24h ?? market?.change24h ?? 0) >= 0 ? 'success.main' : 'error.main'}
              fontWeight={750}
            >
              {formatPercent(tick?.change24h ?? market?.change24h ?? 0)}
            </Typography>
          </Box>
          <Box sx={styles.box4}>
            <Typography color="text.secondary" variant="caption">
              24h volume
            </Typography>
            <Typography fontWeight={750}>{formatCurrency(market?.volume24h ?? 0)}</Typography>
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
                <Tab label={t('trade.chart')} />
                <Tab label={t('trade.marketInfo')} />
              </Tabs>
            </Box>
            {chartTab === 0 ? (
              trading.candles.data ? (
                <CandlestickChart
                  candles={trading.candles.data}
                  onTimeframeChange={setTimeframe}
                  symbol={symbol}
                  timeframe={timeframe}
                />
              ) : (
                <Box sx={{ minHeight: 430, display: 'grid', placeItems: 'center' }}>
                  {t('trade.loadingChart')}
                </Box>
              )
            ) : (
              <Box sx={styles.marketInfo}>
                <Typography variant="h3">{symbol.replace('-', ' / ')}</Typography>
                <Box sx={styles.marketInfoGrid}>
                  <MarketMetric label={t('trade.high24h')} value={formatCurrency(market?.high24h ?? 0)} />
                  <MarketMetric label={t('trade.low24h')} value={formatCurrency(market?.low24h ?? 0)} />
                  <MarketMetric label={t('trade.volume24h')} value={formatCurrency(market?.volume24h ?? 0)} />
                </Box>
                <Typography color="text.secondary" variant="body2">
                  {t('trade.marketDescription')}
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
              <Tab label={t('trade.limit')} value="limit" />
              <Tab label={t('trade.market')} value="market" />
            </Tabs>
            <Box component="form" onSubmit={(event) => void handleSubmit(submit)(event)}>
              <Stack spacing={2}>
                <Typography color="text.secondary" variant="body2">
                  {t('trade.available')}{' '}
                  <b style={styles.availableValue}>
                    {available.toLocaleString()} {side === 'buy' ? quote : base}
                  </b>
                </Typography>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      disabled={orderType === 'market'}
                      error={Boolean(errors.price)}
                      label={orderType === 'market' ? t('trade.marketPrice') : t('trade.price')}
                      type="number"
                      value={orderType === 'market' ? price.toFixed(2) : field.value}
                      slotProps={{
                        input: {
                          endAdornment: quote,
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
                        setValue(
                          'amount',
                          Number(
                            (side === 'buy'
                              ? (available * percent) / 100 / Math.max(orderPrice, Number.EPSILON)
                              : (available * percent) / 100
                            ).toFixed(8)
                          )
                        )
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
