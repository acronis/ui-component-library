import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { OTPField, OTPFieldInput } from '../index';

function Code({
  length = 4,
  defaultValue,
}: {
  length?: number;
  defaultValue?: string;
}) {
  return (
    <OTPField length={length} defaultValue={defaultValue}>
      {Array.from({ length }).map((_, i) => (
        <OTPFieldInput key={i} />
      ))}
    </OTPField>
  );
}

const slots = () => screen.getAllByRole('textbox') as HTMLInputElement[];

describe('OTPField', () => {
  it('renders one input slot per length', () => {
    render(<Code length={6} />);
    expect(slots()).toHaveLength(6);
  });

  it('distributes a default value across the slots', () => {
    render(<Code length={4} defaultValue="1234" />);
    expect(slots().map((s) => s.value)).toEqual(['1', '2', '3', '4']);
  });

  it('fills slots as the user types', async () => {
    render(<Code length={4} />);
    slots()[0].focus();
    await userEvent.keyboard('42');
    expect(slots()[0].value).toBe('4');
    expect(slots()[1].value).toBe('2');
  });
});
