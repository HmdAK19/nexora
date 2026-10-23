import { alpha, createTheme, type PaletteMode } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    surface: {
      main: string;
      elevated: string;
      border: string;
    };
  }
  interface PaletteOptions {
    surface?: {
      main: string;
      elevated: string;
      border: string;
    };
  }
}
export const createAppTheme = (mode: PaletteMode, direction: 'rtl' | 'ltr') => {
  const dark = mode === 'dark';
  return createTheme({
    direction,
    shape: {
      borderRadius: 14,
    },
    spacing: 8,
    palette: {
      mode,
      primary: {
        main: '#1769ff',
        light: '#5a91ff',
        dark: '#0d47c8',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#20d6c7',
        light: '#69eee3',
        dark: '#0d988f',
      },
      success: {
        main: '#28d7a2',
      },
      error: {
        main: '#ff4d78',
      },
      warning: {
        main: '#ffad32',
      },
      background: {
        default: dark ? '#0b0e14' : '#f5f7fb',
        paper: dark ? '#141821' : '#ffffff',
      },
      text: {
        primary: dark ? '#f4f7ff' : '#111827',
        secondary: dark ? '#8f99b3' : '#667085',
      },
      divider: dark ? alpha('#9bacd5', 0.12) : alpha('#1f2937', 0.1),
      surface: {
        main: dark ? '#141821' : '#ffffff',
        elevated: dark ? '#1a1f2b' : '#f9fafc',
        border: dark ? '#252c3c' : '#e6e9f0',
      },
    },
    typography: {
      fontFamily: 'Inter, Vazirmatn, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      h1: {
        fontSize: 'clamp(1.65rem, 3vw, 2.35rem)',
        fontWeight: 750,
        letterSpacing: '-0.035em',
      },
      h2: {
        fontSize: 'clamp(1.3rem, 2vw, 1.75rem)',
        fontWeight: 720,
        letterSpacing: '-0.025em',
      },
      h3: {
        fontSize: '1.05rem',
        fontWeight: 700,
      },
      button: {
        fontWeight: 700,
        textTransform: 'none',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*': {
            boxSizing: 'border-box',
          },
          html: {
            minWidth: 320,
            backgroundColor: dark ? '#0b0e14' : '#f5f7fb',
          },
          body: {
            margin: 0,
            minWidth: 320,
            minHeight: '100vh',
          },
          '#root': {
            minHeight: '100vh',
          },
          '::selection': {
            background: alpha('#1769ff', 0.45),
          },
          '::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '::-webkit-scrollbar-thumb': {
            background: dark ? '#30384a' : '#cbd2df',
            borderRadius: 999,
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            minHeight: 42,
            borderRadius: 11,
            paddingInline: 20,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${dark ? '#212838' : '#e7eaf1'}`,
            boxShadow: 'none',
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          size: 'small',
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 11,
            background: dark ? alpha('#ffffff', 0.025) : alpha('#0b0e14', 0.018),
          },
        },
      },
      MuiTooltip: {
        defaultProps: {
          arrow: true,
        },
      },
    },
  });
};
