import { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';

import { getSupportErrorKey } from './support';

function apiError(code: string) {
  return new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
    config: {} as never,
    data: { code },
    headers: {},
    status: 409,
    statusText: 'Conflict',
  });
}

describe('getSupportErrorKey', () => {
  it('maps allow-listed server errors to localized keys', () => {
    expect(getSupportErrorKey(apiError('TICKET_CLOSED'))).toBe('errors.TICKET_CLOSED');
  });

  it('does not expose unknown server errors', () => {
    expect(getSupportErrorKey(apiError('INTERNAL_DETAIL'))).toBe('errors.unexpected');
  });

  it('distinguishes network failures', () => {
    expect(getSupportErrorKey(new AxiosError('Network error'))).toBe('errors.network');
  });
});
