export const supportStyles = {
  actions: { mb: 2 },
  ticketCard: {
    cursor: 'pointer',
    transition: 'border-color 160ms ease, transform 160ms ease',
    '&:hover': {
      borderColor: 'primary.main',
      transform: 'translateY(-1px)',
    },
  },
  ticketContent: {
    alignItems: { sm: 'center' },
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: 1.5,
  },
  ticketMeta: { minWidth: 0 },
  ticketStatus: { marginInlineStart: { sm: 'auto' } },
  dialogFields: { pt: 1 },
  conversation: {
    maxHeight: '42vh',
    overflowY: 'auto',
    px: 0.5,
  },
  message: (isUser: boolean) => ({
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    bgcolor: isUser ? 'primary.main' : 'action.hover',
    borderRadius: 2,
    color: isUser ? 'primary.contrastText' : 'text.primary',
    maxWidth: '85%',
    p: 1.5,
  }),
  messageMeta: { display: 'block', mt: 0.75, opacity: 0.75 },
  dialogAlert: { mb: 2 },
};
