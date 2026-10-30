import * as yup from 'yup';

export interface PasswordValues {
  confirm: string;
  current: string;
  next: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface Session {
  browser: string;
  current: boolean;
  device: string;
  id: string;
  ipAddress: string;
  lastActiveAt: string;
  location: string;
}

export interface AccountSecurity {
  passwordChangedAt: string;
  sessions: Session[];
  twoFactorEnabled: boolean;
}

export interface MfaSetup {
  expiresAt: string;
  otpauthUri: string;
  secret: string;
  setupToken: string;
}

export interface MfaRecoveryCodes {
  recoveryCodes: string[];
}

export interface ProfileValues {
  email: string;
  name: string;
  phone: string;
}

export interface AccountProfile extends ProfileValues {
  avatarUrl: string | null;
}

export interface AccountPreferences {
  colorMode: 'dark' | 'light';
  language: 'en' | 'fa';
  priceAlerts: boolean;
  tradingNotifications: boolean;
}

export type AvatarValidationError = 'format' | 'size';

export function validateAvatarFile(file: Pick<File, 'size' | 'type'>): AvatarValidationError | null {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return 'format';
  if (file.size > 1024 * 1024) return 'size';
  return null;
}

export type SecurityDialog = 'mfa' | 'password' | 'sessions' | null;
export type SecurityMessage = 'passwordMismatch' | 'passwordUpdated' | null;

export const emptyPasswords: PasswordValues = { confirm: '', current: '', next: '' };

export const profileSchema = yup.object({
  name: yup.string().min(2).required(),
  email: yup.string().email().required(),
  phone: yup
    .string()
    .matches(/^\+?[\d\s-]{8,16}$/)
    .required(),
});
