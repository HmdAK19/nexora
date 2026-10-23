import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { PageHeading } from '@shared/ui';

import { styles } from './VerificationPage.styles';

export default function VerificationPage() {
  const { t } = useTranslation(NAMESPACES.verification);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [country, setCountry] = useState('IR');
  const [documentName, setDocumentName] = useState('');
  const validProfile = name.trim().length > 2 && nationalId.trim().length >= 8;
  const steps = [t('steps.personalDetails'), t('steps.identityDocument'), t('steps.review')];

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
              <Stepper activeStep={step} alternativeLabel sx={styles.stepper2}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              {step === 0 && (
                <Stack spacing={2.25}>
                  <Typography fontWeight={750} variant="h6">
                    {t('detailsHeading')}
                  </Typography>
                  <TextField
                    label={t('fullName')}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    fullWidth
                  />
                  <Grid container spacing={2}>
                    <Grid
                      size={{
                        xs: 12,
                        sm: 6,
                      }}
                    >
                      <TextField
                        label={t('nationalId')}
                        value={nationalId}
                        onChange={(event) => setNationalId(event.target.value)}
                        fullWidth
                      />
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        sm: 6,
                      }}
                    >
                      <TextField
                        label={t('country')}
                        select
                        value={country}
                        onChange={(event) => setCountry(event.target.value)}
                        fullWidth
                      >
                        <MenuItem value="IR">{t('countries.iran')}</MenuItem>
                        <MenuItem value="AE">{t('countries.uae')}</MenuItem>
                        <MenuItem value="TR">{t('countries.turkiye')}</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                  <Button
                    variant="contained"
                    disabled={!validProfile}
                    onClick={() => setStep(1)}
                    sx={styles.button3}
                  >
                    {t('continue')}
                  </Button>
                </Stack>
              )}
              {step === 1 && (
                <Stack spacing={2.25}>
                  <Typography fontWeight={750} variant="h6">
                    {t('uploadHeading')}
                  </Typography>
                  <Box sx={styles.box4(Boolean(documentName))}>
                    <FileUp size={34} />
                    <Typography sx={styles.typography5}>
                      {documentName || t('documentPlaceholder')}
                    </Typography>
                    <Button component="label" variant="outlined">
                      {t('chooseFile')}
                      <input
                        hidden
                        accept="image/*,.pdf"
                        type="file"
                        onChange={(event) => setDocumentName(event.target.files?.[0]?.name ?? '')}
                      />
                    </Button>
                  </Box>
                  <Alert severity="info">{t('documentHint')}</Alert>
                  <Stack direction="row" justifyContent="space-between">
                    <Button onClick={() => setStep(0)}>{t('back')}</Button>
                    <Button variant="contained" disabled={!documentName} onClick={() => setStep(2)}>
                      {t('submit')}
                    </Button>
                  </Stack>
                </Stack>
              )}
              {step === 2 && (
                <Stack alignItems="center" spacing={2} sx={styles.stack6}>
                  <CheckCircle2 color="#20c997" size={58} />
                  <Typography fontWeight={800} variant="h5">
                    {t('submittedTitle')}
                  </Typography>
                  <Typography color="text.secondary">{t('submittedDescription')}</Typography>
                  <Button variant="outlined" onClick={() => setStep(0)}>
                    {t('reviewDetails')}
                  </Button>
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
                    {t('basic')}
                  </Typography>
                </Box>
                <Chip color="warning" label={t('incomplete')} size="small" sx={styles.chip7} />
              </Stack>
              <Box sx={styles.box8}>
                <Typography variant="body2" color="text.secondary">
                  {t('dailyWithdrawalLimit')}
                </Typography>
                <Typography fontWeight={800} variant="h5">
                  $2,000
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
