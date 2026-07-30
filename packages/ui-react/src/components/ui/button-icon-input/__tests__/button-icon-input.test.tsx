import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ButtonIconInput } from '../button-icon-input';

const Glyph = () => <svg data-testid="glyph" aria-hidden="true" />;

describe('ButtonIconInput', () => {
  it('renders a button with the icon as children and defaults to type="button"', () => {
    render(
      <ButtonIconInput aria-label="Clear">
        <Glyph />
      </ButtonIconInput>
    );
    const button = screen.getByRole('button', { name: 'Clear' });
    expect(button).toHaveAttribute('type', 'button');
    expect(screen.getByTestId('glyph')).toBeInTheDocument();
  });

  it('defaults to the normal variant and its token set', () => {
    render(
      <ButtonIconInput aria-label="Clear">
        <Glyph />
      </ButtonIconInput>
    );
    const button = screen.getByRole('button', { name: 'Clear' });
    expect(button).toHaveClass(
      'text-[var(--ui-button-icon-input-normal-icon-color-idle)]'
    );
    expect(button).toHaveClass('focus-visible:ring-[var(--ui-focus-primary)]');
  });

  it('wires the error variant to the error tokens and the error focus ring', () => {
    render(
      <ButtonIconInput aria-label="Clear" variant="error">
        <Glyph />
      </ButtonIconInput>
    );
    const button = screen.getByRole('button', { name: 'Clear' });
    expect(button).toHaveClass(
      'text-[var(--ui-button-icon-input-error-icon-color-idle)]'
    );
    expect(button).toHaveClass('focus-visible:ring-[var(--ui-focus-error)]');
  });

  it('falls back to the normal disabled icon color in the error variant', () => {
    // The `error` tier emits no `icon-color-disabled`; the normal one is reused.
    render(
      <ButtonIconInput aria-label="Clear" variant="error" disabled>
        <Glyph />
      </ButtonIconInput>
    );
    expect(screen.getByRole('button', { name: 'Clear' })).toHaveClass(
      'disabled:text-[var(--ui-button-icon-input-normal-icon-color-disabled)]'
    );
  });

  it('uses the 20x20 container geometry tokens', () => {
    render(
      <ButtonIconInput aria-label="Clear">
        <Glyph />
      </ButtonIconInput>
    );
    const button = screen.getByRole('button', { name: 'Clear' });
    expect(button).toHaveClass(
      'h-[var(--ui-button-icon-input-global-container-height)]'
    );
    expect(button).toHaveClass(
      'w-[var(--ui-button-icon-input-global-container-width)]'
    );
    expect(button).toHaveClass(
      'rounded-[var(--ui-button-icon-input-global-container-border-radius)]'
    );
  });

  it('fires onClick and suppresses it while disabled', async () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <ButtonIconInput aria-label="Clear" onClick={onClick}>
        <Glyph />
      </ButtonIconInput>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onClick).toHaveBeenCalledOnce();

    rerender(
      <ButtonIconInput aria-label="Clear" onClick={onClick} disabled>
        <Glyph />
      </ButtonIconInput>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('forwards the ref to the underlying button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <ButtonIconInput aria-label="Clear" ref={ref}>
        <Glyph />
      </ButtonIconInput>
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('supports the Base UI render prop', () => {
    render(
      <ButtonIconInput aria-label="Clear" render={<a href="#reset" />}>
        <Glyph />
      </ButtonIconInput>
    );
    const link = screen.getByRole('link', { name: 'Clear' });
    expect(link).toHaveClass(
      'text-[var(--ui-button-icon-input-normal-icon-color-idle)]'
    );
  });
});
