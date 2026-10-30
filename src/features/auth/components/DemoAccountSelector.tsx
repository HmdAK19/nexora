import { ShieldCheck, UserRound } from 'lucide-react';
import { Box, Button, Typography } from '@mui/material';

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
    <Box aria-label={title} component="section">
      <Typography color="text.secondary" fontSize={10.5} fontWeight={700} mb={0.5} px={0.25}>
        {title}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gap: 0.75,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        {accounts.map((account) => {
          const RoleIcon = account.role === 'admin' ? ShieldCheck : UserRound;

          return (
            <Button
              aria-label={`${selectLabel}: ${account.roleLabel}; ${emailLabel}: ${account.email}; ${passwordLabel}: ${account.password}`}
              key={account.role}
              onClick={() => onSelect(account)}
              type="button"
              variant="outlined"
              sx={{
                alignItems: 'center',
                borderColor: 'divider',
                borderRadius: 2,
                gap: 0.75,
                justifyContent: 'flex-start',
                minHeight: 52,
                minWidth: 0,
                px: 0.9,
                py: 0.6,
                textAlign: 'start',
                textTransform: 'none',
              }}
            >
              <Box
                sx={{
                  alignItems: 'center',
                  bgcolor: account.role === 'admin' ? 'primary.main' : 'action.selected',
                  borderRadius: 1.25,
                  color: account.role === 'admin' ? 'primary.contrastText' : 'text.secondary',
                  display: 'flex',
                  flexShrink: 0,
                  height: 28,
                  justifyContent: 'center',
                  width: 28,
                }}
              >
                <RoleIcon aria-hidden="true" size={15} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography color="text.primary" fontSize={11.5} fontWeight={750} lineHeight={1.2}>
                  {account.roleLabel}
                </Typography>
                <Typography color="text.secondary" dir="ltr" fontSize={9.5} lineHeight={1.25} noWrap>
                  {account.email}
                </Typography>
                <Typography color="text.secondary" dir="ltr" fontSize={9.5} lineHeight={1.25} noWrap>
                  {account.password}
                </Typography>
              </Box>
            </Button>
          );
        })}
      </Box>
    </Box>
  );
}
