import * as yup from 'yup';

export interface RegistrationFormValues {
  acceptTerms: boolean;
  confirmPassword: string;
  email: string;
  name: string;
  password: string;
  phone: string;
}

export interface RegistrationValidationMessages {
  emailInvalid: string;
  emailRequired: string;
  nameInvalid: string;
  nameMax: string;
  nameMin: string;
  nameRequired: string;
  passwordLowercase: string;
  passwordMax: string;
  passwordMin: string;
  passwordNoWhitespace: string;
  passwordNumber: string;
  passwordRequired: string;
  passwordSpecial: string;
  passwordUppercase: string;
  passwordsMismatch: string;
  phoneInvalid: string;
  termsRequired: string;
}

const namePattern = /^[\p{L}\p{M}][\p{L}\p{M}\s'’-]*$/u;
const phonePattern = /^\+[1-9]\d{7,14}$/;

export const createRegistrationSchema = (
  messages: RegistrationValidationMessages
): yup.ObjectSchema<RegistrationFormValues> =>
  yup.object({
    acceptTerms: yup.boolean().oneOf([true], messages.termsRequired).required(),
    confirmPassword: yup
      .string()
      .required(messages.passwordRequired)
      .oneOf([yup.ref('password')], messages.passwordsMismatch),
    email: yup
      .string()
      .trim()
      .lowercase()
      .email(messages.emailInvalid)
      .max(254, messages.emailInvalid)
      .required(messages.emailRequired),
    name: yup
      .string()
      .transform((value: string) => value.trim().replace(/\s+/g, ' '))
      .min(2, messages.nameMin)
      .max(80, messages.nameMax)
      .matches(namePattern, messages.nameInvalid)
      .required(messages.nameRequired),
    password: yup
      .string()
      .min(10, messages.passwordMin)
      .max(128, messages.passwordMax)
      .matches(/[a-z]/, messages.passwordLowercase)
      .matches(/[A-Z]/, messages.passwordUppercase)
      .matches(/\d/, messages.passwordNumber)
      .matches(/[^A-Za-z0-9\s]/, messages.passwordSpecial)
      .matches(/^\S+$/, messages.passwordNoWhitespace)
      .required(messages.passwordRequired),
    phone: yup
      .string()
      .trim()
      .matches(phonePattern, { excludeEmptyString: true, message: messages.phoneInvalid })
      .defined(),
  });

export const getPasswordRequirements = (password: string) => ({
  length: password.length >= 10 && password.length <= 128,
  lowercase: /[a-z]/.test(password),
  number: /\d/.test(password),
  special: /[^A-Za-z0-9\s]/.test(password),
  uppercase: /[A-Z]/.test(password),
  whitespace: /^\S*$/.test(password),
});
