import { Card, CardContent, Stack, Typography } from '@mui/material';

import type { ReferralEntry } from '../model';
import { ReferralStatusChip } from './ReferralStatusChip';
import { styles } from './Referrals.styles';

interface ReferralListProps {
  currency: string;
  entries: ReferralEntry[];
  emptyLabel: string;
  formatDate: (value: string) => string;
  formatReward: (value: number, currency: string) => string;
}

export function ReferralList({ currency, emptyLabel, entries, formatDate, formatReward }: ReferralListProps) {
  if (entries.length === 0) return <Typography color="text.secondary">{emptyLabel}</Typography>;

  return (
    <Stack spacing={1.25}>
      {entries.map((entry) => (
        <Card key={entry.id} variant="outlined">
          <CardContent sx={styles.entry}>
            <Stack sx={styles.entryIdentity}>
              <Typography fontWeight={750}>{entry.inviteeName}</Typography>
              <Typography color="text.secondary" variant="caption">
                {formatDate(entry.createdAt)}
              </Typography>
            </Stack>
            <ReferralStatusChip status={entry.status} />
            <Typography fontWeight={750} sx={styles.reward}>
              {formatReward(entry.rewardAmount, currency)}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
