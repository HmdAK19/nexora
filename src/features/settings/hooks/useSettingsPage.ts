import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useTransientState } from '@shared/hooks';
import type { User } from '@shared/model';

import {
  emptyPasswords,
  profileSchema,
  type PasswordValues,
  type ProfileValues,
  type SecurityDialog,
  type SecurityMessage,
} from '../model';

const PROFILE_STORAGE_KEY = 'nexora-profile';

export function useSettingsPage(user?: User | null) {
  const [tab, setTab] = useState(0);
  const [saved, showSaved] = useTransientState(false, 2500);
  const [securityDialog, setSecurityDialog] = useState<SecurityDialog>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [hasMobileSession, setHasMobileSession] = useState(true);
  const [passwords, setPasswords] = useState<PasswordValues>(emptyPasswords);
  const [securityMessage, setSecurityMessage] = useState<SecurityMessage>(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [tradingNotifications, setTradingNotifications] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const profileForm = useForm<ProfileValues>({
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: '+98 912 000 0000',
    },
    resolver: yupResolver(profileSchema),
  });

  useEffect(
    () => () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    },
    [photoUrl]
  );

  const saveProfile = async (values: ProfileValues) => {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(values));
    showSaved(true);
  };

  const selectPhoto = (file: File) => {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(URL.createObjectURL(file));
  };

  const closeSecurityDialog = () => {
    setSecurityDialog(null);
    setVerificationCode('');
    setPasswords(emptyPasswords);
    setSecurityMessage(null);
  };

  const toggleTwoFactor = () => {
    if (twoFactorEnabled) setTwoFactorEnabled(false);
    else setSecurityDialog('twoFactor');
  };

  const confirmTwoFactor = () => {
    if (!/^\d{6}$/.test(verificationCode)) return;

    setTwoFactorEnabled(true);
    setSecurityMessage('twoFactorEnabled');
  };

  const updatePassword = () => {
    if (passwords.next !== passwords.confirm) {
      setSecurityMessage('passwordMismatch');

      return;
    }

    if (passwords.current.length < 8 || passwords.next.length < 8) return;

    setSecurityMessage('passwordUpdated');
    setPasswords(emptyPasswords);
  };

  return {
    closeSecurityDialog,
    confirmTwoFactor,
    hasMobileSession,
    passwords,
    photoUrl,
    priceAlerts,
    profileForm,
    saved,
    saveProfile,
    securityDialog,
    securityMessage,
    selectPhoto,
    setHasMobileSession,
    setPasswords,
    setPriceAlerts,
    setSecurityDialog,
    setTab,
    setTradingNotifications,
    setVerificationCode,
    tab,
    toggleTwoFactor,
    tradingNotifications,
    twoFactorEnabled,
    updatePassword,
    verificationCode,
  };
}

export type SettingsController = ReturnType<typeof useSettingsPage>;
