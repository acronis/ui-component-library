import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { SearchGlobal } from '../search-global';

describe('SearchGlobal', () => {
  it('renders a search input with the default placeholder and shortcut', () => {
    render(<SearchGlobal />);
    const input = screen.getByRole('searchbox', { name: 'Search' });
    expect(input).toHaveAttribute('placeholder', 'Search anything');
    expect(screen.getByText('⌘K')).toBeInTheDocument();
  });

  it('accepts a custom placeholder and shortcut', () => {
    render(<SearchGlobal placeholder="Find anything" shortcut="/" />);
    expect(screen.getByRole('searchbox')).toHaveAttribute(
      'placeholder',
      'Find anything'
    );
    expect(screen.getByText('/')).toBeInTheDocument();
  });

  it('hides the shortcut hint when shortcut is null', () => {
    render(<SearchGlobal shortcut={null} />);
    expect(screen.queryByText('⌘K')).not.toBeInTheDocument();
  });

  it('marks the shortcut hint as decorative', () => {
    render(<SearchGlobal />);
    expect(screen.getByText('⌘K')).toHaveAttribute('aria-hidden', 'true');
  });

  it('forwards the ref to the input and accepts typing', async () => {
    const ref = createRef<HTMLInputElement>();
    render(<SearchGlobal ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);

    await userEvent.type(screen.getByRole('searchbox'), 'backup');
    expect(ref.current).toHaveValue('backup');
  });

  it('honors a custom aria-label', () => {
    render(<SearchGlobal aria-label="Global search" />);
    expect(
      screen.getByRole('searchbox', { name: 'Global search' })
    ).toBeInTheDocument();
  });

  it('uses tokenized border/icon/placeholder/shortcut colors', () => {
    const { container } = render(<SearchGlobal />);
    const root = container.firstElementChild as HTMLElement;
    const input = screen.getByRole('searchbox', { name: 'Search' });

    // The retired `--ui-search-global-*` tier is gone; each reference is now the
    // shared token that tier aliased.
    expect(root).toHaveClass(
      '[--sg-border:var(--ui-gradients-ai-idle)]',
      'hover:[--sg-border:var(--ui-gradients-ai-hover)]',
      'active:[--sg-border:var(--ui-gradients-ai-active)]',
      'focus-within:ring-[var(--ui-focus-primary)]'
    );
    expect(root.querySelector('svg')).toHaveClass(
      'text-[var(--ui-glyph-on-status-ai)]'
    );
    expect(input).toHaveClass('placeholder:text-[var(--ui-text-on-status-ai)]');
    expect(screen.getByText('⌘K')).toHaveClass(
      'text-[var(--ui-text-on-surface-secondary)]'
    );
  });
});
