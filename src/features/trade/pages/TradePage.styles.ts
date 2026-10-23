export const styles = {
  availableValue: {
    color: '#f4f7ff',
  },
  box1: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 2,
    justifyContent: 'space-between',
  },
  box2: {
    alignItems: 'center',
    display: 'flex',
    gap: 1.25,
  },
  box3: {
    display: 'flex',
    gap: {
      xs: 2,
      sm: 4,
    },
  },
  box4: {
    display: {
      xs: 'none',
      sm: 'block',
    },
  },
  box5: {
    bgcolor: 'rgba(40,215,162,.1)',
    border: '1px solid rgba(40,215,162,.3)',
    borderRadius: 2,
    color: 'success.main',
    px: 2,
    py: 1,
  },
  box6: {
    display: 'grid',
    gap: {
      xs: 1.5,
      xl: 2,
    },
    gridTemplateColumns: {
      xs: '1fr',
      md: 'minmax(0, 1fr) minmax(260px, .42fr)',
      lg: 'minmax(190px, .68fr) minmax(380px, 2fr) minmax(260px, .9fr)',
      xl: '240px minmax(480px, 1fr) 300px',
    },
    minWidth: 0,
  },
  card7: {
    display: {
      xs: 'none',
      lg: 'block',
    },
    minWidth: 0,
  },
  cardContent8: {
    p: 0,
  },
  typography9: {
    p: 2,
  },
  box10: {
    borderBlock: '1px solid',
    borderColor: 'divider',
    color: 'success.main',
    fontSize: 17,
    fontWeight: 800,
    p: 1.5,
  },
  cardContent11: {
    height: '100%',
    minWidth: 0,
    p: 0,
  },
  chartCard: {
    gridColumn: {
      md: '1',
      lg: '2',
    },
    minWidth: 0,
    overflow: 'hidden',
  },
  box12: {
    alignItems: 'center',
    borderBottom: '1px solid',
    borderColor: 'divider',
    display: 'flex',
    justifyContent: 'space-between',
    px: 2,
  },
  cardContent13: {
    p: {
      xs: 2,
      lg: 1.5,
      xl: 2.25,
    },
  },
  orderCard: {
    gridColumn: {
      md: '2',
      lg: '3',
    },
    minWidth: 0,
  },
  tabs14: {
    mb: 1.25,
    minHeight: 38,
    '& .MuiTab-root': {
      minHeight: 38,
      py: 0.5,
    },
  },
  orderTypeTabs: {
    bgcolor: 'action.hover',
    borderRadius: 2,
    mb: 1.5,
    minHeight: 34,
    p: 0.25,
    '& .MuiTab-root': {
      minHeight: 32,
      py: 0.25,
    },
  },
  tab15: (side: 'buy' | 'sell') => ({
    color: side === 'buy' ? 'success.main' : undefined,
  }),
  tab16: (side: 'buy' | 'sell') => ({
    color: side === 'sell' ? 'error.main' : undefined,
  }),
  box17: {
    display: 'flex',
    gap: 1,
  },
  button18: {
    minWidth: 0,
    px: 1,
  },
  box19: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button20: (side: 'buy' | 'sell') => ({
    bgcolor: side === 'buy' ? 'success.main' : 'error.main',
    '&:hover': {
      bgcolor: side === 'buy' ? 'success.dark' : 'error.dark',
    },
  }),
  card21: {
    display: {
      lg: 'none',
    },
  },
  cardContent22: {
    p: 0,
  },
  typography23: {
    p: 2,
  },
  box24: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
  box25: {
    appearance: 'none',
    display: 'grid',
    background: 'transparent',
    border: 0,
    color: 'text.primary',
    cursor: 'pointer',
    gridTemplateColumns: '1fr 1fr',
    overflow: 'hidden',
    px: 1.5,
    py: 0.7,
    position: 'relative',
    width: '100%',
    '&:hover': {
      bgcolor: 'action.hover',
    },
    '&:focus-visible': {
      outline: '2px solid',
      outlineColor: 'primary.main',
      outlineOffset: -2,
    },
  },
  linearProgress26: {
    inset: 0,
    opacity: 0.08,
    position: 'absolute',
    transform: 'none',
    '& .MuiLinearProgress-bar': {
      transformOrigin: 'right',
    },
  },
  marketInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    minHeight: {
      xs: 340,
      lg: 430,
    },
    p: {
      xs: 2,
      sm: 3,
    },
  },
  marketInfoGrid: {
    display: 'grid',
    gap: 2,
    gridTemplateColumns: {
      xs: '1fr 1fr',
      sm: 'repeat(3, 1fr)',
    },
  },
  ordersCard: {
    overflow: 'hidden',
  },
  ordersTabs: {
    borderBottom: '1px solid',
    borderColor: 'divider',
    px: 2,
  },
  ordersLoading: {
    p: 2,
  },
  ordersAlert: {
    m: 2,
  },
  ordersEmpty: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5,
    py: 4,
    textAlign: 'center',
  },
  ordersScroller: {
    overflowX: 'auto',
  },
  ordersTable: {
    minWidth: 850,
  },
  ordersHeader: {
    display: 'grid',
    gap: 2,
    gridTemplateColumns: '.8fr .7fr .7fr 1fr .8fr .7fr .8fr 36px',
    px: 2.5,
    py: 1.25,
  },
  orderRow: {
    alignItems: 'center',
    borderTop: '1px solid',
    borderColor: 'divider',
    display: 'grid',
    gap: 2,
    gridTemplateColumns: '.8fr .7fr .7fr 1fr .8fr .7fr .8fr 36px',
    px: 2.5,
    py: 1.25,
  },
  orderStatus: {
    justifySelf: 'start',
  },
};
