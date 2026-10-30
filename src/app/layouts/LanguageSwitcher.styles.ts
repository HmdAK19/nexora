import { alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

export const languageSwitcherStyles = {
  button: (theme: Theme) => ({
    border: '1px solid transparent',
    borderRadius: 2,
    color: 'text.secondary',
    gap: 0.75,
    minWidth: 0,
    px: { xs: 0.75, sm: 1.1 },
    py: 0.65,
    textTransform: 'none',
    transition: theme.transitions.create(['background-color', 'border-color', 'color'], {
      duration: theme.transitions.duration.shortest,
    }),
    '& .MuiButton-startIcon': {
      m: 0,
    },
    '&:hover': {
      bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.12 : 0.07),
      borderColor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.16 : 0.1),
      color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
    },
    '&.Mui-focusVisible': {
      outline: `2px solid ${alpha(theme.palette.primary.main, 0.6)}`,
      outlineOffset: 2,
    },
  }),
  label: {
    display: { xs: 'none', sm: 'inline' },
    fontSize: 12.5,
    fontWeight: 700,
  },
  badge: (theme: Theme) => ({
    bgcolor: alpha(theme.palette.text.primary, 0.06),
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 999,
    color: 'text.secondary',
    fontSize: 9.5,
    fontWeight: 800,
    letterSpacing: '.06em',
    lineHeight: 1,
    px: 0.65,
    py: 0.4,
  }),
};
