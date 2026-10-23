import { Box, Typography } from '@mui/material';

import { styles } from './BrandLogo.styles';

interface BrandLogoProps {
  compact?: boolean;
}
export function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <Box sx={styles.box1} aria-label="Nexora">
      <Box sx={styles.box2} aria-hidden="true">
        <Box sx={styles.box3} />
        <Box sx={styles.box4} />
      </Box>
      {!compact && (
        <Typography sx={styles.typography5}>
          Nexora
          <Typography component="span" color="secondary.main">
            .
          </Typography>
        </Typography>
      )}
    </Box>
  );
}
