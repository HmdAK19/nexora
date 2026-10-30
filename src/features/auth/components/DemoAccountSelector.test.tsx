import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DemoAccountSelector, type DemoAccount } from './DemoAccountSelector';

const accounts: readonly DemoAccount[] = [
  {
    email: 'demo@nexora.dev',
    password: 'Admin123!',
    role: 'admin',
    roleLabel: 'Administrator demo',
  },
  {
    email: 'customer@nexora.dev',
    password: 'Nexora123!',
    role: 'customer',
    roleLabel: 'Customer demo',
  },
];

describe('DemoAccountSelector', () => {
  it('shows both public credentials and selects the requested account', async () => {
    const interaction = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <DemoAccountSelector
        accounts={accounts}
        emailLabel="Email"
        onSelect={onSelect}
        passwordLabel="Password"
        selectLabel="Use demo account"
        title="Demo accounts"
      />
    );

    expect(screen.getByText('demo@nexora.dev')).toBeVisible();
    expect(screen.getByText('Admin123!')).toBeVisible();
    expect(screen.getByText('customer@nexora.dev')).toBeVisible();
    expect(screen.getByText('Nexora123!')).toBeVisible();

    await interaction.click(screen.getByRole('button', { name: /Use demo account: Administrator demo/ }));

    expect(onSelect).toHaveBeenCalledWith(accounts[0]);
  });
});
