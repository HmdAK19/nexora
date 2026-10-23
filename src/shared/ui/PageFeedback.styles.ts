export const pageFeedbackStyles = (type: 'error' | 'empty') => ({
  box1: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
    justifyContent: 'center',
    minHeight: 280,
    p: 4,
    textAlign: 'center',
  },
  box2: {
    bgcolor: type === 'error' ? 'error.main' : 'surface.elevated',
    borderRadius: 3,
    color: type === 'error' ? 'error.contrastText' : 'text.secondary',
    display: 'grid',
    p: 2,
    placeItems: 'center',
  },
  typography3: {
    maxWidth: 440,
  },
});
