import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Box, Card, Chip, IconButton, Stack, Tab, Tabs, Typography } from '@mui/material';

import { formatCurrency } from '@shared/lib';
import { PageFeedback, PageLoader } from '@shared/ui';

import { useCancelOrder, useOrders } from '../hooks';
import { styles } from './OrdersPage.styles';

export default function OrdersPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);
  const query = useOrders();
  const cancel = useCancelOrder();
  if (query.isLoading) return <PageLoader />;
  const orders = (query.data ?? []).filter((order) => tab === 1 || order.status === 'open');
  return (
    <Stack spacing={3}>
      <Box>
        <Typography component="h1" variant="h1">
          {t('orders.title')}
        </Typography>
        <Typography color="text.secondary" sx={styles.typography1}>
          Manage active orders and review your execution history
        </Typography>
      </Box>
      <Card sx={styles.card2}>
        <Tabs value={tab} onChange={(_, value: number) => setTab(value)} sx={styles.tabs3}>
          <Tab label={t('orders.open')} />
          <Tab label={t('orders.history')} />
        </Tabs>
        {orders.length === 0 ? (
          <PageFeedback
            title={t('orders.empty')}
            description="Your active and completed orders will appear here."
          />
        ) : (
          <Box sx={styles.box4}>
            <Box sx={styles.box5}>
              <Box sx={styles.box6}>
                {['Pair', 'Side', 'Price', 'Amount', 'Filled', 'Status', ''].map((item) => (
                  <Typography key={item} color="text.secondary" variant="caption">
                    {item}
                  </Typography>
                ))}
              </Box>
              {orders.map((order) => (
                <Box key={order.id} sx={styles.box7}>
                  <Box>
                    <Typography fontWeight={750} variant="body2">
                      {order.symbol}
                    </Typography>
                    <Typography color="text.secondary" variant="caption">
                      {new Date(order.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography color={order.side === 'buy' ? 'success.main' : 'error.main'} fontWeight={750}>
                    {order.side.toUpperCase()}
                  </Typography>
                  <Typography>{formatCurrency(order.price)}</Typography>
                  <Typography>{order.amount}</Typography>
                  <Typography>{order.filled}%</Typography>
                  <Chip
                    color={
                      order.status === 'open' ? 'primary' : order.status === 'filled' ? 'success' : 'default'
                    }
                    label={order.status}
                    size="small"
                    sx={styles.chip8}
                  />
                  {order.status === 'open' && (
                    <IconButton
                      aria-label="Cancel order"
                      disabled={cancel.isPending}
                      onClick={() => cancel.mutate(order.id)}
                      size="small"
                    >
                      <X size={17} />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Card>
    </Stack>
  );
}
