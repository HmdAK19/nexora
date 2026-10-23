import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Plus, Trash2 } from 'lucide-react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { PageHeading } from '@shared/ui';
import { NAMESPACES } from '@app/i18n';

import { styles } from './CardsPage.styles';

interface BankCard {
  id: number;
  number: string;
  iban: string;
}
export default function CardsPage() {
  const { t } = useTranslation(NAMESPACES.cards);
  const [cards, setCards] = useState<BankCard[]>([
    {
      id: 1,
      number: '6037 •••• •••• 8241',
      iban: 'IR•• 0560 0000 0012 3456 7890 01',
    },
  ]);
  const [open, setOpen] = useState(false);
  const [number, setNumber] = useState('');
  const [iban, setIban] = useState('');
  const cleanNumber = number.replace(/\D/g, '');
  const valid = cleanNumber.length === 16 && /^IR\d{24}$/i.test(iban.replace(/\s/g, ''));
  const addCard = () => {
    setCards((items) => [
      ...items,
      {
        id: Date.now(),
        number: `${cleanNumber.slice(0, 4)} •••• •••• ${cleanNumber.slice(-4)}`,
        iban: iban.toUpperCase(),
      },
    ]);
    setOpen(false);
    setNumber('');
    setIban('');
  };
  return (
    <Box>
      <PageHeading title={t('title')} description={t('description')} />
      <Stack direction="row" justifyContent="flex-end" sx={styles.stack1}>
        <Button startIcon={<Plus size={17} />} variant="contained" onClick={() => setOpen(true)}>
          {t('add')}
        </Button>
      </Stack>
      <Stack spacing={2}>
        {cards.map((card) => (
          <Card key={card.id}>
            <CardContent sx={styles.cardContent2}>
              <Box sx={styles.box3}>
                <CreditCard size={22} />
              </Box>
              <Box>
                <Typography fontWeight={750}>{card.number}</Typography>
                <Typography color="text.secondary" variant="body2" sx={styles.typography4}>
                  {card.iban}
                </Typography>
              </Box>
              <IconButton
                aria-label={t('delete')}
                color="error"
                onClick={() => setCards((items) => items.filter(({ id }) => id !== card.id))}
                sx={styles.iconButton5}
              >
                <Trash2 size={18} />
              </IconButton>
            </CardContent>
          </Card>
        ))}
      </Stack>
      {cards.length === 0 && <Alert severity="info">{t('empty')}</Alert>}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{t('dialogTitle')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={styles.stack6}>
            <Alert severity="info">{t('ownershipNotice')}</Alert>
            <TextField
              label={t('cardNumber')}
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              inputProps={{
                inputMode: 'numeric',
                maxLength: 19,
              }}
            />
            <TextField
              label={t('iban')}
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              placeholder="IR000000000000000000000000"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>{t('cancel')}</Button>
          <Button variant="contained" disabled={!valid} onClick={addCard}>
            {t('save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
