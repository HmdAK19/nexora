import { describe, expect, it } from 'vitest';
import { isValidVerificationProfile, validateVerificationDocument } from './verification';
describe('verification validation', () => {
  it('validates profile boundaries', () => {
    expect(isValidVerificationProfile('Hamed Akbarzadeh', 'A12345678')).toBe(true);
    expect(isValidVerificationProfile('A', '123')).toBe(false);
  });
  it('rejects unsupported and oversized documents', () => {
    expect(validateVerificationDocument(new File(['x'], 'id.txt', { type: 'text/plain' }))).toBe('type');
    expect(
      validateVerificationDocument(
        new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'id.pdf', { type: 'application/pdf' })
      )
    ).toBe('size');
  });
});
