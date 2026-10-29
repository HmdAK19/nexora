import { useEffect, useMemo, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Globe2, LockKeyhole, Mail } from 'lucide-react';
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
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { getApiErrorMessage } from '@shared/api';
import { getDefaultAuthorizedPath } from '@shared/lib';
import { BrandLogo } from '@shared/ui';
import { NAMESPACES } from '@app/i18n';

import { ForgotPasswordDialog } from '../components';
import { useAuth } from '../context';
import { usePasswordReset } from '../hooks';

import { styles } from './LoginPage.styles';

interface LoginValues {
  email: string;
  password: string;
  remember: boolean;
}
const createSchema = (t: (key: string) => string) =>
  yup.object({
    email: yup.string().email(t('validation.emailInvalid')).required(t('validation.emailRequired')),
    password: yup.string().min(8, t('validation.passwordMin')).required(t('validation.passwordRequired')),
    remember: yup.boolean().required(),
  });
function ExchangeGlobe() {
  return (
    <Box sx={styles.box1}>
      <Box
        component={motion.div}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 36,
          ease: 'linear',
          repeat: Infinity,
        }}
        sx={styles.box2}
      />
      <Box sx={styles.box3}>
        <Globe2 color="#1769ff" size={145} strokeWidth={0.8} />
      </Box>
      {[
        {
          label: '350+',
          sub: 'Trading pairs',
          x: '74%',
          y: '37%',
        },
        {
          label: '20M+',
          sub: 'Traders',
          x: '18%',
          y: '68%',
        },
        {
          label: '99.99%',
          sub: 'Uptime',
          x: '20%',
          y: '20%',
        },
      ].map((item, index) => (
        <Paper
          key={item.label}
          component={motion.div}
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -8, 0],
          }}
          transition={{
            delay: index * 0.14,
            duration: 3 + index,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          sx={styles.paper4(item)}
        >
          <Typography color="secondary.main" fontSize={25} fontWeight={800}>
            {item.label}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {item.sub}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}
export default function LoginPage() {
  const { t } = useTranslation(NAMESPACES.auth);
  const { user, isRestoring, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const passwordReset = usePasswordReset();
  const schema = useMemo(() => createSchema(t), [t]);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    defaultValues: {
      email: '',
      password: '',
      remember: true,
    },
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
      setError(getApiErrorMessage(loginError));
    }
  };
  const fillDemo = () => {
    setValue('email', 'demo@nexora.dev', {
      shouldValidate: true,
    });
    setValue('password', 'Nexora123!', {
      shouldValidate: true,
    });
  };

  return (
    <Box sx={styles.box5}>
      <Box sx={styles.box6} />
      <Box sx={styles.box7}>
        <Box
          component={motion.div}
          initial={{
            opacity: 0,
            x: -20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          sx={styles.box8}
        >
          <BrandLogo />
          <Typography component="h1" sx={styles.typography9}>
            {t('welcome')}
          </Typography>
          <Typography color="text.secondary" sx={styles.typography10}>
            {t('subtitle')}
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={(event) => void handleSubmit(onSubmit)(event)}
            sx={styles.box11}
          >
            <Stack spacing={2.2}>
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
              <Box sx={styles.box12}>
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
                disabled={isSubmitting}
                size="large"
                type="submit"
                variant="contained"
                sx={styles.button13}
              >
                {isSubmitting ? <CircularProgress color="inherit" size={22} /> : t('login')}
              </Button>
              <Button onClick={fillDemo} type="button" variant="outlined">
                {t('demo')} · demo@nexora.dev
              </Button>
            </Stack>
          </Box>
          <Typography color="text.secondary" sx={styles.typography14} variant="caption">
            © 2026 Nexora Exchange · Protected by industry-standard encryption
          </Typography>
        </Box>
        <Box sx={styles.box15}>
          <ExchangeGlobe />
        </Box>
      </Box>
      <ForgotPasswordDialog controller={passwordReset} />
    </Box>
  );
}
