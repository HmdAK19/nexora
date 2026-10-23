import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  CircleDollarSign,
  FileCheck2,
  Headphones,
  LayoutDashboard,
  Search,
  Settings,
  WalletCards,
  type LucideIcon,
} from 'lucide-react';
import { Autocomplete, Box, InputAdornment, TextField, Typography } from '@mui/material';

import { styles } from './GlobalSearch.styles';

interface SearchOption {
  description: string;
  icon: LucideIcon;
  label: string;
  path: string;
}
export function GlobalSearch() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const options = useMemo<SearchOption[]>(
    () => [
      {
        label: t('nav.dashboard'),
        description: t('nav.search.dashboard'),
        path: '/',
        icon: LayoutDashboard,
      },
      {
        label: t('nav.markets'),
        description: t('nav.search.markets'),
        path: '/markets',
        icon: BarChart3,
      },
      {
        label: 'BTC / USDT',
        description: t('nav.search.bitcoin'),
        path: '/trade/BTC-USDT',
        icon: CircleDollarSign,
      },
      {
        label: 'ETH / USDT',
        description: t('nav.search.ethereum'),
        path: '/trade/ETH-USDT',
        icon: CircleDollarSign,
      },
      {
        label: 'SOL / USDT',
        description: t('nav.search.solana'),
        path: '/trade/SOL-USDT',
        icon: CircleDollarSign,
      },
      {
        label: t('nav.wallet'),
        description: t('nav.search.wallet'),
        path: '/wallet',
        icon: WalletCards,
      },
      {
        label: t('nav.verification'),
        description: t('nav.search.verification'),
        path: '/verification',
        icon: FileCheck2,
      },
      {
        label: t('nav.support'),
        description: t('nav.search.support'),
        path: '/support',
        icon: Headphones,
      },
      {
        label: t('nav.settings'),
        description: t('nav.search.settings'),
        path: '/settings',
        icon: Settings,
      },
    ],
    [t]
  );
  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', focusSearch);
    return () => window.removeEventListener('keydown', focusSearch);
  }, []);
  return (
    <Autocomplete<SearchOption, false, false, false>
      clearOnBlur
      options={options}
      onChange={(_, option) => {
        if (option) navigate(option.path);
      }}
      filterOptions={(items, state) => {
        const query = state.inputValue.trim().toLowerCase();
        return query
          ? items.filter((item) => `${item.label} ${item.description}`.toLowerCase().includes(query))
          : items;
      }}
      getOptionLabel={(option) => option.label}
      noOptionsText={t('nav.search.empty')}
      sx={styles.root}
      renderInput={(params) => (
        <TextField
          {...params}
          inputRef={inputRef}
          aria-label={t('common.search')}
          placeholder={`${t('common.search')}…`}
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={17} />
                </InputAdornment>
              ),
              endAdornment: (
                <>
                  <Box component="kbd" sx={styles.shortcut}>
                    Ctrl K
                  </Box>
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
      renderOption={(props, option) => {
        const Icon = option.icon;
        return (
          <Box component="li" {...props} key={option.path}>
            <Box sx={styles.option}>
              <Box sx={styles.optionIcon}>
                <Icon size={16} />
              </Box>
              <Box sx={styles.optionText}>
                <Typography fontWeight={700} noWrap variant="body2">
                  {option.label}
                </Typography>
                <Typography color="text.secondary" noWrap variant="caption">
                  {option.description}
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      }}
    />
  );
}
