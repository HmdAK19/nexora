import { KeyRound, ShieldCheck } from 'lucide-react';
import { Button, InputAdornment, Stack, TextField, Typography } from '@mui/material';

interface MfaChallengeProps {
  code: string;
  label: string;
  onChange: (value: string) => void;
  onToggleRecovery: () => void;
  recoveryLabel: string;
  recoveryMode: boolean;
  title: string;
}

export function MfaChallenge({
  code,
  label,
  onChange,
  onToggleRecovery,
  recoveryLabel,
  recoveryMode,
  title,
}: MfaChallengeProps) {
  return (
    <Stack spacing={1.25}>
      <Typography fontWeight={750}>{title}</Typography>
      <TextField
        autoComplete="one-time-code"
        autoFocus
        label={label}
        value={code}
        onChange={(event) => {
          const next = recoveryMode
            ? event.target.value
                .toUpperCase()
                .replace(/[^A-F0-9-]/g, '')
                .slice(0, 11)
            : event.target.value.replace(/\D/g, '').slice(0, 6);
          onChange(next);
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                {recoveryMode ? <KeyRound size={18} /> : <ShieldCheck size={18} />}
              </InputAdornment>
            ),
            inputProps: { inputMode: recoveryMode ? 'text' : 'numeric' },
          },
        }}
      />
      <Button onClick={onToggleRecovery} size="small" sx={{ alignSelf: 'flex-start' }} type="button">
        {recoveryLabel}
      </Button>
    </Stack>
  );
}
