import type { FormEventHandler } from 'react';
import { Controller, useWatch, type UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CircleHelp, Eye, EyeOff, LockKeyhole, Mail, Phone, UserRound } from 'lucide-react';
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
  Tooltip,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { NAMESPACES } from '@app/i18n';

import { getPasswordRequirements, type RegistrationFormValues } from '../model';

import { PasswordRequirements } from './PasswordRequirements';

interface RegistrationFormProps {
  confirmPasswordVisible: boolean;
  form: UseFormReturn<RegistrationFormValues>;
  onDismissError: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onToggleConfirmPassword: () => void;
  onTogglePassword: () => void;
  passwordVisible: boolean;
  serverError: string | null;
}

export function RegistrationForm({
  confirmPasswordVisible,
  form,
  onDismissError,
  onSubmit,
  onToggleConfirmPassword,
  onTogglePassword,
  passwordVisible,
  serverError,
}: RegistrationFormProps) {
  const { t } = useTranslation(NAMESPACES.auth);
  const password = useWatch({ control: form.control, name: 'password' });
  const checks = getPasswordRequirements(password);
  const requirements = (['length', 'uppercase', 'lowercase', 'number', 'special', 'whitespace'] as const).map(
    (key) => ({ label: t(`register.passwordRequirements.${key}`), met: checks[key] })
  );

  return (
    <Box component="form" noValidate onSubmit={onSubmit}>
      <Stack spacing={1.25}>
        {serverError && (
          <Alert severity="error" onClose={onDismissError}>
            {serverError}
          </Alert>
        )}
        <Box sx={{ display: 'grid', gap: 1.25, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                autoComplete="name"
                autoFocus
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
                label={t('register.name')}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <UserRound aria-hidden="true" size={18} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />
          <Controller
            control={form.control}
            name="phone"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                autoComplete="tel"
                dir="ltr"
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
                label={t('register.phone')}
                placeholder="+989121234567"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone aria-hidden="true" size={18} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip arrow title={t('register.phoneHint')}>
                          <IconButton aria-label={t('register.phoneHint')} edge="end" size="small">
                            <CircleHelp aria-hidden="true" size={16} />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />
        </Box>
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              autoComplete="email"
              dir="ltr"
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message}
              label={t('email')}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail aria-hidden="true" size={18} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
        />
        <Box sx={{ display: 'grid', gap: 1.25, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                autoComplete="new-password"
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
                label={t('password')}
                type={passwordVisible ? 'text' : 'password'}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockKeyhole aria-hidden="true" size={18} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton aria-label={t('togglePassword')} edge="end" onClick={onTogglePassword}>
                          {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />
          <Controller
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                autoComplete="new-password"
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
                label={t('register.confirmPassword')}
                type={confirmPasswordVisible ? 'text' : 'password'}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockKeyhole aria-hidden="true" size={18} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={t('register.toggleConfirmPassword')}
                          edge="end"
                          onClick={onToggleConfirmPassword}
                        >
                          {confirmPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />
        </Box>
        <PasswordRequirements requirements={requirements} title={t('register.passwordRequirements.title')} />
        <Controller
          control={form.control}
          name="acceptTerms"
          render={({ field, fieldState }) => (
            <Box>
              <FormControlLabel
                control={<Checkbox checked={field.value} onChange={field.onChange} size="small" />}
                label={<Typography fontSize={12}>{t('register.acceptTerms')}</Typography>}
              />
              {fieldState.error && (
                <Typography color="error" display="block" variant="caption">
                  {fieldState.error.message}
                </Typography>
              )}
            </Box>
          )}
        />
        <Button
          disabled={form.formState.isSubmitting || !form.formState.isValid}
          size="large"
          sx={{ background: 'linear-gradient(110deg, #0e57df, #247aff)', height: 46 }}
          type="submit"
          variant="contained"
        >
          {form.formState.isSubmitting ? (
            <CircularProgress color="inherit" size={22} />
          ) : (
            t('register.submit')
          )}
        </Button>
        <Typography color="text.secondary" fontSize={12} textAlign="center">
          {t('register.hasAccount')}{' '}
          <Link component={RouterLink} to="/login" underline="hover">
            {t('register.signIn')}
          </Link>
        </Typography>
      </Stack>
    </Box>
  );
}
