import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Box,
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
import { useTranslation } from 'react-i18next';

import { getSupportErrorKey, createSupportTicketSchema } from '../lib';
import {
  initialTicketFormValues,
  supportCategories,
  supportLimits,
  type CreateTicketFormValues,
} from '../model';
import { supportStyles } from '../Support.styles';

interface CreateTicketDialogProps {
  error: unknown;
  onClose: () => void;
  onSubmit: (values: CreateTicketFormValues) => void;
  open: boolean;
  pending: boolean;
}

export function CreateTicketDialog({ error, onClose, onSubmit, open, pending }: CreateTicketDialogProps) {
  const { t } = useTranslation(NAMESPACES.support);
  const messages = useMemo(
    () => ({
      messageMax: t('validation.messageMax', { max: supportLimits.messageMaxLength }),
      messageMin: t('validation.messageMin', { min: supportLimits.messageMinLength }),
      messageRequired: t('validation.messageRequired'),
      subjectMax: t('validation.subjectMax', { max: supportLimits.subjectMaxLength }),
      subjectMin: t('validation.subjectMin', { min: supportLimits.subjectMinLength }),
      subjectRequired: t('validation.subjectRequired'),
    }),
    [t]
  );
  const schema = useMemo(() => createSupportTicketSchema(messages), [messages]);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<CreateTicketFormValues>({
    defaultValues: initialTicketFormValues,
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!open) reset(initialTicketFormValues);
  }, [open, reset]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('create.title')}</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          id="create-support-ticket-form"
          noValidate
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
        >
          <Stack spacing={2} sx={supportStyles.dialogFields}>
            {Boolean(error) && <Alert severity="error">{t(getSupportErrorKey(error))}</Alert>}
            <Controller
              name="subject"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  autoFocus
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  label={t('fields.subject')}
                  slotProps={{ htmlInput: { maxLength: supportLimits.subjectMaxLength } }}
                />
              )}
            />
            <Controller
              name="category"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  label={t('fields.category')}
                >
                  {supportCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {t(`category.${category}`)}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="message"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  label={t('fields.message')}
                  minRows={5}
                  multiline
                  slotProps={{ htmlInput: { maxLength: supportLimits.messageMaxLength } }}
                />
              )}
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button disabled={pending} onClick={onClose}>
          {t('actions.cancel')}
        </Button>
        <Button
          form="create-support-ticket-form"
          type="submit"
          disabled={!isValid || pending}
          variant="contained"
        >
          {pending ? t('actions.submitting') : t('actions.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
