import { ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import i18n from '@app/i18n/config';
import { createAppTheme } from '@app/theme';
import type { User } from '@shared/model';

import { UserMenu } from './UserMenu';

const user: User = {
  id: 'user-1',
  name: 'Hamed Akbarzadeh',
  email: 'hamed@example.com',
  level: 'verified',
  permissions: [],
  role: 'customer',
};

function renderMenu(props?: { onSignOut?: () => void }) {
  return render(
    <ThemeProvider theme={createAppTheme('dark', 'rtl')}>
      <UserMenu onSignOut={props?.onSignOut ?? vi.fn()} user={user} />
    </ThemeProvider>
  );
}

describe('UserMenu', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('fa');
  });

  it('exposes account identity and actions from an accessible menu trigger', async () => {
    const interaction = userEvent.setup();
    renderMenu();

    const trigger = screen.getByRole('button', { name: 'باز کردن منوی حساب کاربری' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await interaction.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(user.email)).toBeVisible();
    expect(screen.getByRole('menuitem', { name: /خروج/ })).toBeVisible();
  });

  it('runs the selected action once and closes the menu', async () => {
    const interaction = userEvent.setup();
    const onSignOut = vi.fn();
    renderMenu({ onSignOut });

    const trigger = screen.getByRole('button', { name: 'باز کردن منوی حساب کاربری' });
    await interaction.click(trigger);
    await interaction.click(screen.getByRole('menuitem', { name: /خروج/ }));

    expect(onSignOut).toHaveBeenCalledOnce();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
