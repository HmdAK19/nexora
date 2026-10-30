import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { setColorMode, useAppDispatch } from '@app/store';
import { useAuth } from '@features/auth';
import { useLanguage, useTransientState } from '@shared/hooks';
import type { User } from '@shared/model';

import {
  emptyPasswords,
  profileSchema,
  validateAvatarFile,
  type AvatarValidationError,
  type PasswordValues,
  type ProfileValues,
  type SecurityDialog,
  type SecurityMessage,
} from '../model';
import { useAccountSecurity } from './useAccountSecurity';
import { useAccountSettings } from './useAccountSettings';

export function useSettingsPage(user?: User | null) {
  const dispatch = useAppDispatch();
  const { refreshUser } = useAuth();
  const { changeLanguage } = useLanguage();
  const [tab, setTab] = useState(0);
  const [saved, showSaved] = useTransientState(false, 2500);
  const [securityDialog, setSecurityDialog] = useState<SecurityDialog>(null);
  const [passwords, setPasswords] = useState<PasswordValues>(emptyPasswords);
  const [securityMessage, setSecurityMessage] = useState<SecurityMessage>(null);
  const [mfaPassword, setMfaPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [avatarValidationError, setAvatarValidationError] = useState<AvatarValidationError | null>(null);
  const accountSecurity = useAccountSecurity();
  const accountSettings = useAccountSettings();
  const profileForm = useForm<ProfileValues>({
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: '+98 912 000 0000',
    },
    resolver: yupResolver(profileSchema),
  });

  useEffect(() => {
    if (accountSettings.profile) profileForm.reset(accountSettings.profile);
  }, [accountSettings.profile, profileForm]);

  useEffect(() => {
    if (!accountSettings.preferences) return;
    changeLanguage(accountSettings.preferences.language);
    dispatch(setColorMode(accountSettings.preferences.colorMode));
  }, [accountSettings.preferences, changeLanguage, dispatch]);

  const saveProfile = async (values: ProfileValues) => {
    try {
      await accountSettings.saveProfile(values);
      await refreshUser().catch(() => undefined);
      showSaved(true);
    } catch {
      // The mutation exposes a localized error state on the page.
    }
  };

  const selectPhoto = async (file: File) => {
    const validationError = validateAvatarFile(file);
    setAvatarValidationError(validationError);
    if (validationError) return;
    try {
      await accountSettings.saveAvatar(file);
      showSaved(true);
    } catch {
      // The mutation exposes a localized error state on the page.
    }
  };

  const updatePreferences = async (patch: Partial<NonNullable<typeof accountSettings.preferences>>) => {
    if (!accountSettings.preferences || accountSettings.savingPreferences) return;
    try {
      const updated = await accountSettings.savePreferences({ ...accountSettings.preferences, ...patch });
      changeLanguage(updated.language);
      dispatch(setColorMode(updated.colorMode));
      showSaved(true);
    } catch {
      // The mutation exposes a localized error state on the page.
    }
  };

  const closeSecurityDialog = () => {
    if (accountSecurity.changePasswordPending || accountSecurity.mfaPending) return;
    setSecurityDialog(null);
    setPasswords(emptyPasswords);
    setSecurityMessage(null);
    accountSecurity.clearChangePasswordError();
    accountSecurity.resetMfa();
    setMfaPassword('');
    setMfaCode('');
  };

  const beginMfaSetup = async () => {
    try {
      await accountSecurity.beginMfa(mfaPassword);
      setMfaPassword('');
    } catch {
      // The mutation exposes a localized error state to the dialog.
    }
  };

  const confirmMfaSetup = async () => {
    if (!accountSecurity.mfaSetup) return;
    try {
      await accountSecurity.confirmMfa({ code: mfaCode, setupToken: accountSecurity.mfaSetup.setupToken });
      setMfaCode('');
    } catch {
      // The mutation exposes a localized error state to the dialog.
    }
  };

  const disableMfa = async () => {
    try {
      await accountSecurity.disableMfa({ code: mfaCode, currentPassword: mfaPassword });
      setSecurityDialog(null);
      accountSecurity.resetMfa();
      setMfaPassword('');
      setMfaCode('');
    } catch {
      // The mutation exposes a localized error state to the dialog.
    }
  };

  const updatePassword = async () => {
    if (passwords.next !== passwords.confirm) {
      setSecurityMessage('passwordMismatch');
      return;
    }

    if (passwords.current.length < 8 || passwords.next.length < 8) return;

    setSecurityMessage(null);
    try {
      await accountSecurity.changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.next,
      });
      setSecurityMessage('passwordUpdated');
      setPasswords(emptyPasswords);
    } catch {
      // The mutation exposes a localized, allow-listed error state to the dialog.
    }
  };

  return {
    closeSecurityDialog,
    accountSecurity,
    accountSettings,
    avatarValidationError,
    beginMfaSetup,
    confirmMfaSetup,
    disableMfa,
    mfaCode,
    mfaPassword,
    passwords,
    profileForm,
    saved,
    saveProfile,
    securityDialog,
    securityMessage,
    selectPhoto,
    setPasswords,
    setMfaCode,
    setMfaPassword,
    setSecurityDialog,
    setTab,
    tab,
    updatePreferences,
    updatePassword,
  };
}

export type SettingsController = ReturnType<typeof useSettingsPage>;
