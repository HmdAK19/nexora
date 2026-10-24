import { describe, expect, it } from 'vitest';

import { getSecondsRemaining } from '@shared/lib';

import { validatePurchaseAmount } from './purchase';

describe('purchase validation', () => {
  it.each(['', 'not-a-number', 'Infinity', '0x10', '10.001'])('rejects an invalid amount: %s', (value) => {
    expect(validatePurchaseAmount(value)).toBe('invalid');
  });

  it('enforces the supported purchase limits', () => {
    expect(validatePurchaseAmount('9.99')).toBe('minimum');
    expect(validatePurchaseAmount('50000.01')).toBe('maximum');
    expect(validatePurchaseAmount('10')).toBeNull();
    expect(validatePurchaseAmount('50000')).toBeNull();
  });

  it('calculates a non-negative quote lifetime', () => {
    expect(getSecondsRemaining('2026-01-01T00:00:05.001Z', Date.parse('2026-01-01T00:00:00Z'))).toBe(6);
    expect(getSecondsRemaining('2025-12-31T23:59:59Z', Date.parse('2026-01-01T00:00:00Z'))).toBe(0);
    expect(getSecondsRemaining('invalid', Date.now())).toBe(0);
  });
});
