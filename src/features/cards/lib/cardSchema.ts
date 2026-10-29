import * as yup from 'yup';

import type { AddBankCardInput } from '../model';
import { isValidIranianCard, isValidIranianIban, normalizeCardNumber, normalizeIban } from './cardValidation';

export interface CardValidationMessages {
  cardInvalid: string;
  cardRequired: string;
  ibanInvalid: string;
  ibanRequired: string;
}

export function createCardSchema(messages: CardValidationMessages): yup.ObjectSchema<AddBankCardInput> {
  return yup.object({
    iban: yup
      .string()
      .transform((value: string) => normalizeIban(value))
      .required(messages.ibanRequired)
      .test('iranian-iban', messages.ibanInvalid, isValidIranianIban),
    number: yup
      .string()
      .transform((value: string) => normalizeCardNumber(value))
      .required(messages.cardRequired)
      .test('iranian-card', messages.cardInvalid, isValidIranianCard),
  });
}
