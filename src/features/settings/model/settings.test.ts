import { describe, expect, it } from 'vitest';

import { validateAvatarFile } from './settings';

describe('validateAvatarFile', () => {
  it('accepts supported images within the upload limit', () => {
    expect(validateAvatarFile({ size: 1024 * 1024, type: 'image/webp' })).toBeNull();
  });

  it('rejects unsupported formats and oversized images', () => {
    expect(validateAvatarFile({ size: 100, type: 'image/svg+xml' })).toBe('format');
    expect(validateAvatarFile({ size: 1024 * 1024 + 1, type: 'image/png' })).toBe('size');
  });
});
