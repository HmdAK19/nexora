import { CreditCard, Star, Trash2 } from 'lucide-react';
import { Alert, Box, Card, CardContent, IconButton, Stack, Typography } from '@mui/material';

import type { BankCard } from '../model';
import { styles } from './BankCardList.styles';

interface BankCardListProps {
  cards: BankCard[];
  defaultLabel: string;
  deleteLabel: string;
  emptyLabel: string;
  pending: boolean;
  setDefaultLabel: string;
  onRemove: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export function BankCardList(props: BankCardListProps) {
  if (props.cards.length === 0) return <Alert severity="info">{props.emptyLabel}</Alert>;

  return (
    <Stack spacing={2}>
      {props.cards.map((card) => (
        <Card key={card.id}>
          <CardContent sx={styles.content}>
            <Box sx={styles.icon}>
              <CreditCard size={22} />
            </Box>
            <Box sx={styles.details}>
              <Typography fontWeight={750}>{card.maskedNumber}</Typography>
              <Typography color="text.secondary" variant="body2" sx={styles.iban}>
                {card.maskedIban}
              </Typography>
              {card.isDefault && (
                <Typography color="primary.main" variant="caption">
                  {props.defaultLabel}
                </Typography>
              )}
            </Box>
            {!card.isDefault && (
              <IconButton
                aria-label={props.setDefaultLabel}
                disabled={props.pending}
                onClick={() => props.onSetDefault(card.id)}
              >
                <Star size={18} />
              </IconButton>
            )}
            <IconButton
              aria-label={props.deleteLabel}
              color="error"
              disabled={props.pending}
              onClick={() => props.onRemove(card.id)}
            >
              <Trash2 size={18} />
            </IconButton>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
