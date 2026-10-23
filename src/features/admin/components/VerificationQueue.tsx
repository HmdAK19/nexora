import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { Alert, Avatar, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';

import { NAMESPACES } from '@app/i18n';

import type { AdminController } from '../hooks';
import { styles } from '../Admin.styles';

export function VerificationQueue({ controller }: { controller: AdminController }) {
  const { t } = useTranslation(NAMESPACES.admin);

  return (
    <Grid container spacing={2}>
      {controller.reviewResult && (
        <Grid size={12}>
          <Alert severity="success">{t(`review.${controller.reviewResult}`)}</Alert>
        </Grid>
      )}
      {controller.verificationRequests.map(({ user, documentType }) => (
        <Grid key={user.id} size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar>{user.name[0]}</Avatar>
                <div>
                  <Typography fontWeight={800}>{user.name}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {t(`documents.${documentType}`)} · {t('submittedToday')}
                  </Typography>
                </div>
              </Stack>
              <Stack direction="row" spacing={1} sx={styles.stack12}>
                <Button
                  color="success"
                  startIcon={<Check size={16} />}
                  variant="contained"
                  onClick={() => controller.resolveVerification(user.id, 'approved')}
                >
                  {t('approve')}
                </Button>
                <Button
                  color="error"
                  variant="outlined"
                  onClick={() => controller.resolveVerification(user.id, 'rejected')}
                >
                  {t('reject')}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
      {controller.verificationRequests.length === 0 && (
        <Grid size={12}>
          <Alert severity="info">{t('review.empty')}</Alert>
        </Grid>
      )}
    </Grid>
  );
}
