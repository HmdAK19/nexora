import { Box, Typography } from '@mui/material';

import { styles } from './PageHeading.styles';

interface PageHeadingProps {
  description: string;
  title: string;
}
export function PageHeading({ description, title }: PageHeadingProps) {
  return (
    <Box sx={styles.box1}>
      <Typography component="h1" fontWeight={800} variant="h4">
        {title}
      </Typography>
      <Typography color="text.secondary" sx={styles.typography2}>
        {description}
      </Typography>
    </Box>
  );
}
