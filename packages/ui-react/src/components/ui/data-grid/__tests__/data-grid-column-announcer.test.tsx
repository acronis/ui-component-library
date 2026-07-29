import { act, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  columnAnnouncerFor,
  DataGridColumnAnnouncer,
} from '../data-grid-column-announcer';

// The channel U3's column controls announce through. Two properties are asserted
// here rather than through a control, because a control-level test cannot
// distinguish either of them from a working-looking failure:
//
//  - **One region per grid, shared.** Keyed on the engine instance, so the toolbar
//    menu and a header cell's controls reach the *same* region even though they are
//    in different subtrees.
//  - **The same message twice is not the same text.** A live region speaks when its
//    text changes, so an unaltered repeat is silent — and silence is invisible in
//    every DOM assertion that checks the text is *present*.

/**
 * Queried by `data-slot`, because the region deliberately carries `aria-live` +
 * `aria-atomic` rather than `role="status"` — `Spinner` owns that role, and a grid
 * with a lazy `tree` and a toolbar would expose two.
 */
const region = (container: HTMLElement) =>
  container.querySelector('[data-slot="data-grid-column-announcer"]');

describe('DataGridColumnAnnouncer', () => {
  it('renders what its own key announces, and nothing before that', () => {
    const key = {};
    const { container } = render(<DataGridColumnAnnouncer table={key} />);

    expect(region(container)).toHaveTextContent('');
    act(() => {
      columnAnnouncerFor(key).announce('name column width 136 pixels');
    });
    expect(region(container)).toHaveTextContent('name column width 136 pixels');
  });

  it('gives two callers on one key the same channel', () => {
    const key = {};
    // Two components resolving the announcer separately — the menu holds `table`
    // as a prop, the header controls read it off `DataTableRoot`.
    const fromMenu = columnAnnouncerFor(key);
    const fromHeader = columnAnnouncerFor(key);
    expect(fromHeader).toBe(fromMenu);

    const { container } = render(<DataGridColumnAnnouncer table={key} />);
    act(() => {
      fromHeader.announce('team column moved to position 2 of 3');
    });
    expect(region(container)).toHaveTextContent(
      'team column moved to position 2 of 3'
    );
  });

  it('separates two grids', () => {
    const first = {};
    const second = {};
    const { container } = render(<DataGridColumnAnnouncer table={first} />);

    act(() => {
      columnAnnouncerFor(second).announce('site column hidden');
    });
    // A module-scope channel that ignored its key would leak one grid's
    // announcements into the other's region.
    expect(region(container)).toHaveTextContent('');
  });

  it('alternates the text so an identical repeat still speaks', () => {
    const key = {};
    const { container } = render(<DataGridColumnAnnouncer table={key} />);
    const announcer = columnAnnouncerFor(key);

    act(() => {
      announcer.announce('All columns unpinned');
    });
    const first = region(container)?.textContent;
    act(() => {
      announcer.announce('All columns unpinned');
    });
    const second = region(container)?.textContent;

    // Both read as the same sentence…
    expect(region(container)).toHaveTextContent('All columns unpinned');
    // …and the DOM text differs, which is the only reason the second one is heard.
    expect(second).not.toBe(first);
  });
});
