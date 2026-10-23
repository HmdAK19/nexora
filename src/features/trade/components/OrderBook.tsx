import { Box, Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material';

import { formatCurrency } from '@shared/lib';

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
}

export function OrderBook({
  asks,
  bids,
  currentPrice,
  onSelectPrice,
  title,
  variant = 'desktop',
}: OrderBookProps) {
  if (variant === 'compact') {
    return (
      <Card sx={styles.compactCard}>
        <CardContent sx={styles.content}>
          <Typography sx={styles.title} variant="h3">
            {title}
          </Typography>
          <Box sx={styles.compactGrid}>
            <BookRows rows={asks.slice(0, 6)} side="sell" onSelect={onSelectPrice} />
            <BookRows rows={bids.slice(0, 6)} side="buy" onSelect={onSelectPrice} />
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
        <BookRows rows={asks} side="sell" onSelect={onSelectPrice} />
        <Box sx={styles.currentPrice}>{formatCurrency(currentPrice)}</Box>
        <BookRows rows={bids} side="buy" onSelect={onSelectPrice} />
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
