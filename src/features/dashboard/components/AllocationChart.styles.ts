export const allocationChartStyles = (gradient: string) => ({
  box1: {
    alignItems: 'center',
    display: 'grid',
    gap: 3,
    gridTemplateColumns: {
      xs: '120px 1fr',
      lg: '1fr',
    },
    justifyItems: 'center',
  },
  box2: {
    background: `conic-gradient(${gradient})`,
    borderRadius: '50%',
    display: 'grid',
    height: 144,
    placeItems: 'center',
    width: 144,
  },
  box3: {
    bgcolor: 'background.paper',
    borderRadius: '50%',
    display: 'grid',
    height: 94,
    placeItems: 'center',
    textAlign: 'center',
    width: 94,
  },
  stack4: {
    width: '100%',
  },
  box5: {
    alignItems: 'center',
    display: 'flex',
    gap: 1,
  },
  box6: (color: string) => ({
    bgcolor: color,
    borderRadius: '50%',
    height: 8,
    width: 8,
  }),
});
