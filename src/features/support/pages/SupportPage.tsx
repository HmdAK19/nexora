import { useTranslation } from 'react-i18next';
import { MessageSquarePlus } from 'lucide-react';
import { Box, Button, Stack } from '@mui/material';

import { NAMESPACES } from '@app/i18n';
import { useLanguage } from '@shared/hooks';
import type { Language } from '@shared/model';
import { PageFeedback, PageHeading, TablePageSkeleton } from '@shared/ui';

import { CreateTicketDialog, TicketDetailsDialog, TicketList } from '../components';
import { useSupportCenter } from '../hooks';
import { supportStyles } from '../Support.styles';

const dateLocales: Record<Language, string> = {
  en: 'en-US',
  fa: 'fa-IR',
};

export default function SupportPage() {
  const { lang } = useLanguage();
  const { t } = useTranslation(NAMESPACES.support);
  const support = useSupportCenter();
  const formatDate = (value: string) =>
    new Intl.DateTimeFormat(dateLocales[lang], { dateStyle: 'medium', timeStyle: 'short' }).format(
      new Date(value)
    );

  return (
    <Box>
      <PageHeading title={t('title')} description={t('description')} />
      <Stack direction="row" justifyContent="flex-end" sx={supportStyles.actions}>
        <Button startIcon={<MessageSquarePlus size={17} />} variant="contained" onClick={support.openCreate}>
          {t('actions.newTicket')}
        </Button>
      </Stack>
      {support.ticketsLoading && <TablePageSkeleton columns={4} rows={5} />}
      {support.ticketsError && (
        <PageFeedback
          actionLabel={t('actions.retry')}
          description={t('errors.loadDescription')}
          onAction={() => void support.retryTickets()}
          title={t('errors.loadTitle')}
          type="error"
        />
      )}
      {!support.ticketsLoading && !support.ticketsError && support.tickets.length === 0 && (
        <PageFeedback
          actionLabel={t('actions.newTicket')}
          description={t('empty.description')}
          onAction={support.openCreate}
          title={t('empty.title')}
        />
      )}
      {!support.ticketsLoading && !support.ticketsError && support.tickets.length > 0 && (
        <TicketList formatDate={formatDate} onSelect={support.openTicket} tickets={support.tickets} />
      )}
      <CreateTicketDialog
        error={support.createError}
        onClose={support.closeCreate}
        onSubmit={support.createTicket}
        open={support.createOpen}
        pending={support.createPending}
      />
      <TicketDetailsDialog
        closeError={support.closeError}
        closing={support.closing}
        error={support.selectedTicketError}
        formatDate={formatDate}
        loading={support.selectedTicketLoading}
        onClose={support.closeDetails}
        onCloseTicket={support.closeTicket}
        onReply={support.sendReply}
        open={support.detailsOpen}
        reply={support.reply}
        replyError={support.replyError}
        replyPending={support.replyPending}
        replyTouched={support.replyTouched}
        replyValid={support.replyValid}
        setReply={support.setReply}
        touchReply={support.touchReply}
        ticket={support.selectedTicket}
      />
    </Box>
  );
}
