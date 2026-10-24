import { Box, Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@app/i18n';
import type { SupportTicketSummary } from '../api';

import { supportStyles } from '../Support.styles';
import { TicketStatusChip } from './TicketStatusChip';

interface TicketListProps {
  formatDate: (value: string) => string;
  onSelect: (id: string) => void;
  tickets: SupportTicketSummary[];
}

export function TicketList({ formatDate, onSelect, tickets }: TicketListProps) {
  const { t } = useTranslation(NAMESPACES.support);

  return (
    <Stack spacing={1.5}>
      {tickets.map((ticket) => (
        <Card key={ticket.id} sx={supportStyles.ticketCard} variant="outlined">
          <CardActionArea onClick={() => onSelect(ticket.id)}>
            <CardContent sx={supportStyles.ticketContent}>
              <Box sx={supportStyles.ticketMeta}>
                <Typography fontWeight={750} noWrap>
                  {ticket.subject}
                </Typography>
                <Typography color="text.secondary" variant="body2" noWrap>
                  {t(`category.${ticket.category}`)} · {formatDate(ticket.updatedAt)}
                </Typography>
                <Typography color="text.secondary" variant="caption" noWrap>
                  {ticket.lastMessagePreview}
                </Typography>
              </Box>
              <Box sx={supportStyles.ticketStatus}>
                <TicketStatusChip status={ticket.status} />
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Stack>
  );
}
