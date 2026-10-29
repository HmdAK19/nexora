import { describe, expect, it } from 'vitest';

import { createAdminSettingsSchema } from './adminSettingsSchema';

const schema = createAdminSettingsSchema({
  minimumWithdrawal: 'invalid withdrawal',
  tradingFee: 'invalid fee',
});

describe('admin settings schema', () => {
  it('accepts settings inside server boundaries', async () => {
    await expect(
      schema.validate({
        minimumWithdrawal: 10,
        networkEnabled: true,
        paymentProvider: 'manual',
        tradingFeePercent: 0.08,
        withdrawalsEnabled: true,
      })
    ).resolves.toBeDefined();
  });

  it('rejects unsafe fee and withdrawal values', async () => {
    await expect(
      schema.validate({
        minimumWithdrawal: -1,
        networkEnabled: true,
        paymentProvider: 'manual',
        tradingFeePercent: 11,
        withdrawalsEnabled: true,
      })
    ).rejects.toThrow();
  });
});
