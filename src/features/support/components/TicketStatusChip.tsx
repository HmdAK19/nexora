import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@app/i18n';

import type { SupportStatus } from '../model';

interface TicketStatusChipProps {
  status: SupportStatus;
}

const statusColors = {
  closed: 'default',
  open: 'info',
  waiting_for_support: 'warning',
  waiting_for_user: 'success',
} as const;

export function TicketStatusChip({ status }: TicketStatusChipProps) {
  const { t } = useTranslation(NAMESPACES.support);

  return <Chip color={statusColors[status]} label={t(`status.${status}`)} size="small" />;
}
