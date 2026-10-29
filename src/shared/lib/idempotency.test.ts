import { afterEach, describe, expect, it, vi } from 'vitest';

import { createIdempotencyKey } from './idempotency';

describe('createIdempotencyKey', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('uses the platform cryptographic UUID generator', () => {
    const randomUUID = vi.fn(() => '7d8ce09f-491c-4a68-b400-a71c29b10db8');
    vi.stubGlobal('crypto', { randomUUID });

    expect(createIdempotencyKey()).toBe('7d8ce09f-491c-4a68-b400-a71c29b10db8');
    expect(randomUUID).toHaveBeenCalledOnce();
  });

  it('fails closed when secure UUID generation is unavailable', () => {
    vi.stubGlobal('crypto', {});

    expect(() => createIdempotencyKey()).toThrow('Secure UUID generation is unavailable');
  });
});
