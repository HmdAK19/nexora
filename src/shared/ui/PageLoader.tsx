import { Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { styles } from './PageLoader.styles';

export function PageLoader() {
  const { t } = useTranslation();
  return (
    <Box role="status" sx={styles.box1}>
      <CircularProgress size={34} thickness={4} />
      <Typography color="text.secondary" variant="body2">
        {t('common.loading')}
      </Typography>
    </Box>
  );
}
