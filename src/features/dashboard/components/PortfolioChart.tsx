import { Box, Typography } from '@mui/material';

import { Sparkline } from '@shared/ui';

import { styles } from './PortfolioChart.styles';

export function PortfolioChart({ data }: { data: number[] }) {
  return (
    <Box sx={styles.box1}>
      <Box sx={styles.box2}>
        <Typography fontSize={27} fontWeight={800}>
          $48,793.42
        </Typography>
        <Typography color="success.main" fontWeight={700} variant="body2">
          +8.2%
        </Typography>
      </Box>
      <Box sx={styles.box3}>
        <Sparkline data={data} color="#1769ff" height={208} />
      </Box>
      <Box sx={styles.box4}>
        <span>08:00</span>
        <span>12:00</span>
        <span>16:00</span>
        <span>20:00</span>
      </Box>
    </Box>
  );
}
