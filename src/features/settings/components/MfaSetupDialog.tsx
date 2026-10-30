import { Copy, ShieldCheck } from 'lucide-react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import type { MfaSetup } from '../model';
import { styles } from '../Settings.styles';

interface MfaSetupDialogProps {
  code: string;
  enabled: boolean;
  errorMessage?: string;
  labels: {
    cancel: string;
    code: string;
    confirm: string;
    copy: string;
    disable: string;
    disableHint: string;
    done: string;
    password: string;
    recoveryHint: string;
    recoveryTitle: string;
    setup: string;
    setupHint: string;
    title: string;
  };
  onBegin: () => void;
  onClose: () => void;
  onCodeChange: (value: string) => void;
  onConfirm: () => void;
  onCopy: (value: string) => void;
  onDisable: () => void;
  onPasswordChange: (value: string) => void;
  open: boolean;
  password: string;
  pending: boolean;
  recoveryCodes?: string[];
  setup?: MfaSetup;
}

export function MfaSetupDialog(props: MfaSetupDialogProps) {
  const { labels } = props;
  const validCode = /^\d{6}$/.test(props.code);

  return (
    <Dialog fullWidth maxWidth="xs" onClose={props.pending ? undefined : props.onClose} open={props.open}>
      <DialogTitle>{labels.title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={styles.dialogContent}>
          {props.recoveryCodes ? (
            <>
              <Alert severity="warning">{labels.recoveryHint}</Alert>
              <Typography fontWeight={750}>{labels.recoveryTitle}</Typography>
              <Box
                sx={{
                  display: 'grid',
                  gap: 1,
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                }}
              >
                {props.recoveryCodes.map((code) => (
                  <Box
                    component="code"
                    dir="ltr"
                    key={code}
                    sx={{ bgcolor: 'action.hover', borderRadius: 1, p: 1, textAlign: 'center' }}
                  >
                    {code}
                  </Box>
                ))}
              </Box>
            </>
          ) : props.enabled ? (
            <>
              <Typography color="text.secondary">{labels.disableHint}</Typography>
              <TextField
                autoComplete="current-password"
                label={labels.password}
                onChange={(event) => props.onPasswordChange(event.target.value)}
                type="password"
                value={props.password}
              />
              <TextField
                autoComplete="one-time-code"
                label={labels.code}
                onChange={(event) => props.onCodeChange(event.target.value.replace(/\D/g, '').slice(0, 6))}
                value={props.code}
              />
            </>
          ) : props.setup ? (
            <>
              <Alert icon={<ShieldCheck size={20} />} severity="info">
                {labels.setupHint}
              </Alert>
              <TextField
                label="Secret"
                value={props.setup.secret}
                slotProps={{
                  input: {
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={labels.copy}
                          onClick={() => props.setup && props.onCopy(props.setup.secret)}
                        >
                          <Copy size={17} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                autoComplete="one-time-code"
                autoFocus
                label={labels.code}
                onChange={(event) => props.onCodeChange(event.target.value.replace(/\D/g, '').slice(0, 6))}
                value={props.code}
              />
            </>
          ) : (
            <>
              <Typography color="text.secondary">{labels.setupHint}</Typography>
              <TextField
                autoComplete="current-password"
                autoFocus
                label={labels.password}
                onChange={(event) => props.onPasswordChange(event.target.value)}
                type="password"
                value={props.password}
              />
            </>
          )}
          {props.errorMessage && <Alert severity="error">{props.errorMessage}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        {!props.recoveryCodes && <Button onClick={props.onClose}>{labels.cancel}</Button>}
        {props.recoveryCodes ? (
          <Button onClick={props.onClose} variant="contained">
            {labels.done}
          </Button>
        ) : props.enabled ? (
          <Button
            color="error"
            disabled={props.password.length < 8 || !validCode}
            loading={props.pending}
            onClick={props.onDisable}
          >
            {labels.disable}
          </Button>
        ) : props.setup ? (
          <Button disabled={!validCode} loading={props.pending} onClick={props.onConfirm} variant="contained">
            {labels.confirm}
          </Button>
        ) : (
          <Button
            disabled={props.password.length < 8}
            loading={props.pending}
            onClick={props.onBegin}
            variant="contained"
          >
            {labels.setup}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
