import { describe, expect, it } from 'vitest';
import { createVerificationProfileSchema } from './verificationSchema';

const schema = createVerificationProfileSchema({
  fullNameMax: 'fullNameMax',
  fullNameMin: 'fullNameMin',
  fullNameRequired: 'fullNameRequired',
  nationalIdInvalid: 'nationalIdInvalid',
  nationalIdRequired: 'nationalIdRequired',
});

describe('verification profile schema', () => {
  it('normalizes and accepts valid identity details', async () => {
    await expect(
      schema.validate({ country: 'IR', fullName: '  Hamed Akbarzadeh  ', nationalId: '  A12345678  ' })
    ).resolves.toEqual({ country: 'IR', fullName: 'Hamed Akbarzadeh', nationalId: 'A12345678' });
  });
  it('rejects unsupported identifier characters', async () => {
    await expect(
      schema.validate({ country: 'IR', fullName: 'Valid Name', nationalId: '۱۲۳۴۵۶۷۸' })
    ).rejects.toMatchObject({ message: 'nationalIdInvalid' });
  });
});
