import { ShieldCheck, UserRound } from 'lucide-react';
import { Box, Button, Stack, Typography } from '@mui/material';

export interface DemoAccount {
  email: string;
  password: string;
  role: 'admin' | 'customer';
  roleLabel: string;
}

interface DemoAccountSelectorProps {
  accounts: readonly DemoAccount[];
  emailLabel: string;
  onSelect: (account: DemoAccount) => void;
  passwordLabel: string;
  selectLabel: string;
  title: string;
}

export function DemoAccountSelector({
  accounts,
  emailLabel,
  onSelect,
  passwordLabel,
  selectLabel,
  title,
}: DemoAccountSelectorProps) {
  return (
    <Stack aria-label={title} component="section" spacing={1.25}>
      <Typography color="text.secondary" fontWeight={600} variant="caption">
        {title}
      </Typography>
      {accounts.map((account) => {
        const RoleIcon = account.role === 'admin' ? ShieldCheck : UserRound;

        return (
          <Button
            aria-label={`${selectLabel}: ${account.roleLabel}`}
            key={account.role}
            onClick={() => onSelect(account)}
            type="button"
            variant="outlined"
            sx={{
              alignItems: 'stretch',
              borderColor: 'divider',
              borderRadius: 2.5,
              justifyContent: 'flex-start',
              px: 2,
              py: 1.4,
              textAlign: 'start',
              textTransform: 'none',
            }}
          >
            <Box
              sx={{
                alignItems: 'center',
                bgcolor: account.role === 'admin' ? 'primary.main' : 'action.selected',
                borderRadius: 2,
                color: account.role === 'admin' ? 'primary.contrastText' : 'text.secondary',
                display: 'flex',
                height: 38,
                justifyContent: 'center',
                me: 1.5,
                minWidth: 38,
              }}
            >
              <RoleIcon aria-hidden="true" size={19} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography color="text.primary" fontWeight={700} variant="body2">
                {account.roleLabel}
              </Typography>
              <Typography color="text.secondary" sx={{ overflowWrap: 'anywhere' }} variant="caption">
                {emailLabel}: {account.email} · {passwordLabel}: {account.password}
              </Typography>
            </Box>
          </Button>
        );
      })}
    </Stack>
  );
}
