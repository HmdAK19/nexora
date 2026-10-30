import { useMemo, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { NAMESPACES } from '@app/i18n';
import { getApiErrorCode, getApiErrorMessage } from '@shared/api';
import { useLanguage } from '@shared/hooks';
import { getDefaultAuthorizedPath } from '@shared/lib';

import { useAuth } from '../context';
import { createRegistrationSchema, type RegistrationFormValues } from '../model';

export function useRegistrationForm() {
  const { t } = useTranslation(NAMESPACES.auth);
  const { lang } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const messages = useMemo(
    () => ({
      emailInvalid: t('register.validation.emailInvalid'),
      emailRequired: t('register.validation.emailRequired'),
      nameInvalid: t('register.validation.nameInvalid'),
      nameMax: t('register.validation.nameMax'),
      nameMin: t('register.validation.nameMin'),
      nameRequired: t('register.validation.nameRequired'),
      passwordLowercase: t('register.validation.passwordLowercase'),
      passwordMax: t('register.validation.passwordMax'),
      passwordMin: t('register.validation.passwordMin'),
      passwordNoWhitespace: t('register.validation.passwordNoWhitespace'),
      passwordNumber: t('register.validation.passwordNumber'),
      passwordRequired: t('register.validation.passwordRequired'),
      passwordSpecial: t('register.validation.passwordSpecial'),
      passwordUppercase: t('register.validation.passwordUppercase'),
      passwordsMismatch: t('register.validation.passwordsMismatch'),
      phoneInvalid: t('register.validation.phoneInvalid'),
      termsRequired: t('register.validation.termsRequired'),
    }),
    [t]
  );
  const schema = useMemo(() => createRegistrationSchema(messages), [messages]);
  const form = useForm<RegistrationFormValues>({
    defaultValues: {
      acceptTerms: false,
      confirmPassword: '',
      email: '',
      name: '',
      password: '',
      phone: '',
    },
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const submit = form.handleSubmit(async ({ email, name, password, phone }) => {
    setServerError(null);
    try {
      const user = await register({
        email,
        language: lang,
        name,
        password,
        ...(phone ? { phone } : {}),
        termsAccepted: true,
      });
      navigate(getDefaultAuthorizedPath(user), { replace: true });
    } catch (error) {
      const code = getApiErrorCode(error);
      setServerError(
        code === 'EMAIL_ALREADY_EXISTS'
          ? t('register.errors.emailExists')
          : code === 'RATE_LIMITED'
            ? t('register.errors.rateLimited')
            : getApiErrorMessage(error)
      );
    }
  });

  return { clearServerError: () => setServerError(null), form, serverError, submit };
}
