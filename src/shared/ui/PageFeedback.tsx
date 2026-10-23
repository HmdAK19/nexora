import { AlertTriangle, Inbox } from 'lucide-react';
import { Box, Button, Typography } from '@mui/material';

import { pageFeedbackStyles } from './PageFeedback.styles';

interface PageFeedbackProps {
  type?: 'empty' | 'error';
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}
export function PageFeedback({
  type = 'empty',
  title,
  description,
  actionLabel,
  onAction,
}: PageFeedbackProps) {
  const styles = pageFeedbackStyles(type);
  const Icon = type === 'error' ? AlertTriangle : Inbox;
  return (
    <Box role={type === 'error' ? 'alert' : 'status'} sx={styles.box1}>
      <Box sx={styles.box2}>
        <Icon size={28} />
      </Box>
      <Typography variant="h3">{title}</Typography>
      {description && (
        <Typography color="text.secondary" sx={styles.typography3}>
          {description}
        </Typography>
      )}
      {actionLabel && onAction && <Button onClick={onAction}>{actionLabel}</Button>}
    </Box>
  );
}
