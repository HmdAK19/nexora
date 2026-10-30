import { useEffect, useMemo, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import * as yup from 'yup';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { getApiErrorCode, getApiErrorMessage } from '@shared/api';
import { getDefaultAuthorizedPath } from '@shared/lib';
import { NAMESPACES } from '@app/i18n';

import {
  AuthPageShell,
  DemoAccountSelector,
  ForgotPasswordDialog,
  MfaChallenge,
  type DemoAccount,
} from '../components';
import { useAuth } from '../context';
import { usePasswordReset } from '../hooks';

import { styles } from './LoginPage.styles';

interface LoginValues {
  email: string;
  password: string;
  remember: boolean;
}

const DEMO_ACCOUNTS = [
  { email: 'demo@nexora.dev', password: 'Admin123!', role: 'admin' },
  { email: 'customer@nexora.dev', password: 'Nexora123!', role: 'customer' },
] as const;

const createSchema = (t: (key: string) => string) =>
  yup.object({
    email: yup.string().email(t('validation.emailInvalid')).required(t('validation.emailRequired')),
    password: yup
      .string()
      .min(8, t('validation.passwordMin'))
      .max(128, t('validation.passwordMax'))
      .required(t('validation.passwordRequired')),
    remember: yup.boolean().required(),
  });
export default function LoginPage() {
  const { t } = useTranslation(NAMESPACES.auth);
  const { user, isRestoring, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [recoveryMode, setRecoveryMode] = useState(false);
  const passwordReset = usePasswordReset();
  const schema = useMemo(() => createSchema(t), [t]);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginValues>({
    defaultValues: {
      email: '',
      password: '',
      remember: true,
    },
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    document.title = 'Nexora | Login';
  }, []);
  if (!isRestoring && user) return <Navigate to={getDefaultAuthorizedPath(user)} replace />;
  const onSubmit = async ({ email, password }: LoginValues) => {
    setError(null);
    try {
      const authenticatedUser = await login({
        email,
        ...(mfaRequired && recoveryMode ? { recoveryCode: mfaCode } : {}),
        ...(mfaRequired && !recoveryMode ? { mfaCode } : {}),
        password,
      });
      const destination =
        (
          location.state as {
            from?: string;
          } | null
        )?.from ?? getDefaultAuthorizedPath(authenticatedUser);
      navigate(destination, {
        replace: true,
      });
    } catch (loginError) {
      const code = getApiErrorCode(loginError);
      if (code === 'MFA_REQUIRED') {
        setMfaRequired(true);
        setMfaCode('');
        setError(null);
      } else if (code === 'INVALID_MFA_CODE') {
        setError(t('mfa.invalid'));
      } else if (code === 'INVALID_CREDENTIALS') {
        setError(t('invalid'));
      } else {
        setError(getApiErrorMessage(loginError));
      }
    }
  };
  const fillDemo = (account: DemoAccount) => {
    setMfaRequired(false);
    setMfaCode('');
    setError(null);
    setValue('email', account.email, {
      shouldValidate: true,
    });
    setValue('password', account.password, {
      shouldValidate: true,
    });
  };

  return (
    <>
      <AuthPageShell compact subtitle={t('subtitle')} title={t('welcome')}>
        <Box
          component="form"
          noValidate
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
          sx={styles.form}
        >
          <Stack spacing={1.25}>
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  autoComplete="email"
                  autoFocus
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                  label={t('email')}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Mail size={18} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />
            {mfaRequired && (
              <MfaChallenge
                code={mfaCode}
                label={t(recoveryMode ? 'mfa.recoveryCode' : 'mfa.code')}
                onChange={setMfaCode}
                onToggleRecovery={() => {
                  setRecoveryMode((value) => !value);
                  setMfaCode('');
                  setError(null);
                }}
                recoveryLabel={t(recoveryMode ? 'mfa.useAuthenticator' : 'mfa.useRecovery')}
                recoveryMode={recoveryMode}
                title={t('mfa.title')}
              />
            )}
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  autoComplete="current-password"
                  error={Boolean(errors.password)}
                  helperText={errors.password?.message}
                  label={t('password')}
                  type={showPassword ? 'text' : 'password'}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockKeyhole size={18} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={t('togglePassword')}
                            edge="end"
                            onClick={() => setShowPassword((value) => !value)}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />
            <Box sx={styles.options}>
              <Controller
                name="remember"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox checked={field.value} onChange={field.onChange} />}
                    label={
                      <Typography color="text.secondary" variant="body2">
                        {t('remember')}
                      </Typography>
                    }
                  />
                )}
              />
              <Link
                component="button"
                type="button"
                underline="hover"
                variant="body2"
                onClick={() => passwordReset.setOpen(true)}
              >
                {t('forgot')}
              </Link>
            </Box>
            <Button
              disabled={
                isSubmitting ||
                !isValid ||
                (mfaRequired &&
                  (recoveryMode ? !/^[A-F0-9]{5}-[A-F0-9]{5}$/.test(mfaCode) : mfaCode.length !== 6))
              }
              size="large"
              type="submit"
              variant="contained"
              sx={styles.submit}
            >
              {isSubmitting ? <CircularProgress color="inherit" size={22} /> : t('login')}
            </Button>
            <DemoAccountSelector
              accounts={DEMO_ACCOUNTS.map((account) => ({
                ...account,
                roleLabel: t(`demoAccounts.${account.role}`),
              }))}
              emailLabel={t('email')}
              onSelect={fillDemo}
              passwordLabel={t('password')}
              selectLabel={t('demoAccounts.select')}
              title={t('demoAccounts.title')}
            />
            <Typography color="text.secondary" textAlign="center" variant="body2">
              {t('register.noAccount')}{' '}
              <Link component={RouterLink} to="/register" underline="hover">
                {t('register.createAccount')}
              </Link>
            </Typography>
          </Stack>
        </Box>
      </AuthPageShell>
      <ForgotPasswordDialog controller={passwordReset} />
    </>
  );
}
