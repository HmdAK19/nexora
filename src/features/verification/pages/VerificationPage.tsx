import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { CheckCircle2, FileUp, ShieldCheck } from 'lucide-react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  MenuItem,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';

import { NAMESPACES } from '@app/i18n';
import { PageFeedback, PageHeading, PageLoader } from '@shared/ui';

import { useVerification } from '../hooks';
import { createVerificationProfileSchema } from '../lib';
import type { VerificationProfile } from '../model';
import { styles } from './VerificationPage.styles';

export default function VerificationPage() {
  const { t } = useTranslation(NAMESPACES.verification);
  const verification = useVerification();
  const validationMessages = useMemo(
    () => ({
      fullNameMax: t('validation.fullNameMax', { max: 120 }),
      fullNameMin: t('validation.fullNameMin'),
      fullNameRequired: t('validation.fullNameRequired'),
      nationalIdInvalid: t('validation.nationalIdInvalid'),
      nationalIdRequired: t('validation.nationalIdRequired'),
    }),
    [t]
  );
  const profileSchema = useMemo(
    () => createVerificationProfileSchema(validationMessages),
    [validationMessages]
  );
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<VerificationProfile>({
    defaultValues: { country: 'IR', fullName: '', nationalId: '' },
    mode: 'onBlur',
    resolver: yupResolver(profileSchema),
  });
  const steps = [t('steps.personalDetails'), t('steps.identityDocument'), t('steps.review')];

  useEffect(() => {
    if (!verification.record) return;
    reset({
      country: verification.record.country ?? 'IR',
      fullName: verification.record.fullName ?? '',
      nationalId: '',
    });
  }, [reset, verification.record]);

  if (verification.loading) return <PageLoader />;
  if (verification.error && !verification.record) {
    return (
      <PageFeedback
        type="error"
        title={t('errors.load')}
        actionLabel={t('retry')}
        onAction={() => void verification.retry()}
      />
    );
  }

  return (
    <Box>
      <PageHeading title={t('title')} description={t('description')} />
      <Grid container spacing={2.5}>
        <Grid
          size={{
            xs: 12,
            lg: 8,
          }}
        >
          <Card>
            <CardContent sx={styles.cardContent1}>
              <Stepper activeStep={verification.step} alternativeLabel sx={styles.stepper2}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              {verification.error && <Alert severity="error">{t('errors.request')}</Alert>}
              {verification.step === 0 && (
                <Stack
                  component="form"
                  noValidate
                  spacing={2.25}
                  onSubmit={(event) => void handleSubmit(verification.continueToDocument)(event)}
                >
                  <Typography fontWeight={750} variant="h6">
                    {t('detailsHeading')}
                  </Typography>
                  <Controller
                    name="fullName"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        autoFocus
                        error={Boolean(fieldState.error)}
                        helperText={fieldState.error?.message}
                        label={t('fullName')}
                        fullWidth
                      />
                    )}
                  />
                  <Grid container spacing={2}>
                    <Grid
                      size={{
                        xs: 12,
                        sm: 6,
                      }}
                    >
                      <Controller
                        name="nationalId"
                        control={control}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            error={Boolean(fieldState.error)}
                            helperText={fieldState.error?.message}
                            label={t('nationalId')}
                            fullWidth
                            slotProps={{ htmlInput: { maxLength: 32 } }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        sm: 6,
                      }}
                    >
                      <Controller
                        name="country"
                        control={control}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            error={Boolean(fieldState.error)}
                            helperText={fieldState.error?.message}
                            label={t('country')}
                            select
                            fullWidth
                          >
                            <MenuItem value="IR">{t('countries.iran')}</MenuItem>
                            <MenuItem value="AE">{t('countries.uae')}</MenuItem>
                            <MenuItem value="TR">{t('countries.turkiye')}</MenuItem>
                          </TextField>
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Button
                    variant="contained"
                    disabled={!isValid || verification.pending}
                    type="submit"
                    sx={styles.button3}
                  >
                    {t('continue')}
                  </Button>
                </Stack>
              )}
              {verification.step === 1 && (
                <Stack spacing={2.25}>
                  <Typography fontWeight={750} variant="h6">
                    {t('uploadHeading')}
                  </Typography>
                  <Box sx={styles.box4(Boolean(verification.document || verification.record?.document))}>
                    <FileUp size={34} />
                    <Typography sx={styles.typography5}>
                      {verification.document?.name ||
                        verification.record?.document?.name ||
                        t('documentPlaceholder')}
                    </Typography>
                    <Button component="label" variant="outlined">
                      {t('chooseFile')}
                      <input
                        hidden
                        accept="image/*,.pdf"
                        type="file"
                        onChange={(event) => verification.setDocument(event.target.files?.[0])}
                      />
                    </Button>
                  </Box>
                  <Alert severity="info">{t('documentHint')}</Alert>
                  {verification.documentError && (
                    <Alert severity="error">{t(`errors.document.${verification.documentError}`)}</Alert>
                  )}
                  <Stack direction="row" justifyContent="space-between">
                    <Button disabled={verification.pending} onClick={() => verification.setStep(0)}>
                      {t('back')}
                    </Button>
                    <Button
                      variant="contained"
                      disabled={
                        verification.pending ||
                        Boolean(verification.documentError) ||
                        (!verification.document && !verification.record?.document)
                      }
                      onClick={() => void verification.submitCase()}
                    >
                      {verification.pending ? t('submitting') : t('submit')}
                    </Button>
                  </Stack>
                </Stack>
              )}
              {verification.step === 2 && (
                <Stack alignItems="center" spacing={2} sx={styles.stack6}>
                  <CheckCircle2 color="#20c997" size={58} />
                  <Typography fontWeight={800} variant="h5">
                    {t(verification.record?.status === 'verified' ? 'verifiedTitle' : 'submittedTitle')}
                  </Typography>
                  <Typography color="text.secondary">
                    {t(
                      verification.record?.status === 'verified'
                        ? 'verifiedDescription'
                        : 'submittedDescription'
                    )}
                  </Typography>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 4,
          }}
        >
          <Card>
            <CardContent>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <ShieldCheck size={25} />
                <Box>
                  <Typography fontWeight={750}>{t('accountLevel')}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {t(`levels.${verification.record?.status === 'verified' ? 'verified' : 'basic'}`)}
                  </Typography>
                </Box>
                <Chip
                  color={
                    verification.record?.status === 'verified'
                      ? 'success'
                      : verification.record?.status === 'pending'
                        ? 'info'
                        : 'warning'
                  }
                  label={t(`status.${verification.record?.status ?? 'not_started'}`)}
                  size="small"
                  sx={styles.chip7}
                />
              </Stack>
              <Box sx={styles.box8}>
                <Typography variant="body2" color="text.secondary">
                  {t('dailyWithdrawalLimit')}
                </Typography>
                <Typography fontWeight={800} variant="h5">
                  {verification.record?.status === 'verified' ? '$50,000' : '$2,000'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
