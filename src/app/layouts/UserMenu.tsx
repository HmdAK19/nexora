import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, LogOut } from 'lucide-react';
import { Avatar, Box, Divider, Menu, MenuItem, Typography, useTheme } from '@mui/material';

import { NAMESPACES } from '@app/i18n';
import type { User } from '@shared/model';

import { userMenuStyles as styles } from './UserMenu.styles';

interface UserMenuProps {
  onSignOut: () => void | Promise<void>;
  user: User;
}

export function UserMenu({ onSignOut, user }: UserMenuProps) {
  const { t } = useTranslation(NAMESPACES.layout);
  const theme = useTheme();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const menuId = useId();
  const open = Boolean(anchor);
  const initial = user.name.trim().charAt(0).toLocaleUpperCase() || user.email.charAt(0).toLocaleUpperCase();

  const close = () => setAnchor(null);

  const runAndClose = (action: () => void | Promise<void>) => {
    close();
    void action();
  };

  return (
    <>
      <Box
        aria-controls={open ? menuId : undefined}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t('userMenu.open')}
        component="button"
        onClick={(event) => setAnchor(event.currentTarget)}
        sx={styles.trigger}
        type="button"
      >
        <Avatar aria-hidden="true" sx={styles.triggerAvatar}>
          {initial}
        </Avatar>
        <Typography fontWeight={700} sx={styles.triggerName} variant="body2">
          {user.name}
        </Typography>
        <Box aria-hidden="true" component={ChevronDown} size={15} sx={styles.chevron(open)} />
      </Box>

      <Menu
        anchorEl={anchor}
        anchorOrigin={{ horizontal: theme.direction === 'rtl' ? 'left' : 'right', vertical: 'bottom' }}
        id={menuId}
        onClose={close}
        open={open}
        slotProps={{ paper: { elevation: 0, sx: styles.menuPaper } }}
        transformOrigin={{ horizontal: theme.direction === 'rtl' ? 'left' : 'right', vertical: 'top' }}
      >
        <Box sx={styles.identity}>
          <Avatar aria-hidden="true" sx={styles.identityAvatar}>
            {initial}
          </Avatar>
          <Box sx={styles.identityCopy}>
            <Typography fontWeight={750} sx={styles.name} variant="body2">
              {user.name}
            </Typography>
            <Typography color="text.secondary" dir="ltr" fontSize={11.5} sx={styles.email}>
              {user.email}
            </Typography>
          </Box>
        </Box>

        <Divider sx={styles.divider} />
        <Box sx={styles.dangerSection}>
          <MenuItem onClick={() => runAndClose(onSignOut)} sx={styles.dangerItem}>
            <Box aria-hidden="true" sx={styles.dangerIcon}>
              <LogOut size={17} />
            </Box>
            <Box sx={styles.itemCopy}>
              <Typography fontSize={13} fontWeight={750}>
                {t('signOut')}
              </Typography>
              <Typography color="text.secondary" fontSize={11} sx={styles.itemDescription}>
                {t('userMenu.signOutDescription')}
              </Typography>
            </Box>
          </MenuItem>
        </Box>
      </Menu>
    </>
  );
}
