export const convertStyles = {
  page: {
    maxWidth: 760,
    mx: 'auto',
  },
  cardContent: {
    p: { xs: 2.5, sm: 4 },
  },
  assetSelect: {
    minWidth: 88,
  },
  swapRow: {
    alignItems: 'center',
    display: 'flex',
    gap: 1,
  },
  divider: {
    bgcolor: 'divider',
    flex: 1,
    height: 1,
  },
  swapButton: {
    border: '1px solid',
    borderColor: 'divider',
  },
  quotePreview: {
    bgcolor: 'action.hover',
    borderRadius: 2,
    p: 2,
  },
  dialogContent: {
    pt: '8px !important',
  },
  receipt: {
    mt: 2.5,
  },
  orderId: {
    overflowWrap: 'anywhere',
  },
} as const;
