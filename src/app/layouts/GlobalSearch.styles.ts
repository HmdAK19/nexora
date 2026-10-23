export const styles = {
  root: {
    display: {
      xs: 'none',
      sm: 'block',
    },
    marginInlineEnd: 'auto',
    maxWidth: 360,
    width: '38%',
  },
  option: {
    alignItems: 'center',
    display: 'flex',
    gap: 1.25,
    width: '100%',
  },
  optionIcon: {
    alignItems: 'center',
    bgcolor: 'action.hover',
    borderRadius: 1.5,
    color: 'text.secondary',
    display: 'flex',
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  optionText: {
    flex: 1,
    minWidth: 0,
  },
  shortcut: {
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 1,
    color: 'text.secondary',
    fontSize: 10,
    px: 0.65,
    py: 0.15,
  },
};
