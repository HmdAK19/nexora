import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Gift, Users } from 'lucide-react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';

import { PageHeading } from '@shared/ui';
import { NAMESPACES } from '@app/i18n';

import { styles } from './ReferralsPage.styles';

export default function ReferralsPage() {
  const { t } = useTranslation(NAMESPACES.referrals);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText('NEXORA-HAMED-20');
    setCopied(true);
  };
  return (
    <Box>
      <PageHeading title={t('title')} description={t('description')} />
      <Grid container spacing={2.5}>
        <Grid
          size={{
            xs: 12,
            md: 8,
          }}
        >
          <Card>
            <CardContent sx={styles.cardContent1}>
              <Gift size={32} />
              <Typography fontWeight={850} variant="h5" sx={styles.typography2}>
                {t('reward')}
              </Typography>
              <Typography color="text.secondary">{t('shareHint')}</Typography>
              <TextField
                fullWidth
                value="NEXORA-HAMED-20"
                sx={styles.textField3}
                slotProps={{
                  input: {
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button startIcon={<Copy size={16} />} onClick={() => void copy()}>
                          {t('copy')}
                        </Button>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              {copied && (
                <Alert severity="success" sx={styles.alert4}>
                  {t('copied')}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <Card>
            <CardContent>
              <Users size={28} />
              <Typography color="text.secondary" sx={styles.typography5}>
                {t('friends')}
              </Typography>
              <Typography fontWeight={850} variant="h3">
                12
              </Typography>
              <Typography color="success.main" fontWeight={750}>
                +$184.20 USDT
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
