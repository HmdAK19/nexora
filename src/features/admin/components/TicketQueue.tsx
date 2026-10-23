import { useTranslation } from 'react-i18next';
import { TicketCheck } from 'lucide-react';
import { Alert, Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';

import { NAMESPACES } from '@app/i18n';

import type { AdminController } from '../hooks';
import { styles } from '../Admin.styles';

export function TicketQueue({ controller }: { controller: AdminController }) {
  const { t } = useTranslation(NAMESPACES.admin);

  if (controller.tickets.length === 0) return <Alert severity="success">{t('tickets.empty')}</Alert>;

  return (
    <Stack spacing={1.5}>
      {controller.tickets.map((ticket) => (
        <Card key={ticket.id}>
          <CardContent sx={styles.cardContent13}>
            <TicketCheck size={22} />
            <Box>
              <Typography fontWeight={750}>{t(`tickets.${ticket.subjectKey}`)}</Typography>
              <Typography color="text.secondary" variant="body2">
                {ticket.id} · hamed@example.com
              </Typography>
            </Box>
            <Chip
              label={t(`tickets.${ticket.priorityKey}`)}
              color={ticket.normal ? 'default' : 'warning'}
              size="small"
              sx={styles.chip14}
            />
            <Button onClick={() => controller.openTicket(ticket)}>{t('reply')}</Button>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
