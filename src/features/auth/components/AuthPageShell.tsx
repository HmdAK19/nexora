import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Globe2 } from 'lucide-react';
import { Box, Paper, Typography } from '@mui/material';

import { BrandLogo } from '@shared/ui';

import { authPageShellStyles as styles } from './AuthPageShell.styles';

interface AuthPageShellProps {
  children: ReactNode;
  compact?: boolean;
  contentWidth?: number;
  subtitle: string;
  title: string;
}

const showcaseMetrics = [
  { label: '350+', sub: 'Trading pairs', x: '74%', y: '37%' },
  { label: '20M+', sub: 'Traders', x: '18%', y: '68%' },
  { label: '99.99%', sub: 'Uptime', x: '20%', y: '20%' },
] as const;

function ExchangeGlobe() {
  return (
    <Box sx={styles.showcase}>
      <Box
        animate={{ rotate: 360 }}
        component={motion.div}
        sx={styles.orbit}
        transition={{ duration: 36, ease: 'linear', repeat: Infinity }}
      />
      <Box sx={styles.globe}>
        <Globe2 aria-hidden="true" color="#1769ff" size={145} strokeWidth={0.8} />
      </Box>
      {showcaseMetrics.map((item, index) => (
        <Paper
          animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
          component={motion.div}
          initial={{ opacity: 0, scale: 0.9 }}
          key={item.label}
          sx={styles.metric(item)}
          transition={{ delay: index * 0.14, duration: 3 + index, repeat: Infinity, repeatDelay: 1 }}
        >
          <Typography color="secondary.main" fontSize={25} fontWeight={800}>
            {item.label}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {item.sub}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}

export function AuthPageShell({
  children,
  compact = false,
  contentWidth = 440,
  subtitle,
  title,
}: AuthPageShellProps) {
  return (
    <Box sx={styles.root(compact)}>
      <Box aria-hidden="true" sx={styles.glow} />
      <Box sx={styles.layout}>
        <Box
          animate={{ opacity: 1, x: 0 }}
          component={motion.div}
          initial={{ opacity: 0, x: -20 }}
          sx={styles.content(compact)}
        >
          <BrandLogo />
          <Typography component="h1" sx={styles.title(compact)}>
            {title}
          </Typography>
          <Typography color="text.secondary" sx={styles.subtitle(compact)}>
            {subtitle}
          </Typography>
          <Box sx={{ maxWidth: contentWidth }}>{children}</Box>
          <Typography color="text.secondary" sx={styles.footer(compact)} variant="caption">
            © 2026 Nexora Exchange · Protected by industry-standard encryption
          </Typography>
        </Box>
        <Box sx={styles.showcaseColumn}>
          <ExchangeGlobe />
        </Box>
      </Box>
    </Box>
  );
}
