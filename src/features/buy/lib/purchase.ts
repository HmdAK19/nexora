import axios from 'axios';

import { purchaseLimits } from '../model';

export type PurchaseAmountError = 'invalid' | 'maximum' | 'minimum' | null;

const knownPurchaseErrors = new Set([
  'INSUFFICIENT_BALANCE',
  'LIMIT_EXCEEDED',
  'PURCHASE_BLOCKED',
  'QUOTE_EXPIRED',
  'QUOTE_NOT_FOUND',
  'RATE_LIMITED',
]);

export function validatePurchaseAmount(value: string): PurchaseAmountError {
  const normalizedValue = value.trim();
  const amount = Number(normalizedValue);

  if (!/^\d+(?:\.\d{1,2})?$/.test(normalizedValue) || !Number.isFinite(amount)) {
    return 'invalid';
  }

  if (amount < purchaseLimits.minimum) {
    return 'minimum';
  }

  if (amount > purchaseLimits.maximum) {
    return 'maximum';
  }

  return null;
}

export function getPurchaseErrorKey(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return 'errors.unexpected';
  }

  const responseCode = error.response?.data?.code;

  if (typeof responseCode === 'string' && knownPurchaseErrors.has(responseCode)) {
    return `errors.${responseCode}`;
  }

  if (!error.response) {
    return 'errors.network';
  }

  return 'errors.unexpected';
}
