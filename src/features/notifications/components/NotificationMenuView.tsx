import { Bell } from 'lucide-react';
import {
  Alert,
  Badge,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';

import type { AccountNotification } from '../model';
import { styles } from './NotificationMenu.styles';

interface NotificationMenuViewProps {
  anchor: HTMLElement | null;
  emptyLabel: string;
  error: boolean;
  errorLabel: string;
  items: AccountNotification[];
  loading: boolean;
  markAllLabel: string;
  onClose: () => void;
  onMarkAllRead: () => void;
  onOpen: (anchor: HTMLElement) => void;
  onOpenNotification: (notification: AccountNotification) => void;
  onRetry: () => void;
  renderNotification: (notification: AccountNotification) => {
    body: string;
    time: string;
    title: string;
  };
  retryLabel: string;
  title: string;
  unreadCount: number;
  updating: boolean;
}

export function NotificationMenuView(props: NotificationMenuViewProps) {
  return (
    <>
      <Tooltip title={props.title}>
        <IconButton
          aria-label={props.title}
          aria-haspopup="menu"
          onClick={(event) => props.onOpen(event.currentTarget)}
        >
          <Badge badgeContent={props.unreadCount} color="error" max={99}>
            <Bell aria-hidden size={19} />
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={props.anchor}
        open={Boolean(props.anchor)}
        onClose={props.onClose}
        slotProps={{ paper: { sx: styles.menuPaper } }}
      >
        <Box sx={styles.header}>
          <Typography fontWeight={800}>{props.title}</Typography>
          <Button
            disabled={props.unreadCount === 0 || props.updating}
            onClick={props.onMarkAllRead}
            size="small"
          >
            {props.markAllLabel}
          </Button>
        </Box>
        <Divider />
        {props.loading ? (
          <Box sx={styles.feedback} textAlign="center">
            <CircularProgress aria-label={props.title} size={26} />
          </Box>
        ) : props.error ? (
          <Box sx={styles.feedback}>
            <Alert action={<Button onClick={props.onRetry}>{props.retryLabel}</Button>} severity="error">
              {props.errorLabel}
            </Alert>
          </Box>
        ) : props.items.length === 0 ? (
          <Typography color="text.secondary" sx={styles.feedback} textAlign="center">
            {props.emptyLabel}
          </Typography>
        ) : (
          props.items.map((item) => {
            const content = props.renderNotification(item);
            return (
              <MenuItem key={item.id} onClick={() => props.onOpenNotification(item)} sx={styles.item}>
                <Box sx={item.readAt ? styles.readDot : styles.unreadDot} />
                <Box sx={styles.itemText}>
                  <Typography fontWeight={item.readAt ? 600 : 800} variant="body2">
                    {content.title}
                  </Typography>
                  <Typography color="text.secondary" variant="caption">
                    {content.body}
                  </Typography>
                  <Typography color="text.disabled" sx={styles.time} variant="caption">
                    {content.time}
                  </Typography>
                </Box>
              </MenuItem>
            );
          })
        )}
      </Menu>
    </>
  );
}
