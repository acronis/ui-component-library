import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { InputPassword } from '../input-password';

// `type="password"` inputs have no implicit ARIA role, so they are queried by
// label text rather than by role.
describe('InputPassword', () => {
  it('renders a labelled password input associated via htmlFor/id', () => {
    render(<InputPassword label="Password" placeholder="Password" />);
    const input = screen.getByLabelText('Password');
    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toHaveAttribute('placeholder', 'Password');
  });

  it('appends a required marker and sets aria-required', () => {
    render(<InputPassword label="Password" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
    // The required marker joins the label's text content, so match loosely.
    expect(screen.getByLabelText(/Password/)).toHaveAttribute(
      'aria-required',
      'true'
    );
  });

  it('renders a description associated via aria-describedby', () => {
    render(<InputPassword label="Password" description="At least 8 chars" />);
    const input = screen.getByLabelText('Password');
    const descId = input.getAttribute('aria-describedby');
    expect(descId).toBeTruthy();
    expect(screen.getByText('At least 8 chars')).toHaveAttribute(
      'id',
      descId as string
    );
  });

  it('switches to the error treatment when error is set', () => {
    render(
      <InputPassword label="Password" description="hint" error="Too short" />
    );
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Too short')).toBeInTheDocument();
    expect(screen.queryByText('hint')).not.toBeInTheDocument();
  });

  it('renders the reveal toggle in the error variant while the field errors', () => {
    render(<InputPassword label="Password" error="Too short" />);
    expect(screen.getByRole('button', { name: 'Show password' })).toHaveClass(
      'text-[var(--ui-button-icon-input-error-icon-color-idle)]'
    );
  });

  it('toggles the input between password and text when uncontrolled', async () => {
    render(<InputPassword label="Password" />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');

    await userEvent.click(
      screen.getByRole('button', { name: 'Show password' })
    );
    expect(input).toHaveAttribute('type', 'text');
    expect(
      screen.getByRole('button', { name: 'Hide password' })
    ).toHaveAttribute('aria-pressed', 'true');

    await userEvent.click(
      screen.getByRole('button', { name: 'Hide password' })
    );
    expect(input).toHaveAttribute('type', 'password');
  });

  it('honors defaultRevealed', () => {
    render(<InputPassword label="Password" defaultRevealed />);
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text');
  });

  it('stays controlled and reports changes via onRevealedChange', async () => {
    const onRevealedChange = vi.fn();
    render(
      <InputPassword
        label="Password"
        revealed={false}
        onRevealedChange={onRevealedChange}
      />
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Show password' })
    );
    expect(onRevealedChange).toHaveBeenCalledWith(true);
    // Controlled: the prop still wins.
    expect(screen.getByLabelText('Password')).toHaveAttribute(
      'type',
      'password'
    );
  });

  it('disables the reveal toggle along with the field', async () => {
    render(<InputPassword label="Password" disabled />);
    const toggle = screen.getByRole('button', { name: 'Show password' });
    expect(toggle).toBeDisabled();
    await userEvent.click(toggle);
    expect(screen.getByLabelText('Password')).toHaveAttribute(
      'type',
      'password'
    );
  });

  it('points the toggle at the input via aria-controls', () => {
    render(<InputPassword label="Password" id="pw" />);
    expect(
      screen.getByRole('button', { name: 'Show password' })
    ).toHaveAttribute('aria-controls', 'pw');
  });

  it('forwards the ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<InputPassword label="Password" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('forwards arbitrary input props', async () => {
    const onChange = vi.fn();
    render(<InputPassword label="Password" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText('Password'), 'a');
    expect(onChange).toHaveBeenCalled();
  });

  it('uses the input-password token tier, not the input-text one', () => {
    render(
      <InputPassword label="Password" required description="At least 8 chars" />
    );

    expect(screen.getByText('Password').closest('label')).toHaveClass(
      'text-[var(--ui-input-password-global-label-color-idle)]'
    );
    expect(screen.getByText('*')).toHaveClass(
      'text-[var(--ui-input-password-global-required-color)]'
    );
    expect(screen.getByText('At least 8 chars')).toHaveClass(
      'text-[var(--ui-input-password-normal-description-color-idle)]'
    );
    expect(screen.getByLabelText(/Password/)).toHaveClass(
      'bg-[var(--ui-input-password-global-box-color-idle)]'
    );
  });
});
