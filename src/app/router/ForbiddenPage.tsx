import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';

import { NAMESPACES } from '@app/i18n';

export function ForbiddenPage() {
  const { t } = useTranslation(NAMESPACES.common);
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'grid', minHeight: '60vh', placeItems: 'center' }}>
      <Card sx={{ maxWidth: 480, textAlign: 'center' }}>
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          <Stack alignItems="center" spacing={2}>
            <LockKeyhole aria-hidden size={42} />
            <Typography component="h1" fontWeight={800} variant="h5">
              {t('forbidden.title')}
            </Typography>
            <Typography color="text.secondary">{t('forbidden.description')}</Typography>
            <Button onClick={() => navigate('/')} variant="contained">
              {t('forbidden.backToDashboard')}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
