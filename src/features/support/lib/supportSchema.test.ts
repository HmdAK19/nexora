import { describe, expect, it } from 'vitest';
import { createSupportTicketSchema } from './supportSchema';

const schema = createSupportTicketSchema({
  messageMax: 'messageMax',
  messageMin: 'messageMin',
  messageRequired: 'messageRequired',
  subjectMax: 'subjectMax',
  subjectMin: 'subjectMin',
  subjectRequired: 'subjectRequired',
});

describe('support ticket schema', () => {
  it('trims and accepts a valid ticket', async () => {
    await expect(
      schema.validate({
        category: 'wallet',
        message: '  A detailed wallet request  ',
        subject: '  Deposit issue  ',
      })
    ).resolves.toEqual({
      category: 'wallet',
      message: 'A detailed wallet request',
      subject: 'Deposit issue',
    });
  });
  it('rejects short content', async () => {
    await expect(
      schema.validate({ category: 'wallet', message: 'short', subject: 'x' })
    ).rejects.toBeDefined();
  });
});
