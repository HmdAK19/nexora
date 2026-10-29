export const styles = {
  box1: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    minHeight: 520,
    position: 'relative',
  },
  box2: {
    border: '1px dashed rgba(90,145,255,.36)',
    borderRadius: '50%',
    height: 'min(36vw, 490px)',
    position: 'absolute',
    width: 'min(36vw, 490px)',
  },
  box3: {
    background: 'radial-gradient(circle, rgba(23,105,255,.27), rgba(23,105,255,.03) 56%, transparent 70%)',
    border: '1px solid rgba(90,145,255,.18)',
    borderRadius: '50%',
    display: 'grid',
    height: 'min(27vw, 370px)',
    placeItems: 'center',
    width: 'min(27vw, 370px)',
  },
  paper4: (item: { x: string; y: string }) => ({
    backdropFilter: 'blur(14px)',
    bgcolor: 'rgba(26,31,43,.88)',
    left: item.x,
    minWidth: 150,
    p: 2,
    position: 'absolute',
    top: item.y,
  }),
  box5: {
    display: 'grid',
    minHeight: '100vh',
    overflow: 'hidden',
    p: {
      xs: 2,
      sm: 4,
    },
    placeItems: 'center',
    position: 'relative',
  },
  box6: {
    background: 'radial-gradient(circle, rgba(23,105,255,.2), transparent 66%)',
    height: 520,
    insetInlineStart: -220,
    position: 'absolute',
    top: -240,
    width: 520,
  },
  box7: {
    display: 'grid',
    gap: {
      md: 8,
    },
    gridTemplateColumns: {
      xs: '1fr',
      md: 'minmax(360px, 500px) minmax(480px, 1fr)',
    },
    maxWidth: 1380,
    width: '100%',
  },
  box8: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: {
      md: 'calc(100vh - 64px)',
    },
    py: 4,
    zIndex: 1,
  },
  typography9: {
    fontSize: {
      xs: 34,
      sm: 46,
    },
    fontWeight: 650,
    letterSpacing: '-.04em',
    mt: {
      xs: 7,
      md: 11,
    },
  },
  typography10: {
    mb: 5,
    mt: 1,
  },
  box11: {
    maxWidth: 440,
  },
  box12: {
    alignItems: 'center',
    display: 'flex',
    gap: 1.5,
    justifyContent: 'space-between',
  },
  button13: {
    background: 'linear-gradient(110deg, #0e57df, #247aff)',
    height: 50,
  },
  typography14: {
    mt: 'auto',
    pt: 6,
  },
  box15: {
    display: {
      xs: 'none',
      md: 'block',
    },
  },
};
