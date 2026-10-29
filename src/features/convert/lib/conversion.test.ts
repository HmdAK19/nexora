import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';

import { getConversionErrorKey, validateConversionAmount } from './conversion';

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

  it('maps public conversion errors without exposing internal codes', () => {
    vi.spyOn(axios, 'isAxiosError').mockReturnValue(true);

    expect(getConversionErrorKey({ response: { data: { code: 'QUOTE_NOT_FOUND' } } })).toBe(
      'errors.QUOTE_NOT_FOUND'
    );
    expect(getConversionErrorKey({ response: { data: { code: 'INTERNAL_FAILURE' } } })).toBe(
      'errors.unexpected'
    );
    expect(getConversionErrorKey({})).toBe('errors.network');

    vi.restoreAllMocks();
    expect(getConversionErrorKey(new Error('failure'))).toBe('errors.unexpected');
  });
});
