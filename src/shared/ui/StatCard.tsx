import type { ReactNode } from 'react';
import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material';

import { statCardStyles } from './StatCard.styles';

interface StatCardProps {
  label: string;
  value?: string;
  helper?: string;
  icon: ReactNode;
  accent?: string;
  loading?: boolean;
}
export function StatCard({ label, value, helper, icon, accent = '#1769ff', loading = false }: StatCardProps) {
  const styles = statCardStyles(accent);
  return (
    <Card sx={styles.card1}>
      <Box sx={styles.box2} />
      <CardContent sx={styles.cardContent3}>
        <Box sx={styles.box4}>
          <Typography color="text.secondary" variant="body2">
            {label}
          </Typography>
          <Box sx={styles.box5}>{icon}</Box>
        </Box>
        {loading ? (
          <Skeleton width="65%" height={38} />
        ) : (
          <Typography sx={styles.typography6}>{value}</Typography>
        )}
        {helper && (
          <Typography color="text.secondary" variant="caption">
            {helper}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
