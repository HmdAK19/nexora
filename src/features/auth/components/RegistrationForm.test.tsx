import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ThemeProvider } from '@mui/material/styles';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import i18n from '@app/i18n/config';
import { createAppTheme } from '@app/theme';

import {
  createRegistrationSchema,
  type RegistrationFormValues,
  type RegistrationValidationMessages,
} from '../model';

import { RegistrationForm } from './RegistrationForm';

describe('RegistrationForm', () => {
  const validationMessages = new Proxy({} as RegistrationValidationMessages, {
    get: () => 'Invalid value',
  });

  beforeEach(async () => {
    await i18n.changeLanguage('en');
  });

  it('wires every registration field to a single submit contract', async () => {
    const onValid = vi.fn();

    function Harness() {
      const form = useForm<RegistrationFormValues>({
        defaultValues: {
          acceptTerms: false,
          confirmPassword: '',
          email: '',
          name: '',
          password: '',
          phone: '',
        },
        mode: 'onChange',
        resolver: yupResolver(createRegistrationSchema(validationMessages)),
      });
      return (
        <ThemeProvider theme={createAppTheme('dark', 'ltr')}>
          <MemoryRouter>
            <RegistrationForm
              confirmPasswordVisible={false}
              form={form}
              onDismissError={vi.fn()}
              onSubmit={(event) => void form.handleSubmit(onValid)(event)}
              onToggleConfirmPassword={vi.fn()}
              onTogglePassword={vi.fn()}
              passwordVisible={false}
              serverError={null}
            />
          </MemoryRouter>
        </ThemeProvider>
      );
    }

    render(<Harness />);
    const submitButton = screen.getByRole('button', { name: 'Create account' });
    expect(submitButton).toBeDisabled();
    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'New User' } });
    fireEvent.change(screen.getByLabelText('Mobile number (optional)'), {
      target: { value: '+989121234567' },
    });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'StrongPass1!' } });
    fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'StrongPass1!' } });
    fireEvent.click(screen.getByRole('checkbox'));
    await waitFor(() => expect(submitButton).toBeEnabled());
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(onValid).toHaveBeenCalledWith(
        {
          acceptTerms: true,
          confirmPassword: 'StrongPass1!',
          email: 'new@example.com',
          name: 'New User',
          password: 'StrongPass1!',
          phone: '+989121234567',
        },
        expect.anything()
      )
    );
  }, 10_000);
});
