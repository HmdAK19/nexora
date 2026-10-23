import { alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

export const styles = {
  iconButton1: (active = false) => ({
    bgcolor: active ? 'primary.main' : 'transparent',
    borderRadius: 1.25,
    color: active ? 'primary.contrastText' : 'text.secondary',
    height: 30,
    width: 30,
    '&:hover': {
      bgcolor: active ? 'primary.dark' : 'action.hover',
      color: active ? 'primary.contrastText' : 'text.primary',
    },
  }),
  box2: {
    bgcolor: 'background.paper',
    display: 'flex',
    minHeight: {
      xs: 340,
      lg: 360,
      xl: 430,
    },
    minWidth: 0,
    position: 'relative',
    '&:fullscreen': {
      p: 2,
    },
  },
  stack3: {
    alignItems: 'center',
    borderInlineEnd: '1px solid',
    borderColor: 'divider',
    flex: '0 0 38px',
    py: 0.75,
  },
  divider4: {
    my: 0.4,
  },
  box5: {
    flex: 1,
  },
  box6: {
    minWidth: 0,
    flex: 1,
  },
  box7: {
    alignItems: 'center',
    borderBottom: '1px solid',
    borderColor: 'divider',
    display: 'flex',
    gap: 0.5,
    minHeight: 40,
    overflowX: 'auto',
    px: 1,
  },
  button8: {
    fontSize: 11,
    minWidth: 34,
    px: 0.75,
  },
  divider9: {
    mx: 0.5,
  },
  box10: {
    flex: 1,
  },
  typography11: {
    ml: 1.25,
  },
  typography12: {
    ml: 1.25,
  },
  typography13: {
    ml: 1.25,
  },
  box14: {
    position: 'relative',
  },
  stack15: {
    insetInlineStart: 10,
    position: 'absolute',
    top: 7,
    zIndex: 1,
  },
  box16: (tool: string) => ({
    cursor: tool === 'cursor' ? 'crosshair' : 'cell',
    display: 'block',
    height: {
      xs: 340,
      lg: 360,
      xl: 430,
    },
    touchAction: 'none',
    userSelect: 'none',
    width: '100%',
  }),
  box17: (theme: Theme) => ({
    bgcolor: alpha(theme.palette.background.default, 0.9),
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 1.5,
    bottom: 10,
    color: 'text.secondary',
    fontSize: 11,
    px: 1.25,
    py: 0.6,
    position: 'absolute',
    right: 74,
  }),
};
