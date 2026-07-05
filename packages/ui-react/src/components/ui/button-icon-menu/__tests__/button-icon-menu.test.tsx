import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ButtonIconMenu } from '../button-icon-menu';

describe('ButtonIconMenu', () => {
  it('renders an icon button with a default accessible name', () => {
    render(<ButtonIconMenu />);
    const button = screen.getByRole('button', { name: 'More options' });
    expect(button).toBeInTheDocument();
    expect(button.querySelector('svg')).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-haspopup', 'menu');
  });

  it('uses a custom accessible name when provided', () => {
    render(<ButtonIconMenu aria-label="Row actions" />);
    expect(
      screen.getByRole('button', { name: 'Row actions' })
    ).toBeInTheDocument();
  });

  it('reuses the ButtonIcon secondary token classes', () => {
    render(<ButtonIconMenu />);
    expect(screen.getByRole('button', { name: 'More options' })).toHaveClass(
      'size-[var(--ui-button-icon-global-container-height)]',
      'bg-[var(--ui-button-icon-global-container-color-idle)]',
      'border-[var(--ui-button-icon-secondary-container-border-color-idle)]'
    );
  });

  it('is closed by default: no data-open, no aria-expanded', () => {
    render(<ButtonIconMenu />);
    const button = screen.getByRole('button', { name: 'More options' });
    expect(button).not.toHaveAttribute('data-open');
    expect(button).not.toHaveAttribute('aria-expanded');
  });

  it('reflects the open state via data-open, aria-expanded, and active tokens', () => {
    render(<ButtonIconMenu open />);
    const button = screen.getByRole('button', { name: 'More options' });
    expect(button).toHaveAttribute('data-open');
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveClass(
      'data-[open]:bg-[var(--ui-button-icon-global-container-color-active)]'
    );
  });

  it('merges a custom className with the base classes', () => {
    render(<ButtonIconMenu className="custom-class" />);
    expect(screen.getByRole('button', { name: 'More options' })).toHaveClass(
      'custom-class',
      'size-[var(--ui-button-icon-global-container-height)]'
    );
  });

  it('fires onClick when pressed', async () => {
    const onClick = vi.fn();
    render(<ButtonIconMenu onClick={onClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'More options' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    render(<ButtonIconMenu disabled onClick={onClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'More options' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards the ref to the underlying button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<ButtonIconMenu ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('composes with another element via the render prop', () => {
    render(<ButtonIconMenu render={<a href="/menu" />} aria-label="Open menu" />);
    const link = screen.getByRole('link', { name: 'Open menu' });
    expect(link).toHaveAttribute('href', '/menu');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
