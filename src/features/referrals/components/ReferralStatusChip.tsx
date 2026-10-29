import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@app/i18n';

import type { ReferralStatus } from '../model';

const colors = { joined: 'default', qualified: 'warning', rewarded: 'success' } as const;

export function ReferralStatusChip({ status }: { status: ReferralStatus }) {
  const { t } = useTranslation(NAMESPACES.referrals);

  return <Chip color={colors[status]} label={t(`status.${status}`)} size="small" />;
}
