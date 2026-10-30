import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { NAMESPACES } from '@app/i18n';
import { getDefaultAuthorizedPath } from '@shared/lib';

import { AuthPageShell, RegistrationForm } from '../components';
import { useAuth } from '../context';
import { useRegistrationForm } from '../hooks';

export default function RegisterPage() {
  const { t } = useTranslation(NAMESPACES.auth);
  const { isRestoring, user } = useAuth();
  const registration = useRegistrationForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  useEffect(() => {
    document.title = 'Nexora | Register';
  }, []);

  if (!isRestoring && user) return <Navigate replace to={getDefaultAuthorizedPath(user)} />;

  return (
    <AuthPageShell compact contentWidth={560} subtitle={t('register.subtitle')} title={t('register.title')}>
      <RegistrationForm
        confirmPasswordVisible={confirmPasswordVisible}
        form={registration.form}
        onDismissError={registration.clearServerError}
        onSubmit={(event) => void registration.submit(event)}
        onToggleConfirmPassword={() => setConfirmPasswordVisible((value) => !value)}
        onTogglePassword={() => setPasswordVisible((value) => !value)}
        passwordVisible={passwordVisible}
        serverError={registration.serverError}
      />
    </AuthPageShell>
  );
}
