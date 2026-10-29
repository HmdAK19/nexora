import * as yup from 'yup';

import { verificationLimits, type VerificationProfile } from '../model';

export interface VerificationValidationMessages {
  fullNameMax: string;
  fullNameMin: string;
  fullNameRequired: string;
  nationalIdInvalid: string;
  nationalIdRequired: string;
}

export function createVerificationProfileSchema(
  messages: VerificationValidationMessages
): yup.ObjectSchema<VerificationProfile> {
  return yup.object({
    country: yup.mixed<VerificationProfile['country']>().oneOf(['AE', 'IR', 'TR']).required(),
    fullName: yup
      .string()
      .trim()
      .required(messages.fullNameRequired)
      .min(3, messages.fullNameMin)
      .max(verificationLimits.fullNameMax, messages.fullNameMax),
    nationalId: yup
      .string()
      .trim()
      .required(messages.nationalIdRequired)
      .matches(/^[A-Za-z0-9-]{8,32}$/, messages.nationalIdInvalid),
  });
}
