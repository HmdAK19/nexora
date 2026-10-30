import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import i18n from '@app/i18n/config';
import { createAppTheme } from '@app/theme';

import { LanguageSwitcher } from './LanguageSwitcher';

describe('LanguageSwitcher', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('fa');
  });

  it('shows the current language and invokes the toggle action', async () => {
    const interaction = userEvent.setup();
    const onToggle = vi.fn();

    render(
      <ThemeProvider theme={createAppTheme('dark', 'rtl')}>
        <LanguageSwitcher language="fa" onToggle={onToggle} />
      </ThemeProvider>
    );

    expect(screen.getByText('FA')).toBeVisible();
    await interaction.click(screen.getByRole('button', { name: /English/ }));
    expect(onToggle).toHaveBeenCalledOnce();
  });
});
