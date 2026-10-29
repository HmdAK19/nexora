import { Alert, Box, Button, Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material';

import { formatCurrency } from '@shared/lib';
import { SkeletonRows } from '@shared/ui';

import { styles } from './OrderBook.styles';

export interface OrderBookRow {
  amount: number;
  price: number;
}

interface OrderBookProps {
  asks: OrderBookRow[];
  bids: OrderBookRow[];
  currentPrice: number;
  onSelectPrice: (price: number) => void;
  title: string;
  variant?: 'desktop' | 'compact';
  error?: boolean;
  errorMessage?: string;
  loading?: boolean;
  onRetry?: () => void;
  retryLabel?: string;
}

const compactDepth = 6;
const desktopDepth = 8;

export function OrderBook({
  asks,
  bids,
  currentPrice,
  onSelectPrice,
  title,
  variant = 'desktop',
  error = false,
  errorMessage,
  loading = false,
  onRetry,
  retryLabel,
}: OrderBookProps) {
  const cardStyle = variant === 'compact' ? styles.compactCard : styles.desktopCard;

  if (loading || error) {
    return (
      <Card sx={cardStyle}>
        <CardContent sx={styles.content}>
          <Typography sx={styles.title} variant="h3">
            {title}
          </Typography>
          {loading ? (
            <Box sx={styles.state}>
              <SkeletonRows columns={2} minWidth={0} rows={8} rowHeight={22} />
            </Box>
          ) : (
            <Stack spacing={1.25} sx={styles.state}>
              <Alert severity="error" sx={styles.errorAlert}>
                {errorMessage}
              </Alert>
              {onRetry && (
                <Button fullWidth onClick={onRetry} size="small" variant="outlined">
                  {retryLabel}
                </Button>
              )}
            </Stack>
          )}
        </CardContent>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <Card sx={styles.compactCard}>
        <CardContent sx={styles.content}>
          <Typography sx={styles.title} variant="h3">
            {title}
          </Typography>
          <Box sx={styles.compactGrid}>
            <BookRows rows={asks.slice(0, compactDepth).reverse()} side="sell" onSelect={onSelectPrice} />
            <BookRows rows={bids.slice(0, compactDepth)} side="buy" onSelect={onSelectPrice} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={styles.desktopCard}>
      <CardContent sx={styles.content}>
        <Typography sx={styles.title} variant="h3">
          {title}
        </Typography>
        <BookRows rows={asks.slice(0, desktopDepth).reverse()} side="sell" onSelect={onSelectPrice} />
        <Box sx={styles.currentPrice}>{formatCurrency(currentPrice)}</Box>
        <BookRows rows={bids.slice(0, desktopDepth)} side="buy" onSelect={onSelectPrice} />
      </CardContent>
    </Card>
  );
}

function BookRows({
  rows,
  side,
  onSelect,
}: {
  rows: OrderBookRow[];
  side: 'buy' | 'sell';
  onSelect: (price: number) => void;
}) {
  return (
    <Stack spacing={0}>
      {rows.map((row, index) => (
        <Box
          aria-label={`Use price ${row.price.toFixed(2)}`}
          component="button"
          key={`${side}-${index}`}
          onClick={() => onSelect(row.price)}
          sx={styles.row}
        >
          <LinearProgress
            variant="determinate"
            value={24 + index * 7}
            color={side === 'buy' ? 'success' : 'error'}
            sx={styles.depth}
          />
          <Typography
            color={side === 'buy' ? 'success.main' : 'error.main'}
            fontFamily="monospace"
            fontSize={12}
          >
            {row.price.toFixed(2)}
          </Typography>
          <Typography fontFamily="monospace" fontSize={12} textAlign="end">
            {row.amount.toFixed(4)}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}
