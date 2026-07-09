import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { CheckboxGroup } from '../index';
import { Checkbox } from '../../checkbox';

function Group({
  onValueChange,
}: {
  onValueChange?: (value: string[]) => void;
}) {
  return (
    <CheckboxGroup defaultValue={['email']} onValueChange={onValueChange}>
      <Checkbox name="email" label="Email" />
      <Checkbox name="sms" label="SMS" />
      <Checkbox name="push" label="Push" />
    </CheckboxGroup>
  );
}

describe('CheckboxGroup', () => {
  it('renders all member checkboxes', () => {
    render(<Group />);
    expect(screen.getAllByRole('checkbox')).toHaveLength(3);
  });

  it('reflects the default value as checked members', () => {
    render(<Group />);
    expect(screen.getByRole('checkbox', { name: 'Email' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'SMS' })).not.toBeChecked();
  });

  it('reports the ticked members via onValueChange', async () => {
    const onValueChange = vi.fn();
    render(<Group onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('checkbox', { name: 'SMS' }));
    expect(onValueChange).toHaveBeenLastCalledWith(
      expect.arrayContaining(['email', 'sms']),
      expect.anything()
    );
  });
});
