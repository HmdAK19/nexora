import { describe, expect, it } from 'vitest';

import { validateConversionAmount } from './conversion';

describe('conversion amount validation', () => {
  it.each(['', 'abc', '1e3', '0x10', '-1'])('rejects invalid syntax: %s', (value) => {
    expect(validateConversionAmount(value)).toBe('invalid');
  });

  it('enforces precision and range boundaries', () => {
    expect(validateConversionAmount('0')).toBe('minimum');
    expect(validateConversionAmount('0.000000001')).toBe('precision');
    expect(validateConversionAmount('1000000.1')).toBe('maximum');
    expect(validateConversionAmount('0.00000001')).toBeNull();
    expect(validateConversionAmount('1000000')).toBeNull();
  });
});
