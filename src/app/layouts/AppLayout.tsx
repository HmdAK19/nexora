import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3,
  BadgeDollarSign,
  BadgeCheck,
  ChevronDown,
  ClipboardList,
  CreditCard,
  Gift,
  Headphones,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  PanelsTopLeft,
  Settings,
  ShoppingBag,
  ShieldCheck,
  Repeat2,
  Sun,
  WalletCards,
  X,
  type LucideIcon,
} from 'lucide-react';
import {
  AppBar,
  Avatar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu as MuiMenu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { useAuth, useAuthorization } from '@features/auth';
import { NAMESPACES } from '@app/i18n';
import { useLanguage } from '@shared/hooks';
import { ADMIN_ENTRY_PERMISSIONS, PERMISSIONS } from '@shared/lib';
import type { Permission } from '@shared/model';
import { BrandLogo } from '@shared/ui';

import { toggleColorMode, useAppDispatch, useAppSelector } from '../store';
import { GlobalSearch } from './GlobalSearch';
import { NotificationMenu } from './NotificationMenu';
import { styles } from './AppLayout.styles';

interface NavigationItemProps {
  icon: LucideIcon;
  label: string;
  onNavigate?: () => void;
  path: string;
}

interface NavigationEntry extends NavigationItemProps {
  permissions?: readonly Permission[];
}
function NavigationItem({ icon: Icon, label, onNavigate, path }: NavigationItemProps) {
  return (
    <ListItemButton
      component={NavLink}
      end={path === '/'}
      onClick={onNavigate}
      to={path}
      sx={styles.listItemButton1}
    >
      <ListItemIcon sx={styles.listItemIcon2}>
        <Box className="nav-icon" sx={styles.box3}>
          <Icon size={15.5} strokeWidth={1.9} />
        </Box>
      </ListItemIcon>
      <ListItemText
        primary={label}
        primaryTypographyProps={{
          fontSize: 12.75,
          fontWeight: 650,
          lineHeight: 1.3,
        }}
        sx={styles.listItemText4}
      />
    </ListItemButton>
  );
}
function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation();
  const { canSome } = useAuthorization();
  const items = useMemo<NavigationEntry[]>(
    () => [
      {
        label: t('nav.dashboard'),
        path: '/',
        icon: LayoutDashboard,
        permissions: [PERMISSIONS.dashboard],
      },
      {
        label: t('nav.markets'),
        path: '/markets',
        icon: BarChart3,
        permissions: [PERMISSIONS.markets],
      },
      {
        label: t('nav.trade'),
        path: '/trade/BTC-USDT',
        icon: ShoppingBag,
        permissions: [PERMISSIONS.orders],
      },
      {
        label: t('nav.wallet'),
        path: '/wallet',
        icon: WalletCards,
        permissions: [PERMISSIONS.wallet],
      },
      {
        label: t('nav.orders'),
        path: '/orders',
        icon: ClipboardList,
        permissions: [PERMISSIONS.orders],
      },
      {
        label: t('nav.buy'),
        path: '/buy-crypto',
        icon: BadgeDollarSign,
        permissions: [PERMISSIONS.purchase],
      },
      {
        label: t('nav.convert'),
        path: '/convert',
        icon: Repeat2,
        permissions: [PERMISSIONS.convert],
      },
      {
        label: t('nav.verification'),
        path: '/verification',
        icon: BadgeCheck,
        permissions: [PERMISSIONS.verification],
      },
      {
        label: t('nav.cards'),
        path: '/cards',
        icon: CreditCard,
        permissions: [PERMISSIONS.cards],
      },
      {
        label: t('nav.referrals'),
        path: '/referrals',
        icon: Gift,
        permissions: [PERMISSIONS.referrals],
      },
      {
        label: t('nav.support'),
        path: '/support',
        icon: Headphones,
        permissions: [PERMISSIONS.support],
      },
      {
        label: t('nav.admin'),
        path: '/admin',
        icon: PanelsTopLeft,
        permissions: ADMIN_ENTRY_PERMISSIONS,
      },
    ],
    [t]
  );
  return (
    <Box component="nav" aria-label="Main navigation" sx={styles.box5}>
      <Typography color="text.secondary" sx={styles.typography6}>
        {t('nav.menu')}
      </Typography>
      <List disablePadding sx={styles.list7}>
        {items
          .filter((item) => !item.permissions || canSome(item.permissions))
          .map((item) => (
            <NavigationItem key={item.path} {...item} onNavigate={onNavigate} />
          ))}
      </List>
      <Box sx={styles.box8} />
      <Box sx={styles.box9}>
        <NavigationItem icon={Settings} label={t('nav.settings')} onNavigate={onNavigate} path="/settings" />
      </Box>
    </Box>
  );
}
function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('md'));
  const anchor = theme.direction === 'rtl' ? 'right' : 'left';
  const content = (
    <Box sx={styles.box10}>
      <Box sx={styles.box11}>
        <BrandLogo />
        {mobile && (
          <IconButton aria-label="Close menu" onClick={onClose} size="small">
            <X size={18} />
          </IconButton>
        )}
      </Box>
      <Navigation onNavigate={mobile ? onClose : undefined} />
      <Box sx={styles.box12}>
        <Box sx={styles.box13}>
          <Box sx={styles.box14}>
            <ShieldCheck size={15} />
          </Box>
          <Box sx={styles.box15}>
            <Typography fontSize={12.5} fontWeight={750} lineHeight={1.2}>
              Nexora Pro
            </Typography>
            <Typography color="text.secondary" fontSize={10.5} sx={styles.typography16}>
              {t('nav.tradingFee')}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
  if (!mobile)
    return (
      <Drawer anchor={anchor} variant="permanent" sx={styles.drawer17}>
        {content}
      </Drawer>
    );
  return (
    <Drawer
      anchor={anchor}
      open={mobileOpen}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={styles.mobileDrawer(Math.min(248, window.innerWidth * 0.82))}
    >
      {content}
    </Drawer>
  );
}
export function AppLayout() {
  const { t } = useTranslation(NAMESPACES.layout);
  const { toggleLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.preferences.colorMode);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const handleLogout = async () => {
    await logout();
    navigate('/login', {
      replace: true,
    });
  };
  return (
    <Box sx={styles.box18}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box sx={styles.box19(theme.direction)}>
        <AppBar color="transparent" elevation={0} position="sticky" sx={styles.appBar20}>
          <Toolbar sx={styles.toolbar21}>
            <IconButton aria-label="Open menu" onClick={() => setMobileOpen(true)} sx={styles.iconButton22}>
              <Menu size={21} />
            </IconButton>
            <GlobalSearch />
            <Box sx={styles.box24} />
            <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
              <IconButton aria-label="Toggle color mode" onClick={() => dispatch(toggleColorMode())}>
                {mode === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
              </IconButton>
            </Tooltip>
            <NotificationMenu />
            <Box component="button" onClick={(event) => setAnchor(event.currentTarget)} sx={styles.box27}>
              <Avatar sx={styles.avatar28}>{user?.name.slice(0, 1)}</Avatar>
              <Typography fontWeight={700} sx={styles.typography29} variant="body2">
                {user?.name}
              </Typography>
              <ChevronDown size={15} />
            </Box>
            <MuiMenu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
              <MenuItem
                onClick={() => {
                  void toggleLanguage();
                  setAnchor(null);
                }}
              >
                {t('languageSwitch')}
              </MenuItem>
              <MenuItem onClick={() => void handleLogout()}>
                <LogOut size={17} style={styles.logoutIcon} />
                {t('signOut')}
              </MenuItem>
            </MuiMenu>
          </Toolbar>
        </AppBar>
        <Box
          component={motion.main}
          key={location.pathname}
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.22,
          }}
          sx={styles.box30}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
