import { apiClient, isRecord, readIsoDate, readString } from '@shared/api';

import type {
  AccountPreferences,
  AccountProfile,
  AccountSecurity,
  ChangePasswordInput,
  MfaRecoveryCodes,
  MfaSetup,
  ProfileValues,
  Session,
} from '../model';

function parseSession(value: unknown): Session {
  if (!isRecord(value) || typeof value.current !== 'boolean') {
    throw new Error('Invalid account session response');
  }

  return {
    browser: readString(value, 'browser'),
    current: value.current,
    device: readString(value, 'device'),
    id: readString(value, 'id'),
    ipAddress: readString(value, 'ipAddress'),
    lastActiveAt: readIsoDate(value, 'lastActiveAt'),
    location: readString(value, 'location'),
  };
}

function parseAccountSecurity(value: unknown): AccountSecurity {
  if (!isRecord(value) || typeof value.twoFactorEnabled !== 'boolean' || !Array.isArray(value.sessions)) {
    throw new Error('Invalid account security response');
  }

  const sessions = value.sessions.map(parseSession);
  if (sessions.length === 0 || sessions.filter((session) => session.current).length !== 1) {
    throw new Error('Invalid account security sessions');
  }

  return {
    passwordChangedAt: readIsoDate(value, 'passwordChangedAt'),
    sessions,
    twoFactorEnabled: value.twoFactorEnabled,
  };
}

function parseMfaSetup(value: unknown): MfaSetup {
  if (!isRecord(value)) throw new Error('Invalid MFA setup response');
  const otpauthUri = readString(value, 'otpauthUri');
  if (!otpauthUri.startsWith('otpauth://totp/')) throw new Error('Invalid MFA setup URI');
  return {
    expiresAt: readIsoDate(value, 'expiresAt'),
    otpauthUri,
    secret: readString(value, 'secret'),
    setupToken: readString(value, 'setupToken'),
  };
}

function parseRecoveryCodes(value: unknown): MfaRecoveryCodes {
  if (!isRecord(value) || !Array.isArray(value.recoveryCodes)) {
    throw new Error('Invalid MFA recovery response');
  }
  const recoveryCodes = value.recoveryCodes.filter(
    (code): code is string => typeof code === 'string' && /^[A-F0-9]{5}-[A-F0-9]{5}$/.test(code)
  );
  if (recoveryCodes.length !== value.recoveryCodes.length || recoveryCodes.length === 0) {
    throw new Error('Invalid MFA recovery codes');
  }
  return { recoveryCodes };
}

function parseProfile(value: unknown): AccountProfile {
  if (!isRecord(value) || (value.avatarUrl !== null && typeof value.avatarUrl !== 'string')) {
    throw new Error('Invalid account profile response');
  }
  return {
    avatarUrl: value.avatarUrl,
    email: readString(value, 'email'),
    name: readString(value, 'name'),
    phone: readString(value, 'phone'),
  };
}

function parsePreferences(value: unknown): AccountPreferences {
  if (
    !isRecord(value) ||
    !['dark', 'light'].includes(String(value.colorMode)) ||
    !['en', 'fa'].includes(String(value.language)) ||
    typeof value.priceAlerts !== 'boolean' ||
    typeof value.tradingNotifications !== 'boolean'
  ) {
    throw new Error('Invalid account preferences response');
  }
  return {
    colorMode: value.colorMode as AccountPreferences['colorMode'],
    language: value.language as AccountPreferences['language'],
    priceAlerts: value.priceAlerts,
    tradingNotifications: value.tradingNotifications,
  };
}

export const settingsKeys = {
  all: ['account-settings'] as const,
  security: () => ['account-settings', 'security'] as const,
  profile: () => ['account-settings', 'profile'] as const,
  preferences: () => ['account-settings', 'preferences'] as const,
};

export const settingsApi = {
  getSecurity: async (): Promise<AccountSecurity> => {
    const data: unknown = (await apiClient.get('/account/security')).data;
    return parseAccountSecurity(data);
  },
  changePassword: async (input: ChangePasswordInput): Promise<void> => {
    await apiClient.put('/account/password', input);
  },
  revokeSession: async (sessionId: string): Promise<void> => {
    await apiClient.delete(`/account/sessions/${encodeURIComponent(sessionId)}`);
  },
  beginMfaSetup: async (currentPassword: string): Promise<MfaSetup> =>
    parseMfaSetup((await apiClient.post('/account/mfa/setup', { currentPassword })).data),
  confirmMfaSetup: async (input: { code: string; setupToken: string }): Promise<MfaRecoveryCodes> =>
    parseRecoveryCodes((await apiClient.post('/account/mfa/confirm', input)).data),
  disableMfa: async (input: { code: string; currentPassword: string }): Promise<void> => {
    await apiClient.delete('/account/mfa', { data: input });
  },
  getProfile: async (): Promise<AccountProfile> =>
    parseProfile((await apiClient.get('/account/profile')).data),
  updateProfile: async (input: ProfileValues): Promise<AccountProfile> =>
    parseProfile((await apiClient.patch('/account/profile', { name: input.name, phone: input.phone })).data),
  updateAvatar: async (file: File): Promise<AccountProfile> =>
    parseProfile(
      (
        await apiClient.put('/account/avatar', file, {
          headers: { 'Content-Type': file.type },
        })
      ).data
    ),
  getPreferences: async (): Promise<AccountPreferences> =>
    parsePreferences((await apiClient.get('/account/preferences')).data),
  updatePreferences: async (input: AccountPreferences): Promise<AccountPreferences> =>
    parsePreferences((await apiClient.put('/account/preferences', input)).data),
};
