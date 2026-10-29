import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { AddBankCardDialog } from './AddBankCardDialog';

const labels = {
  cancel: 'Cancel',
  cardNumber: 'Card number',
  dialogTitle: 'Add bank card',
  error: 'Request failed',
  iban: 'IBAN',
  ownershipNotice: 'The card must belong to you.',
  save: 'Save',
  saving: 'Saving',
  validation: {
    cardInvalid: 'Invalid card',
    cardRequired: 'Card required',
    ibanInvalid: 'Invalid IBAN',
    ibanRequired: 'IBAN required',
  },
};

describe('AddBankCardDialog', () => {
  it('shows localized field errors and blocks invalid submission', async () => {
    const onSave = vi.fn();
    render(
      <AddBankCardDialog
        error={false}
        labels={labels}
        onClose={vi.fn()}
        onSave={onSave}
        open
        pending={false}
      />
    );

    fireEvent.change(screen.getByLabelText('Card number'), { target: { value: '1111111111111111' } });
    fireEvent.blur(screen.getByLabelText('Card number'));
    fireEvent.change(screen.getByLabelText('IBAN'), { target: { value: 'IR00' } });
    fireEvent.blur(screen.getByLabelText('IBAN'));

    expect(await screen.findByText('Invalid card')).toBeVisible();
    expect(await screen.findByText('Invalid IBAN')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('normalizes valid values, submits once and has no detectable accessibility violation', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const { container } = render(
      <AddBankCardDialog
        error={false}
        labels={labels}
        onClose={vi.fn()}
        onSave={onSave}
        open
        pending={false}
      />
    );

    await user.type(screen.getByLabelText('Card number'), '6037 9975 1234 5670');
    await user.tab();
    await user.type(screen.getByLabelText('IBAN'), 'ir82 0540 1026 8002 0817 9090 02');
    await user.tab();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled());
    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledOnce());
    expect(onSave).toHaveBeenCalledWith(
      { number: '6037997512345670', iban: 'IR820540102680020817909002' },
      expect.anything()
    );
    expect((await axe(container)).violations).toEqual([]);
  });
});
