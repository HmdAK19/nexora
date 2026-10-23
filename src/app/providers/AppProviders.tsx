import { useMemo, type PropsWithChildren } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider } from '@mui/material';

import { AuthProvider } from '@features/auth/context';
import { queryClient } from '@shared/api';
import { useLanguage } from '@shared/hooks';

import i18n from '../i18n/config';
import { persistor, store, useAppSelector } from '../store';
import { createAppTheme } from '../theme';
import { LanguageProvider } from './language';

function DirectionalTheme({ children }: PropsWithChildren) {
  const { dir } = useLanguage();
  const colorMode = useAppSelector((state) => state.preferences.colorMode);
  const theme = useMemo(() => createAppTheme(colorMode, dir), [colorMode, dir]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
        <Provider store={store}>
          <PersistGate persistor={persistor} loading={null}>
            <DirectionalTheme>
              <QueryClientProvider client={queryClient}>
                <AuthProvider>{children}</AuthProvider>
              </QueryClientProvider>
            </DirectionalTheme>
          </PersistGate>
        </Provider>
      </LanguageProvider>
    </I18nextProvider>
  );
}
