import * as yup from 'yup';

import { supportCategories, supportLimits, type CreateTicketFormValues } from '../model';

export interface SupportValidationMessages {
  messageMax: string;
  messageMin: string;
  messageRequired: string;
  subjectMax: string;
  subjectMin: string;
  subjectRequired: string;
}

export function createSupportTicketSchema(
  messages: SupportValidationMessages
): yup.ObjectSchema<CreateTicketFormValues> {
  return yup.object({
    category: yup.mixed<CreateTicketFormValues['category']>().oneOf(supportCategories).required(),
    message: yup
      .string()
      .trim()
      .required(messages.messageRequired)
      .min(supportLimits.messageMinLength, messages.messageMin)
      .max(supportLimits.messageMaxLength, messages.messageMax),
    subject: yup
      .string()
      .trim()
      .required(messages.subjectRequired)
      .min(supportLimits.subjectMinLength, messages.subjectMin)
      .max(supportLimits.subjectMaxLength, messages.subjectMax),
  });
}
