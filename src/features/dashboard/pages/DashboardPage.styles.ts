export const styles = {
  box1: {
    alignItems: {
      sm: 'center',
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
    gap: 1.25,
  },
  box4: {
    display: 'grid',
    gap: 2,
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(2, 1fr)',
      xl: 'repeat(4, 1fr)',
    },
  },
  box5: {
    display: 'grid',
    gap: 2,
    gridTemplateColumns: {
      xs: '1fr',
      lg: 'minmax(0, 2fr) minmax(280px, .8fr)',
    },
  },
  cardContent6: {
    p: {
      xs: 2,
      sm: 2.5,
    },
  },
  box7: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    mb: 2,
  },
  cardContent8: {
    p: 2.5,
  },
  typography9: {
    mb: 3,
  },
  box10: {
    display: 'grid',
    gap: 2,
    gridTemplateColumns: {
      xs: '1fr',
      xl: 'minmax(0, 1.35fr) minmax(360px, .65fr)',
    },
  },
  cardContent11: {
    p: 0,
  },
  box12: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    p: 2.5,
  },
  box13: {
    overflowX: 'auto',
  },
  box14: {
    minWidth: 620,
  },
  box15: {
    alignItems: 'center',
    borderTop: '1px solid',
    borderColor: 'divider',
    display: 'grid',
    gap: 2,
    gridTemplateColumns: 'minmax(150px,1.3fr) 1fr 100px 130px',
    px: 2.5,
    py: 1.6,
  },
  box16: {
    alignItems: 'center',
    display: 'flex',
    gap: 1.2,
  },
  typography17: {
    direction: 'ltr',
    textAlign: 'start',
  },
  cardContent18: {
    p: 2.5,
  },
  box19: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    mb: 1,
  },
  box20: {
    borderTop: '1px solid',
    borderColor: 'divider',
  },
  box21: {
    alignItems: 'center',
    display: 'flex',
    gap: 1.25,
    py: 1.6,
  },
  box22: (kind: string) => ({
    bgcolor: kind === 'sell' ? 'rgba(255,77,120,.12)' : 'rgba(40,215,162,.12)',
    borderRadius: 2,
    color: kind === 'sell' ? 'error.main' : 'success.main',
    display: 'grid',
    height: 38,
    placeItems: 'center',
    width: 38,
  }),
};
