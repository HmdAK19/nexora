import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BadgeDollarSign } from 'lucide-react';
import { Button, Card, CardContent, Grid, Typography } from '@mui/material';

import { NAMESPACES } from '@app/i18n';

import { buyStyles } from '../Buy.styles';
import { p2pOffers } from '../model';

export function P2POffers() {
  const { t } = useTranslation(NAMESPACES.buy);
  const navigate = useNavigate();

  return (
    <Grid container spacing={2}>
      {p2pOffers.map(({ asset, completion, offer }) => (
        <Grid key={offer} size={{ xs: 12, md: 4 }}>
          <Card sx={buyStyles.offerCard}>
            <CardContent>
              <BadgeDollarSign aria-hidden size={24} />
              <Typography fontWeight={800} sx={buyStyles.offerTitle}>
                {offer}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {t('merchantCompletion', { completion })}
              </Typography>
              <Button
                fullWidth
                onClick={() => navigate(`/trade/${asset}-USDT`)}
                sx={buyStyles.offerButton}
                variant="outlined"
              >
                {t('buy')}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
