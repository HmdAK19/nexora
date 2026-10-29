import { useState } from 'react';

import { authApi } from '../api';

export type PasswordResetStatus = 'error' | 'idle' | 'pending' | 'sent';

export function usePasswordReset() {
  const [email, setEmailValue] = useState('');
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<PasswordResetStatus>('idle');
  const [touched, setTouched] = useState(false);
  const valid = /^\S+@\S+\.\S+$/.test(email);

  const setEmail = (value: string) => {
    setEmailValue(value);
    setStatus('idle');
  };

  const close = () => {
    setOpen(false);
    setEmailValue('');
    setStatus('idle');
    setTouched(false);
  };

  const submit = async () => {
    if (!valid || status === 'pending') return;

    setStatus('pending');

    try {
      await authApi.requestPasswordReset({ email });
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return {
    close,
    email,
    open,
    setEmail,
    setOpen,
    status,
    submit,
    touched,
    touch: () => setTouched(true),
    valid,
  };
}

export type PasswordResetController = ReturnType<typeof usePasswordReset>;
