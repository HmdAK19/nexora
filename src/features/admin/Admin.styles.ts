export const styles = {
  actions: { mt: 3 },
  dialogContent: { pt: 1 },
  fieldSpacing: { mt: 2 },
  fullHeightCard: { height: '100%' },
  metricContent: {
    alignItems: 'center',
    display: 'grid',
    gap: 1.5,
    gridTemplateColumns: 'auto minmax(0, 1fr)',
    height: '100%',
  },
  metricIcon: {
    bgcolor: 'primary.main',
    borderRadius: 2,
    color: 'primary.contrastText',
    display: 'grid',
    height: 42,
    placeItems: 'center',
    width: 42,
  },
  navigation: {
    borderBottom: '1px solid',
    borderColor: 'divider',
    mb: 3,
  },
  navigationTab: {
    minHeight: 44,
    textTransform: 'none',
    '&.active': {
      color: 'primary.main',
    },
  },
  saveButton: { mt: 2 },
  searchField: { mb: 2 },
  sectionSpacing: { mt: 2 },
  ticketContent: {
    alignItems: { xs: 'flex-start', sm: 'center' },
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: 2,
  },
  trailingChip: { marginInlineStart: { sm: 'auto' } },
};
