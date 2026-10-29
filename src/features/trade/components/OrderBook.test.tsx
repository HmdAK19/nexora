import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { OrderBook, type OrderBookRow } from './OrderBook';

const levels = (start: number): OrderBookRow[] =>
  Array.from({ length: 20 }, (_, index) => ({
    amount: index + 1,
    price: start + index,
  }));

describe('OrderBook', () => {
  it('keeps the best buy and sell levels visible within the desktop depth', () => {
    render(
      <OrderBook
        asks={levels(101)}
        bids={levels(99).map((level, index) => ({ ...level, price: 99 - index }))}
        currentPrice={100}
        onSelectPrice={vi.fn()}
        title="Order book"
      />
    );

    const priceButtons = screen.getAllByRole('button', { name: /Use price/ });

    expect(priceButtons).toHaveLength(16);
    expect(screen.getByRole('button', { name: 'Use price 101.00' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Use price 99.00' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Use price 109.00' })).not.toBeInTheDocument();
  });
});
