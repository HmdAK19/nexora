import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  CircleDollarSign,
  Clock3,
  Wallet,
} from 'lucide-react';
import { Box, Button, Card, CardContent, Chip, Skeleton, Stack, Typography } from '@mui/material';

import { useAuth } from '@features/auth/context';
import { formatCurrency, formatPercent } from '@shared/lib';
import { AssetAvatar, PageFeedback, Sparkline, StatCard } from '@shared/ui';

import { AllocationChart, PortfolioChart } from '../components';
import { useDashboard, useFeaturedMarkets } from '../hooks';
import { styles } from './DashboardPage.styles';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const dashboard = useDashboard();
  const markets = useFeaturedMarkets();
  if (dashboard.isError)
    return (
      <PageFeedback
        type="error"
        title={t('dashboard.loadErrorTitle')}
        description={t('dashboard.loadErrorDescription')}
        actionLabel={t('common.retry')}
        onAction={() => void dashboard.refetch()}
      />
    );
  const data = dashboard.data;
  return (
    <Stack spacing={3}>
      <Box sx={styles.box1}>
        <Box>
          <Typography component="h1" variant="h1">
            {t('dashboard.title')}
          </Typography>
          <Typography color="text.secondary" sx={styles.typography2}>
            {t('dashboard.greeting', {
              name: user?.name,
            })}{' '}
            — {t('dashboard.marketOpportunity')}
          </Typography>
        </Box>
        <Box sx={styles.box3}>
          <Button
            onClick={() => navigate('/wallet')}
            startIcon={<ArrowDownLeft size={18} />}
            variant="outlined"
          >
            {t('wallet.deposit')}
          </Button>
          <Button
            onClick={() => navigate('/trade/BTC-USDT')}
            startIcon={<ArrowUpRight size={18} />}
            variant="contained"
          >
            {t('nav.trade')}
          </Button>
        </Box>
      </Box>

      <Box sx={styles.box4}>
        <StatCard
          label={t('dashboard.portfolio')}
          value={data ? formatCurrency(data.portfolioValue) : undefined}
          helper={
            data ? `${formatPercent(data.portfolioChange)} ${t('dashboard.portfolioHelper')}` : undefined
          }
          icon={<Wallet size={20} />}
          loading={dashboard.isLoading}
        />
        <StatCard
          label={t('dashboard.available')}
          value={data ? formatCurrency(data.availableBalance) : undefined}
          helper={t('dashboard.availableHelper')}
          accent="#20d6c7"
          icon={<CircleDollarSign size={20} />}
          loading={dashboard.isLoading}
        />
        <StatCard
          label={t('dashboard.openOrders')}
          value={data?.openOrders.toString()}
          helper={t('dashboard.ordersHelper')}
          accent="#9a69ff"
          icon={<Clock3 size={20} />}
          loading={dashboard.isLoading}
        />
        <StatCard
          label={t('dashboard.trades')}
          value={data?.totalTrades.toLocaleString()}
          helper={t('dashboard.tradesHelper')}
          accent="#ffad32"
          icon={<Activity size={20} />}
          loading={dashboard.isLoading}
        />
      </Box>

      <Box sx={styles.box5}>
        <Card>
          <CardContent sx={styles.cardContent6}>
            <Box sx={styles.box7}>
              <Typography variant="h3">{t('dashboard.performance')}</Typography>
              <Chip label="30D" size="small" variant="outlined" />
            </Box>
            {data ? <PortfolioChart data={data.performance} /> : <Skeleton height={300} />}
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={styles.cardContent8}>
            <Typography sx={styles.typography9} variant="h3">
              {t('dashboard.allocation')}
            </Typography>
            {data ? <AllocationChart data={data.allocation} /> : <Skeleton height={260} />}
          </CardContent>
        </Card>
      </Box>

      <Box sx={styles.box10}>
        <Card>
          <CardContent sx={styles.cardContent11}>
            <Box sx={styles.box12}>
              <Typography variant="h3">{t('dashboard.markets')}</Typography>
              <Button onClick={() => navigate('/markets')} size="small">
                {t('market.all')}
              </Button>
            </Box>
            <Box sx={styles.box13}>
              <Box sx={styles.box14}>
                {markets.isLoading ? (
                  <Skeleton height={250} />
                ) : (
                  markets.data?.map((market) => (
                    <Box key={market.id} sx={styles.box15}>
                      <Box sx={styles.box16}>
                        <AssetAvatar symbol={market.symbol} />
                        <span>
                          <Typography fontWeight={750} variant="body2">
                            {market.symbol}/{market.quote}
                          </Typography>
                          <Typography color="text.secondary" variant="caption">
                            {market.name}
                          </Typography>
                        </span>
                      </Box>
                      <Typography sx={styles.typography17}>{formatCurrency(market.price)}</Typography>
                      <Typography
                        color={market.change24h >= 0 ? 'success.main' : 'error.main'}
                        fontWeight={700}
                      >
                        {formatPercent(market.change24h)}
                      </Typography>
                      <Sparkline
                        data={market.sparkline}
                        color={market.change24h >= 0 ? '#28d7a2' : '#ff4d78'}
                        height={34}
                      />
                    </Box>
                  ))
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={styles.cardContent18}>
            <Box sx={styles.box19}>
              <Typography variant="h3">{t('dashboard.activity')}</Typography>
              <BarChart3 color="#8f99b3" size={18} />
            </Box>
            <Stack divider={<Box sx={styles.box20} />}>
              {data?.activities.map((item) => (
                <Box key={item.id} sx={styles.box21}>
                  <Box sx={styles.box22(item.kind)}>
                    {item.kind === 'sell' ? <ArrowUpRight size={17} /> : <ArrowDownLeft size={17} />}
                  </Box>
                  <Box flex={1}>
                    <Typography fontWeight={700} variant="body2">
                      {item.title}
                    </Typography>
                    <Typography color="text.secondary" variant="caption">
                      {item.subtitle}
                    </Typography>
                  </Box>
                  <Typography
                    color={item.amount > 0 ? 'success.main' : 'text.primary'}
                    fontWeight={700}
                    variant="body2"
                  >
                    {item.amount > 0 ? '+' : ''}
                    {formatCurrency(item.amount)}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
}
