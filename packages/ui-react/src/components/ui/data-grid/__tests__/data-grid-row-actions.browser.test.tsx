import { BinIcon, PencilIcon } from '@constructor-lab/icons-react/stroke-mono';
import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

// The real stylesheet, for the same reason `data-grid-toolbar-bulk.browser.test.tsx`
// loads it: every assertion below is a measurement, and unstyled markup lays out
// nothing like the shipped menu.
import '../../../../../.storybook/preview.css';

import { DataGrid } from '../data-grid';

// PLTFRM-93046 — row action items render their icon BESIDE the label, not above it.
//
// ── WHY THIS LAYER, GIVEN A BASELINE ALSO COVERS IT ──────────────────────────
// `__stories__/data-grid.stories.tsx`'s `RowActionsMenuOpen` files the picture, and
// for a single-state layout defect a picture says it better — the argument
// `data-grid-toolbar-bulk.browser.test.tsx` makes at length. Two things it cannot
// say, both of which this ticket has:
//
//   1. The defect shipped **past 318 committed baselines**, because every story
//      that covered row actions captured the menu CLOSED. The new story fixes the
//      coverage gap, but its value starts at the first accepted baseline; this rule
//      holds from the commit that adds it.
//   2. A baseline is accepted by a person, and `test:visual:update` rewrites all
//      318 at once. "The icon and the label are on the same line" is a relation, and
//      a relation asserted as a rule cannot ride along in a batch approved for an
//      unrelated reason.
//
// ── THE DEFECT, IN THE TERMS MEASURED HERE ───────────────────────────────────
// `icon` was passed as a **child** of `DropdownMenuItem` rather than as its `icon`
// prop. As a child it lands inside the label's `flex-1 truncate` span, where a
// block-level SVG takes a line of its own — the reported "icon on top and text on
// the bottom", which also makes the item taller than a sibling that has no icon.
// So: one geometric claim (beside) and one relational one (no taller), and the bug
// fails both.
//
// Run by the `browser` project (`npm run test:browser`), real Chromium via
// Playwright, which fails rather than skips when no browser is available.

interface Payment {
  readonly id: string;
  readonly email: string;
  readonly amount: number;
}

const columns: ColumnDef<Payment, unknown>[] = [
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'amount', header: 'Amount' },
];

const payments: Payment[] = [
  { id: 'p1', email: 'ken99@example.com', amount: 316 },
  { id: 'p2', email: 'abe45@example.com', amount: 242 },
];

/** Exact box of an element's own text, independent of the markup wrapping it. */
function textRect(element: Element, text: string): DOMRect {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) {
    if (node.textContent?.trim() !== text) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    return range.getBoundingClientRect();
  }
  throw new Error(`no text node reading '${text}' under the given element`);
}

function iconRect(element: Element): DOMRect {
  const svg = element.querySelector('svg');
  if (svg === null) {
    throw new Error('expected the menu item to render an icon');
  }
  return svg.getBoundingClientRect();
}

/**
 * Fixed-width host: the menu's own width follows its widest label, and leaving the
 * width to the runner's window would make the geometry machine-dependent.
 */
function renderGrid() {
  const host = document.createElement('div');
  host.style.width = '900px';
  document.body.append(host);
  return render(
    <DataGrid
      columns={columns}
      rows={payments}
      getRowId={(row) => row.id}
      actions={{
        items: [
          { id: 'edit', label: 'Edit payment', icon: <PencilIcon /> },
          // No icon — the height comparison needs a sibling in the same menu, so
          // that neither side of it depends on a number written down here.
          { id: 'reference', label: 'Copy reference' },
          {
            id: 'delete',
            label: 'Delete',
            icon: <BinIcon />,
            destructive: true,
          },
        ],
        onAction: () => {},
      }}
    />,
    { container: host }
  );
}

async function openFirstRowMenu() {
  const user = userEvent.setup();
  renderGrid();
  const [trigger] = await screen.findAllByRole('button', {
    name: 'Row actions',
  });
  await user.click(trigger!);
  return screen.findByRole('menu');
}

describe('PLTFRM-93046 — row action icons sit beside their labels', () => {
  it('PLTFRM-93046: puts the icon left of the label, on the same line', async () => {
    await openFirstRowMenu();
    const item = await screen.findByRole('menuitem', { name: 'Edit payment' });

    const icon = iconRect(item);
    const label = textRect(item, 'Edit payment');

    // Beside: the icon ends before the label starts. Stacked, the two shared a left
    // edge, so this read icon.right ≈ label.right instead.
    expect(Math.round(icon.right)).toBeLessThanOrEqual(Math.ceil(label.left));

    // Same line: the two boxes overlap vertically. Checked as an overlap rather than
    // as equal centres, because an icon is taller than a cap height and the two are
    // legitimately centred against each other, not identical.
    expect(icon.top).toBeLessThan(label.bottom);
    expect(label.top).toBeLessThan(icon.bottom);
  });

  it('PLTFRM-93046: does not make an item with an icon taller than one without', async () => {
    await openFirstRowMenu();
    const withIcon = await screen.findByRole('menuitem', {
      name: 'Edit payment',
    });
    const withoutIcon = await screen.findByRole('menuitem', {
      name: 'Copy reference',
    });

    // The reported symptom as one number, and the reason this is a relation and not a
    // pinned pixel height: an icon on its own line grew the item by about a line box,
    // whatever the theme's item height happens to be.
    expect(Math.round(withIcon.getBoundingClientRect().height)).toBe(
      Math.round(withoutIcon.getBoundingClientRect().height)
    );
  });

  it('PLTFRM-93046 follow-up: colours a destructive item, label and icon alike', async () => {
    await openFirstRowMenu();
    const destructive = await screen.findByRole('menuitem', { name: 'Delete' });
    const plain = await screen.findByRole('menuitem', { name: 'Edit payment' });

    const destructiveIcon = destructive.querySelector('svg');
    const plainIcon = plain.querySelector('svg');
    if (destructiveIcon === null || plainIcon === null) {
      throw new Error('expected both menu items to render an icon');
    }

    // Asserted as a DIFFERENCE from a plain item rather than against a literal
    // rgb() string: the token's value is the design system's to change, and pinning
    // it here would make a theme update look like a regression. What must hold is
    // that the two do not agree — before the fix they did, for both label and icon.
    const colour = (element: Element) => getComputedStyle(element).color;
    expect(colour(destructive)).not.toBe(colour(plain));

    // And the icon, separately. `MenuItem` colours it on the wrapping span, so a
    // label-only fix leaves the icon on the idle token — the exact half-fix
    // `DataGridBulkActions` records having shipped once.
    expect(colour(destructiveIcon)).not.toBe(colour(plainIcon));
    expect(colour(destructiveIcon)).toBe(colour(destructive));
  });
});
