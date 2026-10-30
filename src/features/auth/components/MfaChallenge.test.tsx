import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { MfaChallenge } from './MfaChallenge';

describe('MfaChallenge', () => {
  it('normalizes authenticator input and exposes recovery mode', async () => {
    const interaction = userEvent.setup();
    const onToggleRecovery = vi.fn();
    function Probe() {
      const [code, setCode] = useState('');
      return (
        <MfaChallenge
          code={code}
          label="Authenticator code"
          onChange={setCode}
          onToggleRecovery={onToggleRecovery}
          recoveryLabel="Use recovery code"
          recoveryMode={false}
          title="Verify"
        />
      );
    }
    render(<Probe />);

    await interaction.type(screen.getByLabelText('Authenticator code'), '12a34567');
    expect(screen.getByLabelText('Authenticator code')).toHaveValue('123456');
    await interaction.click(screen.getByRole('button', { name: 'Use recovery code' }));
    expect(onToggleRecovery).toHaveBeenCalledOnce();
  });
});
import { useState } from 'react';
