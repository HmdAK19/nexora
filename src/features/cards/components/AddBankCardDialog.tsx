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
  Stack,
  TextField,
} from '@mui/material';

import { createCardSchema } from '../lib';
import type { AddBankCardInput } from '../model';

interface AddBankCardDialogProps {
  error: boolean;
  open: boolean;
  pending: boolean;
  labels: {
    cancel: string;
    cardNumber: string;
    dialogTitle: string;
    error: string;
    iban: string;
    ownershipNotice: string;
    save: string;
    saving: string;
    validation: { cardInvalid: string; cardRequired: string; ibanInvalid: string; ibanRequired: string };
  };
  onClose: () => void;
  onSave: (input: AddBankCardInput) => void;
}

export function AddBankCardDialog(props: AddBankCardDialogProps) {
  const schema = useMemo(() => createCardSchema(props.labels.validation), [props.labels.validation]);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<AddBankCardInput>({
    defaultValues: { iban: '', number: '' },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!props.open) reset();
  }, [props.open, reset]);

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="sm">
      <DialogTitle>{props.labels.dialogTitle}</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          id="add-bank-card-form"
          noValidate
          onSubmit={(event) => void handleSubmit(props.onSave)(event)}
        >
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Alert severity="info">{props.labels.ownershipNotice}</Alert>
            {props.error && <Alert severity="error">{props.labels.error}</Alert>}
            <Controller
              name="number"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  autoFocus
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  label={props.labels.cardNumber}
                  slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 19 } }}
                />
              )}
            />
            <Controller
              name="iban"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  label={props.labels.iban}
                  placeholder="IR000000000000000000000000"
                />
              )}
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button disabled={props.pending} onClick={props.onClose}>
          {props.labels.cancel}
        </Button>
        <Button
          form="add-bank-card-form"
          type="submit"
          variant="contained"
          disabled={!isValid || props.pending}
        >
          {props.pending ? props.labels.saving : props.labels.save}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
