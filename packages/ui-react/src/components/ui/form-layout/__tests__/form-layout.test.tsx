import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { FormLayout, type FormLayoutField } from '../form-layout';

const FIELDS: FormLayoutField[] = [
  { name: 'name', label: 'Full name', required: true },
  { name: 'bio', label: 'Bio', type: 'textarea' },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    options: [
      { value: 'admin', label: 'Admin' },
      { value: 'member', label: 'Member' },
    ],
  },
  { name: 'notify', label: 'Email notifications', type: 'switch' },
  { name: 'terms', label: 'Accept terms', type: 'checkbox' },
  {
    name: 'plan',
    label: 'Plan',
    type: 'radio',
    options: [
      { value: 'free', label: 'Free' },
      { value: 'pro', label: 'Pro' },
    ],
  },
];

function Harness({
  onValueChange,
  ...rest
}: {
  onValueChange?: (name: string, value: unknown) => void;
  errors?: Record<string, string>;
  onSubmit?: (values: Record<string, unknown>) => void;
}) {
  const [values, setValues] = useState<Record<string, unknown>>({});
  return (
    <FormLayout
      fields={FIELDS}
      values={values}
      onValueChange={(name, value) => {
        setValues((v) => ({ ...v, [name]: value }));
        onValueChange?.(name, value);
      }}
      {...rest}
    />
  );
}

describe('FormLayout', () => {
  it('renders a labeled control per field', () => {
    render(<Harness />);
    expect(screen.getByText('Full name')).toBeVisible();
    expect(screen.getByText('Bio')).toBeVisible();
    expect(screen.getByText('Role')).toBeVisible();
    expect(
      screen.getByRole('switch', { name: 'Email notifications' })
    ).toBeInTheDocument();
    expect(screen.getByText('Accept terms')).toBeVisible();
    expect(screen.getByText('Plan')).toBeVisible();
  });

  it('marks required fields', () => {
    render(<Harness />);
    // The required marker sits next to the label text.
    expect(screen.getByText('Full name').textContent).toContain('*');
  });

  it('reports text edits via onValueChange(name, value)', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);
    const input = screen.getByRole('textbox', { name: /full name/i });
    await user.type(input, 'A');
    expect(onValueChange).toHaveBeenCalledWith('name', 'A');
  });

  it('reports switch toggles via onValueChange', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);
    await user.click(
      screen.getByRole('switch', { name: 'Email notifications' })
    );
    expect(onValueChange).toHaveBeenCalledWith('notify', true);
  });

  it('reports checkbox toggles via onValueChange', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);
    await user.click(screen.getByRole('checkbox', { name: /accept terms/i }));
    expect(onValueChange).toHaveBeenCalledWith('terms', true);
  });

  it('reports radio selection via onValueChange', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);
    // The radio is labeled by its wrapping <label>; clicking the text selects it.
    await user.click(screen.getByText('Pro'));
    expect(onValueChange).toHaveBeenCalledWith('plan', 'pro');
  });

  it('shows per-field error messages', () => {
    render(<Harness errors={{ name: 'Name is required.' }} />);
    expect(screen.getByText('Name is required.')).toBeVisible();
  });

  it('submits the current values', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Harness onSubmit={onSubmit} />);
    // Fill the one required field so native validation lets the form submit.
    await user.type(screen.getByRole('textbox', { name: /full name/i }), 'Ada');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('disables the whole form', () => {
    render(
      <FormLayout
        fields={FIELDS}
        values={{}}
        onValueChange={() => {}}
        disabled
      />
    );
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });
});
