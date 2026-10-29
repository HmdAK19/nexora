import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Alert, Box, Button, Stack } from '@mui/material';

import { NAMESPACES } from '@app/i18n';
import { CardGridPageSkeleton, PageFeedback, PageHeading } from '@shared/ui';

import { AddBankCardDialog, BankCardList, RemoveBankCardDialog } from '../components';
import { useBankCards } from '../hooks';
import { styles } from './CardsPage.styles';

export default function CardsPage() {
  const { t } = useTranslation(NAMESPACES.cards);
  const bankCards = useBankCards();

  if (bankCards.loading) return <CardGridPageSkeleton />;
  if (bankCards.error)
    return (
      <PageFeedback
        type="error"
        title={t('errors.load')}
        actionLabel={t('retry')}
        onAction={() => void bankCards.retry()}
      />
    );

  return (
    <Box>
      <PageHeading title={t('title')} description={t('description')} />
      <Stack direction="row" justifyContent="flex-end" sx={styles.actions}>
        <Button startIcon={<Plus size={17} />} variant="contained" onClick={bankCards.openDialog}>
          {t('add')}
        </Button>
      </Stack>
      <BankCardList
        cards={bankCards.cards}
        defaultLabel={t('default')}
        deleteLabel={t('delete')}
        emptyLabel={t('empty')}
        pending={bankCards.mutationPending}
        setDefaultLabel={t('setDefault')}
        onRemove={bankCards.requestRemove}
        onSetDefault={bankCards.setDefault}
      />
      {bankCards.mutationError && (
        <Alert severity="error" sx={styles.feedback}>
          {t('errors.request')}
        </Alert>
      )}
      <AddBankCardDialog
        error={Boolean(bankCards.createError)}
        open={bankCards.dialogOpen}
        pending={bankCards.createPending}
        labels={{
          cancel: t('cancel'),
          cardNumber: t('cardNumber'),
          dialogTitle: t('dialogTitle'),
          error: t('errors.request'),
          iban: t('iban'),
          ownershipNotice: t('ownershipNotice'),
          save: t('save'),
          saving: t('saving'),
          validation: {
            cardInvalid: t('validation.cardInvalid'),
            cardRequired: t('validation.cardRequired'),
            ibanInvalid: t('validation.ibanInvalid'),
            ibanRequired: t('validation.ibanRequired'),
          },
        }}
        onClose={bankCards.closeDialog}
        onSave={bankCards.save}
      />
      <RemoveBankCardDialog
        open={bankCards.removeDialogOpen}
        pending={bankCards.removePending}
        labels={{
          cancel: t('cancel'),
          confirm: t('remove.confirm'),
          description: t('remove.description'),
          title: t('remove.title'),
        }}
        onClose={bankCards.cancelRemove}
        onConfirm={bankCards.confirmRemove}
      />
    </Box>
  );
}
