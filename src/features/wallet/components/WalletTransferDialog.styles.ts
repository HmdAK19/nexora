export const styles = {
  dialogTitle1: {
    alignItems: 'center',
    display: 'flex',
    gap: 1.25,
  },
  box2: (mode: 'deposit' | 'withdraw') => ({
    bgcolor: mode === 'deposit' ? 'rgba(40,215,162,.12)' : 'rgba(23,105,255,.12)',
    borderRadius: 2,
    color: mode === 'deposit' ? 'success.main' : 'primary.main',
    display: 'grid',
    height: 38,
    placeItems: 'center',
    width: 38,
  }),
  box3: {
    alignItems: 'center',
    display: 'flex',
    gap: 1.5,
    justifyContent: 'space-between',
  },
  dialogActions4: {
    p: 2,
  },
};
