import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BrandLogo } from './BrandLogo';

describe('BrandLogo', () => {
  it('exposes the brand name while keeping the decorative mark hidden', () => {
    render(<BrandLogo />);

    expect(screen.getByLabelText('Nexora')).toHaveTextContent('Nexora');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('keeps an accessible name in compact mode', () => {
    render(<BrandLogo compact />);

    expect(screen.getByLabelText('Nexora')).toBeInTheDocument();
    expect(screen.queryByText('Nexora')).not.toBeInTheDocument();
  });
});
