import { describe, expect, it } from 'vitest';
import { createCardSchema } from './cardSchema';

const schema = createCardSchema({
  cardInvalid: 'cardInvalid',
  cardRequired: 'cardRequired',
  ibanInvalid: 'ibanInvalid',
  ibanRequired: 'ibanRequired',
});

describe('card schema', () => {
  it('normalizes valid card and IBAN values', async () => {
    await expect(
      schema.validate({ number: '6037 9975 1234 5670', iban: 'ir82 0540 1026 8002 0817 9090 02' })
    ).resolves.toEqual({ number: '6037997512345670', iban: 'IR820540102680020817909002' });
  });
  it('returns field-specific errors for invalid values', async () => {
    await expect(
      schema.validate({ number: '1111111111111111', iban: 'IR00' }, { abortEarly: false })
    ).rejects.toMatchObject({ errors: expect.arrayContaining(['cardInvalid', 'ibanInvalid']) });
  });
});
