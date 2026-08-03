import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from '../index';

const items = ['Australia', 'Austria', 'Belgium', 'Canada'];

function Demo() {
  return (
    <Autocomplete items={items}>
      <AutocompleteInput placeholder="Search country…" />
      <AutocompleteContent>
        <AutocompleteEmpty>No results.</AutocompleteEmpty>
        <AutocompleteList>
          {(item: string) => (
            <AutocompleteItem key={item} value={item}>
              {item}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  );
}

describe('Autocomplete', () => {
  it('opens and lists matching suggestions as the user types', async () => {
    render(<Demo />);
    await userEvent.type(screen.getByPlaceholderText('Search country…'), 'a');
    expect(
      screen.getByRole('option', { name: 'Australia' })
    ).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Canada' })).toBeInTheDocument();
  });

  it('scrolls the list in a ScrollArea, with the clamp on the viewport', async () => {
    render(<Demo />);
    await userEvent.type(screen.getByPlaceholderText('Search country…'), 'a');
    const viewport = document.querySelector(
      '[data-slot="scroll-area-viewport"]'
    ) as HTMLElement;
    expect(viewport).toBeInTheDocument();
    expect(viewport).toContainElement(
      screen.getByRole('option', { name: 'Australia' })
    );
    // See input-select: on the Root this bound silently does nothing.
    expect(viewport).toHaveClass('max-h-[var(--available-height)]');
    expect(document.querySelector('[data-slot="scroll-area"]')).not.toHaveClass(
      'max-h-[var(--available-height)]'
    );
  });

  it('filters suggestions by the typed value', async () => {
    render(<Demo />);
    await userEvent.type(screen.getByPlaceholderText('Search country…'), 'Aus');
    expect(
      screen.getByRole('option', { name: 'Australia' })
    ).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Austria' })).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: 'Belgium' })
    ).not.toBeInTheDocument();
  });

  it('keeps free text that matches no suggestion', async () => {
    render(<Demo />);
    const input = screen.getByPlaceholderText(
      'Search country…'
    ) as HTMLInputElement;
    await userEvent.type(input, 'Narnia');
    expect(input.value).toBe('Narnia');
    expect(screen.getByText('No results.')).toBeInTheDocument();
  });
});
