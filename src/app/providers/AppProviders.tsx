import { useMemo, type PropsWithChildren } from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider } from '@mui/material';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';

import { AuthProvider } from '@features/auth/context';
import { queryClient } from '@shared/api';
import { useLanguage } from '@shared/hooks';

import i18n from '../i18n/config';
import { persistor, store, useAppSelector } from '../store';
import { createAppTheme } from '../theme';
import { LanguageProvider } from './language';

const directionalStyleCaches = {
  ltr: createCache({ key: 'mui-ltr', prepend: true, stylisPlugins: [prefixer] }),
  rtl: createCache({ key: 'mui-rtl', prepend: true, stylisPlugins: [prefixer, rtlPlugin] }),
};

function DirectionalTheme({ children }: PropsWithChildren) {
  const { dir } = useLanguage();
  const colorMode = useAppSelector((state) => state.preferences.colorMode);
  const theme = useMemo(() => createAppTheme(colorMode, dir), [colorMode, dir]);
  return (
    <CacheProvider value={directionalStyleCaches[dir]}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
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
