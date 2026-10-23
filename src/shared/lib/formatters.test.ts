import { describe, expect, it } from 'vitest';

import { formatCompact, formatCurrency, formatPercent } from './formatters';

describe('formatters', () => {
  it('formats currencies with small-value precision', () => {
    expect(formatCurrency(0.624)).toBe('$0.624');
    expect(formatCurrency(1200)).toBe('$1,200.00');
  });
  it('formats percentages with an explicit trend sign', () => {
    expect(formatPercent(2.47)).toBe('+2.47%');
    expect(formatPercent(-1.2)).toBe('-1.2%');
  });
  it('compacts large market volume values', () => {
    expect(formatCompact(1_820_000_000)).toMatch(/1\.8B/);
  });
});
