import type { ReactNode } from 'react';
import { Box, Card, CardContent, Skeleton, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { styles } from './SkeletonState.styles';

interface SkeletonStateProps {
  children: ReactNode;
  minHeight?: number | string;
}

export function SkeletonState({ children, minHeight }: SkeletonStateProps) {
  const { t } = useTranslation();

  return (
    <Box aria-busy="true" aria-label={t('common.loading')} role="status" sx={styles.state(minHeight)}>
      {children}
    </Box>
  );
}

export function SkeletonHeading({ action = false }: { action?: boolean }) {
  return (
    <Box sx={styles.heading}>
      <Stack spacing={1} sx={styles.headingText}>
        <Skeleton height={42} width="42%" />
        <Skeleton height={22} width="68%" />
      </Stack>
      {action && <Skeleton height={40} variant="rounded" width={132} />}
    </Box>
  );
}

export function SkeletonStatGrid({ count = 4 }: { count?: number }) {
  return (
    <Box sx={styles.statGrid(count)}>
      {Array.from({ length: count }, (_, index) => (
        <Card key={index}>
          <CardContent>
            <Stack spacing={1.25}>
              <Skeleton height={20} width="48%" />
              <Skeleton height={36} width="72%" />
              <Skeleton height={18} width="58%" />
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

interface SkeletonRowsProps {
  columns?: number;
  minWidth?: number | string;
  rows?: number;
  rowHeight?: number;
}

export function SkeletonRows({ columns = 4, minWidth, rows = 6, rowHeight = 52 }: SkeletonRowsProps) {
  return (
    <Stack spacing={0.75} sx={styles.rows}>
      {Array.from({ length: rows }, (_, row) => (
        <Box key={row} sx={styles.row(columns, minWidth)}>
          {Array.from({ length: columns }, (_, column) => (
            <Skeleton
              height={rowHeight}
              key={column}
              variant="rounded"
              width={column === 0 ? '100%' : '82%'}
            />
          ))}
        </Box>
      ))}
    </Stack>
  );
}

export function TablePageSkeleton({ columns = 5, rows = 6 }: SkeletonRowsProps) {
  return (
    <SkeletonState>
      <Stack spacing={3}>
        <SkeletonHeading action />
        <Card sx={styles.tableCard}>
          <Skeleton height={48} variant="rounded" width="36%" />
          <SkeletonRows columns={columns} rows={rows} />
        </Card>
      </Stack>
    </SkeletonState>
  );
}

export function CardGridPageSkeleton({ count = 4 }: { count?: number }) {
  return (
    <SkeletonState>
      <Stack spacing={3}>
        <SkeletonHeading action />
        <Box sx={styles.cardGrid}>
          {Array.from({ length: count }, (_, index) => (
            <Skeleton height={180} key={index} variant="rounded" />
          ))}
        </Box>
      </Stack>
    </SkeletonState>
  );
}

export function FormPageSkeleton() {
  return (
    <SkeletonState>
      <Stack spacing={3}>
        <SkeletonHeading />
        <Card sx={styles.formCard}>
          <CardContent>
            <Stack spacing={2.25}>
              <Skeleton height={30} width="38%" />
              <Skeleton height={56} variant="rounded" />
              <Skeleton height={56} variant="rounded" />
              <Skeleton height={56} variant="rounded" />
              <Skeleton height={42} variant="rounded" width={148} />
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </SkeletonState>
  );
}

export function DashboardPageSkeleton() {
  return (
    <SkeletonState>
      <Stack spacing={3}>
        <SkeletonHeading action />
        <SkeletonStatGrid />
        <Box sx={styles.dashboardGrid}>
          <Skeleton height={340} variant="rounded" />
          <Skeleton height={340} variant="rounded" />
          <Skeleton height={280} variant="rounded" />
          <Skeleton height={280} variant="rounded" />
        </Box>
      </Stack>
    </SkeletonState>
  );
}
