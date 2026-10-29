import * as yup from 'yup';

import type { AdminSettings } from '../model';

export type AdminSettingsFormValues = Omit<AdminSettings, 'updatedAt'>;

export const createAdminSettingsSchema = (messages: { minimumWithdrawal: string; tradingFee: string }) =>
  yup.object({
    minimumWithdrawal: yup
      .number()
      .typeError(messages.minimumWithdrawal)
      .min(0, messages.minimumWithdrawal)
      .max(1_000_000, messages.minimumWithdrawal)
      .required(messages.minimumWithdrawal),
    networkEnabled: yup.boolean().required(),
    paymentProvider: yup.mixed<'manual' | 'provider-a'>().oneOf(['manual', 'provider-a']).required(),
    tradingFeePercent: yup
      .number()
      .typeError(messages.tradingFee)
      .min(0, messages.tradingFee)
      .max(10, messages.tradingFee)
      .required(messages.tradingFee),
    withdrawalsEnabled: yup.boolean().required(),
  });
