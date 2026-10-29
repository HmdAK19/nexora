import { alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

const sidebarWidth = 216;
const appHeaderHeight = { xs: 68, md: 80 } as const;
export const styles = {
  listItemButton1: (theme: Theme) => ({
    border: '1px solid transparent',
    borderRadius: 2,
    color: 'text.secondary',
    minHeight: 34,
    px: 0.75,
    py: 0.25,
    transition: theme.transitions.create(['background-color', 'border-color', 'color'], {
      duration: theme.transitions.duration.shortest,
    }),
    '& .nav-icon': {
      transition: theme.transitions.create(['background-color', 'color', 'transform'], {
        duration: theme.transitions.duration.shortest,
      }),
    },
    '&:hover': {
      bgcolor: alpha(theme.palette.text.primary, 0.045),
      color: 'text.primary',
      '& .nav-icon': {
        bgcolor: alpha(theme.palette.text.primary, 0.07),
      },
    },
    '&.active': {
      bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.13 : 0.09),
      borderColor: alpha(theme.palette.primary.main, 0.18),
      color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
      '& .nav-icon': {
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        transform: 'scale(1.03)',
      },
      '&::after': {
        bgcolor: 'primary.main',
        borderRadius: '50%',
        content: '""',
        height: 4,
        insetInlineEnd: 8,
        position: 'absolute',
        width: 4,
      },
    },
    '&.Mui-focusVisible': {
      outline: `2px solid ${alpha(theme.palette.primary.main, 0.65)}`,
      outlineOffset: 1,
    },
  }),
  listItemIcon2: {
    color: 'inherit',
    minWidth: 34,
  },
  box3: {
    alignItems: 'center',
    bgcolor: (theme: Theme) => alpha(theme.palette.text.primary, 0.035),
    borderRadius: 1.5,
    color: 'inherit',
    display: 'flex',
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  listItemText4: {
    m: 0,
  },
  box5: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    minHeight: 0,
  },
  typography6: {
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: '.12em',
    px: 2,
    py: 1,
    textTransform: 'uppercase',
  },
  list7: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0.25,
    overflowY: 'auto',
    px: 1.25,
  },
  box8: {
    flex: 1,
  },
  box9: {
    borderTop: '1px solid',
    borderColor: 'divider',
    mx: 1.25,
    pt: 0.75,
  },
  box10: (activeTheme: Theme) => ({
    background: `linear-gradient(180deg, ${alpha(activeTheme.palette.primary.main, activeTheme.palette.mode === 'dark' ? 0.065 : 0.04)} 0, transparent 180px), ${activeTheme.palette.background.paper}`,
    borderInlineEnd: '1px solid',
    borderColor: 'divider',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  }),
  box11: {
    alignItems: 'center',
    borderBottom: '1px solid',
    borderColor: 'divider',
    display: 'flex',
    gap: 1.5,
    height: appHeaderHeight,
    justifyContent: 'space-between',
    px: 2,
  },
  box12: {
    px: 1.25,
    py: 1.25,
  },
  box13: (activeTheme: Theme) => ({
    alignItems: 'center',
    bgcolor: alpha(activeTheme.palette.primary.main, activeTheme.palette.mode === 'dark' ? 0.08 : 0.055),
    border: '1px solid',
    borderColor: alpha(activeTheme.palette.primary.main, 0.14),
    borderRadius: 2,
    display: 'flex',
    gap: 1,
    p: 1.1,
  }),
  box14: {
    alignItems: 'center',
    bgcolor: 'primary.main',
    borderRadius: 1.5,
    color: 'primary.contrastText',
    display: 'flex',
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  box15: {
    minWidth: 0,
  },
  typography16: {
    mt: 0.25,
  },
  drawer17: {
    '& .MuiDrawer-paper': {
      border: 0,
      width: sidebarWidth,
    },
  },
  mobileDrawer: (width: number) => ({
    '& .MuiDrawer-paper': {
      width,
    },
  }),
  box18: {
    display: 'flex',
    minHeight: '100vh',
  },
  box19: {
    flex: 1,
    minWidth: 0,
    marginInlineStart: {
      md: `${sidebarWidth}px`,
    },
  },
  appBar20: (activeTheme: Theme) => ({
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    bgcolor:
      activeTheme.palette.mode === 'dark'
        ? alpha(activeTheme.palette.background.default, 0.8)
        : alpha(activeTheme.palette.background.paper, 0.9),
    borderBottom: '1px solid',
    borderColor:
      activeTheme.palette.mode === 'dark'
        ? activeTheme.palette.divider
        : alpha(activeTheme.palette.primary.main, 0.1),
    boxShadow:
      activeTheme.palette.mode === 'dark'
        ? 'none'
        : `0 8px 28px ${alpha(activeTheme.palette.common.black, 0.055)}`,
    color: 'text.primary',
    zIndex: 10,
  }),
  toolbar21: (activeTheme: Theme) => ({
    gap: 1.5,
    minHeight: appHeaderHeight,
    '& .MuiIconButton-root': {
      border: '1px solid transparent',
      color: 'text.secondary',
      transition: activeTheme.transitions.create(['background-color', 'border-color', 'color'], {
        duration: activeTheme.transitions.duration.shortest,
      }),
      '&:hover': {
        bgcolor: alpha(activeTheme.palette.primary.main, activeTheme.palette.mode === 'dark' ? 0.12 : 0.07),
        borderColor: alpha(
          activeTheme.palette.primary.main,
          activeTheme.palette.mode === 'dark' ? 0.16 : 0.1
        ),
        color:
          activeTheme.palette.mode === 'dark'
            ? activeTheme.palette.primary.light
            : activeTheme.palette.primary.dark,
      },
    },
    '& .MuiOutlinedInput-root': {
      bgcolor:
        activeTheme.palette.mode === 'dark'
          ? alpha(activeTheme.palette.common.white, 0.025)
          : alpha(activeTheme.palette.background.default, 0.72),
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: alpha(activeTheme.palette.primary.main, 0.32),
      },
      '&.Mui-focused': {
        bgcolor: 'background.paper',
      },
    },
  }),
  iconButton22: {
    display: {
      md: 'none',
    },
  },
  textField23: {
    display: {
      xs: 'none',
      sm: 'block',
    },
    marginInlineEnd: 'auto',
    maxWidth: 320,
    width: '36%',
  },
  box24: {
    marginInlineStart: {
      xs: 'auto',
      sm: 0,
    },
  },
  iconButton25: {
    position: 'relative',
  },
  box26: {
    bgcolor: 'error.main',
    border: '2px solid',
    borderColor: 'background.default',
    borderRadius: '50%',
    height: 8,
    position: 'absolute',
    insetInlineEnd: 8,
    top: 8,
    width: 8,
  },
  box30: {
    p: {
      xs: 2,
      sm: 2.5,
      lg: 2,
      xl: 3,
    },
    pb: 10,
  },
};
