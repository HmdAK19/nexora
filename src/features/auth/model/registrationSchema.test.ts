import { describe, expect, it } from 'vitest';

import { createRegistrationSchema, getPasswordRequirements } from './registrationSchema';

const messages = {
  emailInvalid: 'emailInvalid',
  emailRequired: 'emailRequired',
  nameInvalid: 'nameInvalid',
  nameMax: 'nameMax',
  nameMin: 'nameMin',
  nameRequired: 'nameRequired',
  passwordLowercase: 'passwordLowercase',
  passwordMax: 'passwordMax',
  passwordMin: 'passwordMin',
  passwordNoWhitespace: 'passwordNoWhitespace',
  passwordNumber: 'passwordNumber',
  passwordRequired: 'passwordRequired',
  passwordSpecial: 'passwordSpecial',
  passwordUppercase: 'passwordUppercase',
  passwordsMismatch: 'passwordsMismatch',
  phoneInvalid: 'phoneInvalid',
  termsRequired: 'termsRequired',
};

describe('registrationSchema', () => {
  const schema = createRegistrationSchema(messages);

  it('normalizes a valid bilingual registration form', async () => {
    await expect(
      schema.validate({
        acceptTerms: true,
        confirmPassword: 'StrongPass1!',
        email: '  USER@Example.COM ',
        name: '  کاربر   جدید  ',
        password: 'StrongPass1!',
        phone: '+989121234567',
      })
    ).resolves.toMatchObject({ email: 'user@example.com', name: 'کاربر جدید' });
  });

  it.each([
    ['name', { name: '1234' }],
    ['email', { email: 'invalid' }],
    ['phone', { phone: '09121234567' }],
    ['password', { password: 'weak', confirmPassword: 'weak' }],
    ['confirmation', { confirmPassword: 'Different1!' }],
    ['terms', { acceptTerms: false }],
  ])('rejects an invalid %s boundary', async (_boundary, patch) => {
    await expect(
      schema.validate({
        acceptTerms: true,
        confirmPassword: 'StrongPass1!',
        email: 'user@example.com',
        name: 'Valid User',
        password: 'StrongPass1!',
        phone: '',
        ...patch,
      })
    ).rejects.toBeDefined();
  });

  it('reports every password policy signal independently', () => {
    expect(getPasswordRequirements('StrongPass1!')).toEqual({
      length: true,
      lowercase: true,
      number: true,
      special: true,
      uppercase: true,
      whitespace: true,
    });
    expect(Object.values(getPasswordRequirements('weak password')).every(Boolean)).toBe(false);
  });
});
