export const styles = {
  cardContent1: {
    p: {
      xs: 2,
      md: 3,
    },
  },
  stepper2: {
    mb: 4,
  },
  button3: {
    alignSelf: 'flex-end',
  },
  box4: (hasDocument: boolean) => ({
    border: '1px dashed',
    borderColor: hasDocument ? 'success.main' : 'divider',
    borderRadius: 3,
    p: 4,
    textAlign: 'center',
  }),
  typography5: {
    my: 1,
  },
  stack6: {
    py: 3,
    textAlign: 'center',
  },
  chip7: {
    marginInlineStart: 'auto',
  },
  box8: {
    mt: 3,
  },
};
