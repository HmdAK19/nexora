import type { SxProps, Theme } from '@mui/material';

export const styles = {
  state: (minHeight: number | string = '45vh'): SxProps<Theme> => ({ minHeight }),
  heading: {
    alignItems: { xs: 'stretch', sm: 'center' },
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: 2,
    justifyContent: 'space-between',
  },
  headingText: { maxWidth: 620, width: '100%' },
  statGrid: (count: number): SxProps<Theme> => ({
    display: 'grid',
    gap: 2,
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(2, minmax(0, 1fr))',
      lg: `repeat(${Math.min(count, 4)}, minmax(0, 1fr))`,
    },
  }),
  rows: { mt: 2 },
  row: (columns: number, minWidth?: number | string): SxProps<Theme> => ({
    alignItems: 'center',
    display: 'grid',
    gap: 1.5,
    gridTemplateColumns: `repeat(${columns}, minmax(72px, 1fr))`,
    minWidth: minWidth ?? Math.max(560, columns * 110),
  }),
  tableCard: { overflowX: 'auto', p: 2 },
  cardGrid: {
    display: 'grid',
    gap: 2,
    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
  },
  formCard: { maxWidth: 760 },
  dashboardGrid: {
    display: 'grid',
    gap: 2,
    gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
  },
} satisfies Record<string, unknown>;
