import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { AppProviders } from '@app/providers';
import { router } from '@app/router';
import '@app/i18n';

export function bootstrap(root: HTMLElement) {
  createRoot(root).render(
    <StrictMode>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </StrictMode>
  );
}
