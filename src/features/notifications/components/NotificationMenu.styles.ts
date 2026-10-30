export const styles = {
  menuPaper: { maxWidth: 400, width: 'calc(100vw - 24px)' },
  header: {
    alignItems: 'center',
    display: 'flex',
    gap: 1.5,
    justifyContent: 'space-between',
    px: 2,
    py: 1.25,
  },
  item: {
    alignItems: 'flex-start',
    gap: 1.25,
    py: 1.25,
    whiteSpace: 'normal',
  },
  unreadDot: {
    bgcolor: 'primary.main',
    borderRadius: '50%',
    flex: '0 0 auto',
    height: 7,
    mt: 0.75,
    width: 7,
  },
  readDot: { flex: '0 0 auto', height: 7, width: 7 },
  itemText: { minWidth: 0 },
  feedback: { px: 2, py: 3 },
  time: { display: 'block', mt: 0.5 },
};
