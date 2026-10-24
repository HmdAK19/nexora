import axios from 'axios';

import { conversionLimits } from '../model';

export type ConversionAmountError = 'invalid' | 'maximum' | 'minimum' | 'precision' | null;

const publicErrorCodes = new Set([
  'CONVERSION_BLOCKED',
  'INSUFFICIENT_BALANCE',
  'AMOUNT_TOO_SMALL',
  'QUOTE_EXPIRED',
  'QUOTE_NOT_FOUND',
  'RATE_LIMITED',
]);

export function validateConversionAmount(value: string): ConversionAmountError {
  const normalized = value.trim();

  if (!/^\d+(?:\.\d+)?$/.test(normalized)) {
    return 'invalid';
  }

  const fraction = normalized.split('.')[1];

  if (fraction && fraction.length > conversionLimits.maximumDecimals) {
    return 'precision';
  }

  const amount = Number(normalized);

  if (!Number.isFinite(amount) || amount < conversionLimits.minimum) {
    return 'minimum';
  }

  if (amount > conversionLimits.maximum) {
    return 'maximum';
  }

  return null;
}

export function getConversionErrorKey(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return 'errors.unexpected';
  }

  const code = error.response?.data?.code;

  if (typeof code === 'string' && publicErrorCodes.has(code)) {
    return `errors.${code}`;
  }

  return error.response ? 'errors.unexpected' : 'errors.network';
}
