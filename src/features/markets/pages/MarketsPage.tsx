import { useDeferredValue, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Star } from 'lucide-react';
import { Virtuoso } from 'react-virtuoso';
import {
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { formatCompact, formatCurrency, formatPercent } from '@shared/lib';
import { AssetAvatar, PageFeedback, PageLoader, Sparkline } from '@shared/ui';

import { useMarketFavorites, useMarkets } from '../hooks';
import { styles } from './MarketsPage.styles';

export default function MarketsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'USDT' | 'IRT' | 'favorites'>('all');
  const { favorites, toggleFavorite } = useMarketFavorites();
  const deferredSearch = useDeferredValue(search);
  const query = useMarkets(deferredSearch);
  const markets = useMemo(() => query.data?.pages.flatMap((page) => page.data) ?? [], [query.data]);
  const visibleMarkets = useMemo(
    () =>
      markets.filter((market) => {
        const pair = `${market.symbol}-${market.quote}`;
        if (filter === 'favorites') return favorites.has(pair);
        if (filter === 'all') return true;
        return market.quote === filter;
      }),
    [favorites, filter, markets]
  );
  if (query.isLoading) return <PageLoader />;
  if (query.isError)
    return (
      <PageFeedback
        type="error"
        title="Market data is unavailable"
        actionLabel={t('common.retry')}
        onAction={() => void query.refetch()}
      />
    );
  return (
    <Stack spacing={3}>
      <Box>
        <Typography component="h1" variant="h1">
          {t('market.title')}
        </Typography>
        <Typography color="text.secondary" sx={styles.typography1}>
          Live prices, 24-hour changes and market liquidity
        </Typography>
      </Box>
      <Box sx={styles.box2}>
        <Box sx={styles.box3}>
          <Chip
            clickable
            color={filter === 'all' ? 'primary' : 'default'}
            label={t('market.all')}
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'filled' : 'outlined'}
          />
          <Chip
            clickable
            color={filter === 'USDT' ? 'primary' : 'default'}
            label="USDT"
            onClick={() => setFilter('USDT')}
            variant={filter === 'USDT' ? 'filled' : 'outlined'}
          />
          <Chip
            clickable
            color={filter === 'IRT' ? 'primary' : 'default'}
            label="IRT"
            onClick={() => setFilter('IRT')}
            variant={filter === 'IRT' ? 'filled' : 'outlined'}
          />
          <Chip
            clickable
            color={filter === 'favorites' ? 'primary' : 'default'}
            label="Favorites"
            onClick={() => setFilter('favorites')}
            variant={filter === 'favorites' ? 'filled' : 'outlined'}
          />
        </Box>
        <TextField
          onChange={(event) => setSearch(event.target.value)}
          placeholder={`${t('common.search')} BTC, ETH...`}
          value={search}
          sx={styles.textField4}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={17} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <SlidersHorizontal size={16} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
      <Card sx={styles.card5}>
        <Box sx={styles.box6}>
          <span />
          <Typography color="text.secondary" variant="caption">
            {t('market.asset')}
          </Typography>
          <Typography color="text.secondary" variant="caption">
            {t('market.price')}
          </Typography>
          <Typography color="text.secondary" variant="caption">
            {t('market.change')}
          </Typography>
          <Typography color="text.secondary" variant="caption">
            {t('market.volume')}
          </Typography>
          <span />
          <Typography color="text.secondary" variant="caption">
            {t('market.action')}
          </Typography>
        </Box>
        {visibleMarkets.length === 0 ? (
          <PageFeedback
            title="No markets found"
            description={
              filter === 'favorites'
                ? 'Star a market to keep it in your favorites.'
                : 'Try a different symbol, quote asset, or search.'
            }
          />
        ) : (
          <Virtuoso
            style={styles.virtualList}
            data={visibleMarkets}
            endReached={() => query.hasNextPage && !query.isFetchingNextPage && void query.fetchNextPage()}
            components={{
              Footer: () =>
                query.isFetchingNextPage ? (
                  <Typography color="text.secondary" sx={styles.typography7}>
                    {t('common.loading')}
                  </Typography>
                ) : null,
            }}
            itemContent={(_, market) => (
              <Box sx={styles.box8}>
                <IconButton
                  aria-label={`Favorite ${market.symbol}`}
                  aria-pressed={favorites.has(`${market.symbol}-${market.quote}`)}
                  onClick={() => toggleFavorite(`${market.symbol}-${market.quote}`)}
                  size="small"
                >
                  <Star
                    fill={favorites.has(`${market.symbol}-${market.quote}`) ? 'currentColor' : 'none'}
                    size={16}
                  />
                </IconButton>
                <Box sx={styles.box9}>
                  <AssetAvatar symbol={market.symbol} />
                  <Box>
                    <Typography fontWeight={760} variant="body2">
                      {market.symbol}/{market.quote}
                    </Typography>
                    <Typography color="text.secondary" variant="caption">
                      {market.name}
                    </Typography>
                  </Box>
                </Box>
                <Typography sx={styles.typography10}>
                  <b>{formatCurrency(market.price)}</b>
                  <br />
                  <Typography
                    component="span"
                    color={market.change24h >= 0 ? 'success.main' : 'error.main'}
                    variant="caption"
                  >
                    {formatPercent(market.change24h)}
                  </Typography>
                </Typography>
                <Typography sx={styles.typography11}>{formatCurrency(market.price)}</Typography>
                <Typography
                  color={market.change24h >= 0 ? 'success.main' : 'error.main'}
                  fontWeight={700}
                  sx={styles.typography12}
                >
                  {formatPercent(market.change24h)}
                </Typography>
                <Typography sx={styles.typography13}>${formatCompact(market.volume24h)}</Typography>
                <Box sx={styles.box14}>
                  <Sparkline
                    data={market.sparkline}
                    color={market.change24h >= 0 ? '#28d7a2' : '#ff4d78'}
                    height={34}
                  />
                </Box>
                <Button
                  onClick={() => navigate(`/trade/${market.symbol}-${market.quote}`)}
                  size="small"
                  sx={styles.button15}
                >
                  {t('market.trade')}
                </Button>
              </Box>
            )}
          />
        )}
      </Card>
    </Stack>
  );
}
