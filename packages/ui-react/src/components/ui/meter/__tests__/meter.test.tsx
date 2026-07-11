import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Meter, MeterLabel, MeterValue, MeterTrack } from '../index';

function Usage({ value = 72 }: { value?: number }) {
  return (
    <Meter value={value}>
      <MeterLabel>Storage used</MeterLabel>
      <MeterValue />
      <MeterTrack />
    </Meter>
  );
}

describe('Meter', () => {
  it('exposes the meter role with the current value', () => {
    render(<Usage />);
    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('aria-valuenow', '72');
  });

  it('renders the label and the formatted value', () => {
    render(<Usage value={40} />);
    expect(screen.getByText('Storage used')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
  });

  it('formats the value with the given Intl options', () => {
    render(
      <Meter
        value={512}
        min={0}
        max={1024}
        format={{ style: 'unit', unit: 'gigabyte' }}
      >
        <MeterValue />
        <MeterTrack />
      </Meter>
    );
    expect(screen.getByText(/512/)).toBeInTheDocument();
  });
});
