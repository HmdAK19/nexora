import type { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';

import { NAMESPACES } from '@app/i18n';
import { getSupportErrorKey } from '../lib';
import { supportCategories, supportLimits, type CreateTicketFormValues } from '../model';
import { supportStyles } from '../Support.styles';

interface CreateTicketDialogProps {
  error: unknown;
  onClose: () => void;
  onSubmit: () => void;
  open: boolean;
  pending: boolean;
  setValues: Dispatch<SetStateAction<CreateTicketFormValues>>;
  valid: boolean;
  values: CreateTicketFormValues;
}

export function CreateTicketDialog({
  error,
  onClose,
  onSubmit,
  open,
  pending,
  setValues,
  valid,
  values,
}: CreateTicketDialogProps) {
  const { t } = useTranslation(NAMESPACES.support);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('create.title')}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={supportStyles.dialogFields}>
          {Boolean(error) && <Alert severity="error">{t(getSupportErrorKey(error))}</Alert>}
          <TextField
            autoFocus
            inputProps={{ maxLength: supportLimits.subjectMaxLength }}
            label={t('fields.subject')}
            value={values.subject}
            onChange={(event) => setValues((current) => ({ ...current, subject: event.target.value }))}
          />
          <TextField
            select
            label={t('fields.category')}
            value={values.category}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                category: event.target.value as CreateTicketFormValues['category'],
              }))
            }
          >
            {supportCategories.map((category) => (
              <MenuItem key={category} value={category}>
                {t(`category.${category}`)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            inputProps={{ maxLength: supportLimits.messageMaxLength }}
            label={t('fields.message')}
            minRows={5}
            multiline
            value={values.message}
            onChange={(event) => setValues((current) => ({ ...current, message: event.target.value }))}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={pending} onClick={onClose}>
          {t('actions.cancel')}
        </Button>
        <Button disabled={!valid || pending} onClick={onSubmit} variant="contained">
          {pending ? t('actions.submitting') : t('actions.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
