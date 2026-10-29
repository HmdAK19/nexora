import { useId } from 'react';
import { Box, Typography } from '@mui/material';

import { styles } from './BrandLogo.styles';

interface BrandLogoProps {
  compact?: boolean;
}
export function BrandLogo({ compact = false }: BrandLogoProps) {
  const gradientId = useId();
  const nodeGradientId = useId();

  return (
    <Box aria-label="Nexora" sx={styles.root}>
      <Box aria-hidden="true" component="svg" role="img" sx={styles.mark} viewBox="0 0 48 48">
        <defs>
          <linearGradient id={gradientId} x1="5" x2="43" y1="4" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5a91ff" />
            <stop offset="0.48" stopColor="#1769ff" />
            <stop offset="1" stopColor="#0d47c8" />
          </linearGradient>
          <linearGradient id={nodeGradientId} x1="30" x2="40" y1="28" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#69eee3" />
            <stop offset="1" stopColor="#20d6c7" />
          </linearGradient>
        </defs>
        <rect width="44" height="44" x="2" y="2" fill={`url(#${gradientId})`} rx="14" />
        <path
          d="M14.5 32.5v-17c0-2.2 2.7-3.3 4.2-1.7l14.8 17.4V14.5"
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="5"
        />
        <path
          d="M8.5 14.8A18 18 0 0 1 24 6c7.4 0 13.8 4.5 16.6 10.9"
          fill="none"
          opacity=".25"
          stroke="#fff"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <circle
          cx="33.5"
          cy="31.5"
          r="5.5"
          fill={`url(#${nodeGradientId})`}
          stroke="#0d47c8"
          strokeWidth="2"
        />
        <circle cx="33.5" cy="31.5" r="1.5" fill="#fff" />
      </Box>
      {!compact && (
        <Typography sx={styles.wordmark}>
          Ne
          <Box component="span" sx={styles.wordmarkAccent}>
            x
          </Box>
          ora
        </Typography>
      )}
    </Box>
  );
}
