import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { Badge, Box, Button, Divider, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';

import { useLocalStorageState } from '@shared/hooks';
import { NAMESPACES } from '@app/i18n';

import { styles } from './NotificationMenu.styles';

const notifications = [
  {
    id: 'kyc',
    titleKey: 'notifications.kycTitle',
    bodyKey: 'notifications.kycBody',
    path: '/verification',
  },
  {
    id: 'order',
    titleKey: 'notifications.orderTitle',
    bodyKey: 'notifications.orderBody',
    path: '/orders',
  },
  {
    id: 'security',
    titleKey: 'notifications.securityTitle',
    bodyKey: 'notifications.securityBody',
    path: '/settings',
  },
];
export function NotificationMenu() {
  const { t } = useTranslation(NAMESPACES.layout);
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [readIds, setReadIds] = useLocalStorageState<string[]>('nexora-read-notifications', []);
  const unread = useMemo(() => notifications.filter((item) => !readIds.includes(item.id)).length, [readIds]);
  const persistRead = (ids: string[]) => setReadIds(ids);
  const openNotification = (id: string, path: string) => {
    persistRead(Array.from(new Set([...readIds, id])));
    setAnchor(null);
    navigate(path);
  };
  return (
    <>
      <Tooltip title={t('notifications.title')}>
        <IconButton
          aria-label={t('notifications.title')}
          aria-haspopup="menu"
          onClick={(event) => setAnchor(event.currentTarget)}
        >
          <Badge badgeContent={unread} color="error">
            <Bell size={19} />
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        slotProps={{
          paper: {
            sx: styles.menuPaper,
          },
        }}
      >
        <Box sx={styles.header}>
          <Typography fontWeight={800}>{t('notifications.title')}</Typography>
          <Button
            disabled={unread === 0}
            onClick={() => persistRead(notifications.map(({ id }) => id))}
            size="small"
          >
            {t('notifications.markAllRead')}
          </Button>
        </Box>
        <Divider />
        {notifications.map((item) => {
          const isRead = readIds.includes(item.id);
          return (
            <MenuItem key={item.id} onClick={() => openNotification(item.id, item.path)} sx={styles.item}>
              <Box sx={isRead ? styles.readDot : styles.unreadDot} />
              <Box sx={styles.itemText}>
                <Typography fontWeight={isRead ? 600 : 800} variant="body2">
                  {t(item.titleKey)}
                </Typography>
                <Typography color="text.secondary" variant="caption">
                  {t(item.bodyKey)}
                </Typography>
              </Box>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
