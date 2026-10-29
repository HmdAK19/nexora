import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Card, Divider, Typography } from '@mui/material';

import { useMarkets } from '@features/markets';
import { formatCurrency, formatPercent } from '@shared/lib';
import { SkeletonRows } from '@shared/ui';

import { useRecentMarketTrades } from '../hooks';
import { styles } from './TradeMarketSidebar.styles';

export function TradeMarketSidebar({ symbol }: { symbol: string }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const marketsQuery = useMarkets('');
  const tradesQuery = useRecentMarketTrades(symbol);
  const markets = useMemo(
    () => marketsQuery.data?.pages.flatMap((page) => page.data).slice(0, 10) ?? [],
    [marketsQuery.data]
  );
  const recentTrades = useMemo(
    () => [...(tradesQuery.data ?? [])].reverse().slice(0, 10),
    [tradesQuery.data]
  );

  return (
    <Card sx={styles.card}>
      <Box sx={[styles.section, styles.marketsSection]}>
        <Box sx={styles.heading}>
          <Typography variant="h3">{t('trade.markets')}</Typography>
          <Typography color="text.secondary" sx={styles.headingMeta}>
            USDT
          </Typography>
        </Box>
        <Box sx={styles.tableHeader}>
          <Typography color="text.secondary" variant="caption">
            {t('trade.pair')}
          </Typography>
          <Typography color="text.secondary" textAlign="end" variant="caption">
            {t('trade.price')}
          </Typography>
          <Typography color="text.secondary" textAlign="end" variant="caption">
            {t('trade.change')}
          </Typography>
        </Box>
        {marketsQuery.isLoading ? (
          <LoadingRows />
        ) : marketsQuery.isError ? (
          <Alert severity="error" sx={styles.state}>
            {t('trade.marketsLoadError')}
          </Alert>
        ) : (
          <Box sx={styles.list}>
            {markets.map((market) => {
              const pair = `${market.symbol}-${market.quote}`;

              return (
                <Box
                  aria-current={pair === symbol ? 'page' : undefined}
                  component="button"
                  key={pair}
                  onClick={() => navigate(`/trade/${pair}`)}
                  sx={[styles.marketRow, pair === symbol && styles.activeMarket]}
                >
                  <Typography fontWeight={700} variant="caption">
                    {market.symbol}/{market.quote}
                  </Typography>
                  <Typography sx={styles.numeric}>{formatCurrency(market.price)}</Typography>
                  <Typography
                    color={market.change24h >= 0 ? 'success.main' : 'error.main'}
                    sx={styles.numeric}
                  >
                    {formatPercent(market.change24h)}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
      <Divider />
      <Box sx={[styles.section, styles.tradesSection]}>
        <Box sx={styles.heading}>
          <Typography variant="h3">{t('trade.recent')}</Typography>
          <Typography color="text.secondary" sx={styles.headingMeta}>
            {symbol.replace('-', '/')}
          </Typography>
        </Box>
        <Box sx={styles.tableHeader}>
          <Typography color="text.secondary" variant="caption">
            {t('trade.price')}
          </Typography>
          <Typography color="text.secondary" textAlign="end" variant="caption">
            {t('trade.amount')}
          </Typography>
          <Typography color="text.secondary" textAlign="end" variant="caption">
            {t('trade.time')}
          </Typography>
        </Box>
        {tradesQuery.isLoading ? (
          <LoadingRows />
        ) : tradesQuery.isError ? (
          <Alert severity="error" sx={styles.state}>
            {t('trade.recentTradesLoadError')}
          </Alert>
        ) : (
          <Box sx={styles.list}>
            {recentTrades.map((trade) => (
              <Box key={trade.id} sx={styles.tradeRow}>
                <Typography color={trade.side === 'buy' ? 'success.main' : 'error.main'} sx={styles.numeric}>
                  {trade.price.toFixed(trade.price < 1 ? 6 : 2)}
                </Typography>
                <Typography sx={styles.numeric}>{trade.amount.toFixed(5)}</Typography>
                <Typography color="text.secondary" sx={styles.numeric}>
                  {new Date(trade.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Card>
  );
}

function LoadingRows() {
  return <SkeletonRows columns={3} minWidth={0} rows={5} rowHeight={22} />;
}
