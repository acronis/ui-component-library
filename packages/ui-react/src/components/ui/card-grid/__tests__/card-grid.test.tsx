import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CardHeader, CardTitle } from '../../card';
import { CardGrid } from '../card-grid';

type Item = { id: string; name: string };

const ITEMS: Item[] = [
  { id: 'a', name: 'Slack' },
  { id: 'b', name: 'GitHub' },
  { id: 'c', name: 'Jira' },
];

const renderItem = (item: Item) => (
  <CardHeader>
    <CardTitle>{item.name}</CardTitle>
  </CardHeader>
);

describe('CardGrid', () => {
  it('renders a card per item via renderItem', () => {
    render(
      <CardGrid items={ITEMS} renderItem={renderItem} getKey={(i) => i.id} />
    );
    expect(screen.getByText('Slack')).toBeVisible();
    expect(screen.getByText('GitHub')).toBeVisible();
    expect(screen.getByText('Jira')).toBeVisible();
  });

  it('wraps each item in a grid of cards', () => {
    const { container } = render(
      <CardGrid items={ITEMS} renderItem={renderItem} getKey={(i) => i.id} />
    );
    const grid = container.firstElementChild as HTMLElement;
    expect(grid.className).toContain('grid');
    // One Card (a direct grid child) per item.
    expect(grid.children).toHaveLength(ITEMS.length);
    expect(grid.children[0].className).toContain('rounded-lg');
  });

  it('applies the responsive column count from cols', () => {
    const { container } = render(
      <CardGrid
        items={ITEMS}
        renderItem={renderItem}
        cols={4}
        getKey={(i) => i.id}
      />
    );
    const grid = container.firstElementChild as HTMLElement;
    expect(grid.className).toContain('lg:grid-cols-4');
  });

  it('uses an auto-fill track when minColumnWidth is set', () => {
    const { container } = render(
      <CardGrid
        items={ITEMS}
        renderItem={renderItem}
        minColumnWidth="16rem"
        getKey={(i) => i.id}
      />
    );
    const grid = container.firstElementChild as HTMLElement;
    expect(grid.style.gridTemplateColumns).toBe(
      'repeat(auto-fill, minmax(16rem, 1fr))'
    );
  });

  it('renders an empty grid for an empty list', () => {
    const { container } = render(
      <CardGrid items={[]} renderItem={renderItem} />
    );
    const grid = container.firstElementChild as HTMLElement;
    expect(grid.children).toHaveLength(0);
  });
});
