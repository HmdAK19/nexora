import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

import { styles } from '../Settings.styles';

interface SettingRowProps {
  control: ReactNode;
  description: string;
  icon: ReactNode;
  title: string;
}

export function SettingRow({ control, description, icon, title }: SettingRowProps) {
  return (
    <Box sx={styles.box12}>
      <Box sx={styles.box13}>{icon}</Box>
      <Box flex={1}>
        <Typography fontWeight={700}>{title}</Typography>
        <Typography color="text.secondary" variant="body2">
          {description}
        </Typography>
      </Box>
      {control}
    </Box>
  );
}
