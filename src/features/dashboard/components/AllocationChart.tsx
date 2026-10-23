import { Box, Stack, Typography } from '@mui/material';

import type { DashboardData } from '@shared/model';

import { allocationChartStyles } from './AllocationChart.styles';

export function AllocationChart({ data }: { data: DashboardData['allocation'] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let accumulated = 0;
  const gradient = data
    .map((item) => {
      const start = (accumulated / total) * 100;
      accumulated += item.value;
      const end = (accumulated / total) * 100;
      return `${item.color} ${start}% ${end}%`;
    })
    .join(', ');
  const styles = allocationChartStyles(gradient);
  return (
    <Box sx={styles.box1}>
      <Box sx={styles.box2}>
        <Box sx={styles.box3}>
          <span>
            <Typography fontSize={18} fontWeight={800}>
              {data.length}
            </Typography>
            <Typography color="text.secondary" variant="caption">
              Assets
            </Typography>
          </span>
        </Box>
      </Box>
      <Stack spacing={1.2} sx={styles.stack4}>
        {data.map((item) => (
          <Box key={item.symbol} sx={styles.box5}>
            <Box sx={styles.box6(item.color)} />
            <Typography flex={1} variant="body2">
              {item.symbol}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {Math.round((item.value / total) * 100)}%
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
