import type { ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';

import { detailRowStyles } from './DetailRow.styles';

interface DetailRowProps {
  emphasize?: boolean;
  label: ReactNode;
  value: ReactNode;
}

export function DetailRow({ emphasize = false, label, value }: DetailRowProps) {
  return (
    <Stack sx={detailRowStyles.root}>
      <Typography color={emphasize ? 'text.primary' : 'text.secondary'} fontWeight={emphasize ? 700 : 400}>
        {label}
      </Typography>
      <Typography fontWeight={emphasize ? 800 : 400} sx={detailRowStyles.value}>
        {value}
      </Typography>
    </Stack>
  );
}
