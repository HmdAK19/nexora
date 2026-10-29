import { describe, expect, it } from 'vitest';
import { isValidIranianCard, isValidIranianIban } from './cardValidation';
describe('bank card validation', () => {
  it('validates checksum and rejects repeated digits', () => {
    expect(isValidIranianCard('6037 9975 1234 5670')).toBe(true);
    expect(isValidIranianCard('1111111111111111')).toBe(false);
  });
  it('validates Iranian IBAN checksum', () => {
    expect(isValidIranianIban('IR82 0540 1026 8002 0817 9090 02')).toBe(true);
    expect(isValidIranianIban('IR00 0000 0000 0000 0000 0000 00')).toBe(false);
  });
});
