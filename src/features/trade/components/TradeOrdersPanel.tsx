import { useState } from 'react';
import { X } from 'lucide-react';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';

import { useCancelOrder, useOrders } from '@features/orders';
import { formatCurrency } from '@shared/lib';

import { styles } from './TradeOrdersPanel.styles';

export function TradeOrdersPanel({ symbol }: { symbol: string }) {
  const [tab, setTab] = useState(0);
  const ordersQuery = useOrders();
  const cancelOrder = useCancelOrder();
  const orders = (ordersQuery.data ?? []).filter(
    (order) => order.symbol === symbol && (tab === 1 || order.status === 'open')
  );

  return (
    <Card sx={styles.card}>
      <Tabs value={tab} onChange={(_, value: number) => setTab(value)} sx={styles.tabs}>
        <Tab label="Open orders" />
        <Tab label="Order history" />
      </Tabs>
      {ordersQuery.isLoading && (
        <Stack spacing={1} sx={styles.loading}>
          <Skeleton height={46} />
          <Skeleton height={46} />
        </Stack>
      )}
      {ordersQuery.isError && (
        <Alert
          severity="error"
          sx={styles.alert}
          action={
            <Button color="inherit" onClick={() => void ordersQuery.refetch()} size="small">
              Retry
            </Button>
          }
        >
          Orders could not be loaded.
        </Alert>
      )}
      {!ordersQuery.isLoading && !ordersQuery.isError && orders.length === 0 && (
        <Box sx={styles.empty}>
          <Typography fontWeight={700}>
            No {tab === 0 ? 'open orders' : 'order history'} for {symbol}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Orders placed from this panel will appear here.
          </Typography>
        </Box>
      )}
      {orders.length > 0 && (
        <Box sx={styles.scroller}>
          <Box sx={styles.table}>
            <OrderHeader />
            {orders.map((order) => (
              <Box key={order.id} sx={[styles.row, styles.dataRow]}>
                <Typography variant="caption">
                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
                <Typography variant="body2">{order.type}</Typography>
                <Typography
                  color={order.side === 'buy' ? 'success.main' : 'error.main'}
                  fontWeight={750}
                  variant="body2"
                >
                  {order.side.toUpperCase()}
                </Typography>
                <Typography variant="body2">{formatCurrency(order.price)}</Typography>
                <Typography variant="body2">{order.amount}</Typography>
                <Typography variant="body2">{order.filled}%</Typography>
                <Chip
                  color={
                    order.status === 'open' ? 'primary' : order.status === 'filled' ? 'success' : 'default'
                  }
                  label={order.status}
                  size="small"
                  sx={styles.status}
                />
                {order.status === 'open' ? (
                  <IconButton
                    aria-label={`Cancel ${order.symbol} order`}
                    disabled={cancelOrder.isPending}
                    onClick={() => cancelOrder.mutate(order.id)}
                    size="small"
                  >
                    <X size={16} />
                  </IconButton>
                ) : (
                  <Box />
                )}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Card>
  );
}

function OrderHeader() {
  return (
    <Box sx={styles.row}>
      {['Time', 'Type', 'Side', 'Price', 'Amount', 'Filled', 'Status', ''].map((label) => (
        <Typography color="text.secondary" key={label} variant="caption">
          {label}
        </Typography>
      ))}
    </Box>
  );
}
