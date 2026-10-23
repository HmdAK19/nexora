import * as yup from 'yup';

export interface PasswordValues {
  confirm: string;
  current: string;
  next: string;
}

export interface ProfileValues {
  email: string;
  name: string;
  phone: string;
}

export type SecurityDialog = 'password' | 'sessions' | 'twoFactor' | null;
export type SecurityMessage = 'passwordMismatch' | 'passwordUpdated' | 'twoFactorEnabled' | null;

export const emptyPasswords: PasswordValues = { confirm: '', current: '', next: '' };

export const profileSchema = yup.object({
  name: yup.string().min(2).required(),
  email: yup.string().email().required(),
  phone: yup
    .string()
    .matches(/^\+?[\d\s-]{8,16}$/)
    .required(),
});
