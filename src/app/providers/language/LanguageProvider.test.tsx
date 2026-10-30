import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { LANGUAGE_STORAGE_KEY } from '@shared/constants';
import { useLanguage } from '@shared/hooks';

import { LanguageProvider } from './LanguageProvider';

function LanguageProbe() {
  const { dir, lang, toggleLanguage } = useLanguage();

  return (
    <button onClick={toggleLanguage} type="button">
      {lang}:{dir}
    </button>
  );
}

describe('LanguageProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = '';
    document.documentElement.dir = '';
  });

  it('uses English as the default and keeps the document direction in sync', async () => {
    render(
      <LanguageProvider>
        <LanguageProbe />
      </LanguageProvider>
    );

    expect(screen.getByRole('button')).toHaveTextContent('en:ltr');

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('lang', 'en');
      expect(document.documentElement).toHaveAttribute('dir', 'ltr');
    });
  });

  it('toggles and persists the active language', async () => {
    render(
      <LanguageProvider>
        <LanguageProbe />
      </LanguageProvider>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('button')).toHaveTextContent('fa:rtl');
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('fa');

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('lang', 'fa');
      expect(document.documentElement).toHaveAttribute('dir', 'rtl');
    });
  });
});
