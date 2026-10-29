export const styles = {
  box1: {
    alignItems: {
      sm: 'end',
    },
    display: 'flex',
    flexDirection: {
      xs: 'column',
      sm: 'row',
    },
    gap: 2,
    justifyContent: 'space-between',
  },
  typography2: {
    mt: 0.75,
  },
  box3: {
    display: 'flex',
    gap: 1,
    width: {
      xs: '100%',
      sm: 'auto',
    },
  },
  card4: {
    background: 'linear-gradient(125deg, rgba(23,105,255,.96), rgba(66,58,195,.86))',
    border: 0,
    color: '#fff',
  },
  cardContent5: {
    alignItems: 'center',
    display: 'flex',
    gap: 2,
    justifyContent: 'space-between',
    minHeight: 176,
    p: {
      xs: 2.5,
      sm: 4,
    },
  },
  typography6: {
    opacity: 0.72,
  },
  box7: {
    alignItems: 'center',
    display: 'flex',
    gap: 1,
    mt: 1,
  },
  typography8: {
    direction: 'ltr',
    fontSize: {
      xs: 32,
      sm: 44,
    },
    fontWeight: 800,
  },
  typography9: {
    mt: 1,
    opacity: 0.74,
  },
  box10: {
    border: '1px solid rgba(255,255,255,.22)',
    borderRadius: '50%',
    display: {
      xs: 'none',
      sm: 'grid',
    },
    height: 92,
    placeItems: 'center',
    width: 92,
  },
  box11: {
    alignItems: {
      xs: 'stretch',
      sm: 'center',
    },
    display: 'flex',
    flexDirection: {
      xs: 'column',
      sm: 'row',
    },
    gap: 1.5,
    justifyContent: 'space-between',
  },
  textField12: {
    width: {
      xs: '100%',
      sm: 280,
    },
  },
  card13: {
    overflow: 'hidden',
  },
  box14: {
    display: {
      xs: 'none',
      md: 'grid',
    },
    gap: 2,
    gridTemplateColumns: '1.5fr 1fr 1fr 1fr 190px',
    px: 2.5,
    py: 1.5,
  },
  box15: {
    alignItems: 'center',
    borderTop: '1px solid',
    borderColor: 'divider',
    display: 'grid',
    gap: 2,
    gridTemplateColumns: {
      xs: 'minmax(140px,1fr) 1fr',
      md: '1.5fr 1fr 1fr 1fr 190px',
    },
    px: 2.5,
    py: 1.65,
  },
  box16: {
    alignItems: 'center',
    display: 'flex',
    gap: 1.2,
  },
  box17: {
    textAlign: {
      xs: 'end',
      md: 'start',
    },
  },
  typography18: {
    display: {
      md: 'none',
    },
  },
  typography19: {
    display: {
      xs: 'none',
      md: 'block',
    },
  },
  typography20: {
    display: {
      xs: 'none',
      md: 'block',
    },
  },
  box21: {
    display: {
      xs: 'none',
      md: 'flex',
    },
    gap: 1,
  },
  cardContent22: {
    p: 0,
  },
  typography23: {
    p: 2.5,
  },
  stack24: {
    px: 2.5,
    pb: 2.5,
  },
  alert25: {
    m: 2,
  },
  box26: {
    alignItems: 'center',
    borderTop: '1px solid',
    borderColor: 'divider',
    display: 'grid',
    gap: 2,
    gridTemplateColumns: {
      xs: '1fr auto',
      sm: 'minmax(180px,1fr) 1fr 1fr auto',
    },
    px: 2.5,
    py: 1.6,
  },
  box27: {
    alignItems: 'center',
    display: 'flex',
    gap: 1.25,
  },
  box28: (type: 'deposit' | 'withdraw') => ({
    bgcolor: type === 'deposit' ? 'rgba(40,215,162,.1)' : 'rgba(23,105,255,.1)',
    borderRadius: 2,
    color: type === 'deposit' ? 'success.main' : 'primary.main',
    display: 'grid',
    height: 38,
    placeItems: 'center',
    width: 38,
  }),
  typography29: {
    display: {
      xs: 'none',
      sm: 'block',
    },
  },
  chip30: {
    display: {
      xs: 'none',
      sm: 'inline-flex',
    },
    justifySelf: 'start',
  },
  typography31: {
    direction: 'ltr',
    textAlign: 'end',
  },
};
