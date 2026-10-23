import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquarePlus } from 'lucide-react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { PageHeading } from '@shared/ui';
import { NAMESPACES } from '@app/i18n';
import { useLanguage } from '@shared/hooks';
import type { Language } from '@shared/model';

import { styles } from './SupportPage.styles';

interface Ticket {
  category: 'account' | 'wallet';
  id: number;
  subject: string;
  status: 'answered' | 'underReview';
  date: string;
}

const dateLocales: Record<Language, string> = {
  en: 'en-US',
  fa: 'fa-IR',
};

export default function SupportPage() {
  const { lang } = useLanguage();
  const { t } = useTranslation(NAMESPACES.support);
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 1042,
      subject: 'sampleSubject',
      category: 'wallet',
      status: 'answered',
      date: '2026/10/16',
    },
  ]);
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('wallet');
  const [description, setDescription] = useState('');
  const submit = () => {
    setTickets((items) => [
      {
        id: Date.now(),
        subject,
        category: category as Ticket['category'],
        status: 'underReview',
        date: new Date().toLocaleDateString(dateLocales[lang]),
      },
      ...items,
    ]);
    setOpen(false);
    setSubject('');
    setDescription('');
  };
  return (
    <Box>
      <PageHeading title={t('title')} description={t('description')} />
      <Stack direction="row" justifyContent="flex-end" sx={styles.stack1}>
        <Button startIcon={<MessageSquarePlus size={17} />} variant="contained" onClick={() => setOpen(true)}>
          {t('newTicket')}
        </Button>
      </Stack>
      <Stack spacing={1.5}>
        {tickets.map((ticket) => (
          <Card key={ticket.id}>
            <CardContent sx={styles.cardContent2}>
              <Box>
                <Typography fontWeight={750}>{t(ticket.subject)}</Typography>
                <Typography color="text.secondary" variant="body2">
                  #{ticket.id} · {t(ticket.category)} · {ticket.date}
                </Typography>
              </Box>
              <Chip
                color={ticket.status === 'answered' ? 'success' : 'warning'}
                label={t(ticket.status)}
                size="small"
                sx={styles.chip3}
              />
            </CardContent>
          </Card>
        ))}
      </Stack>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{t('dialogTitle')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={styles.stack4}>
            <TextField label={t('subject')} value={subject} onChange={(e) => setSubject(e.target.value)} />
            <TextField
              select
              label={t('category')}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="wallet">{t('wallet')}</MenuItem>
              <MenuItem value="account">{t('account')}</MenuItem>
            </TextField>
            <TextField
              label={t('descriptionField')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              minRows={4}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>{t('cancel')}</Button>
          <Button
            variant="contained"
            disabled={subject.trim().length < 4 || description.trim().length < 10}
            onClick={submit}
          >
            {t('submit')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
