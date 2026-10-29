import type { LucideIcon } from 'lucide-react';
import { Box, Card, CardContent, Typography } from '@mui/material';

import { styles } from '../Admin.styles';

interface AdminMetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export function AdminMetricCard({ icon: Icon, label, value }: AdminMetricCardProps) {
  return (
    <Card sx={styles.fullHeightCard}>
      <CardContent sx={styles.metricContent}>
        <Box sx={styles.metricIcon}>
          <Icon aria-hidden size={21} />
        </Box>
        <Box minWidth={0}>
          <Typography color="text.secondary" variant="body2">
            {label}
          </Typography>
          <Typography fontWeight={850} variant="h5">
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
