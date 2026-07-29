import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DataGrid } from '../data-grid';

// #96, user-reported: `columnsFeatures={{ fit: 'content' }}` and
// `{{ overflowTooltip: true }}` are documented props that did nothing on their own.
//
// ── THE MECHANISM ────────────────────────────────────────────────────────────
// `columns-features.tsx` resolves both members and carries them in the resolved
// value, but `enabled` was `visibility || pinning || resizing || reordering` — the
// four *affordances* — and `controllerOptions` discarded the entire config when
// `!enabled`. So both members were computed, stored, and thrown away, and the props
// only worked when an unrelated feature happened to be switched on. Recorded as a
// known consequence in `data-table-features/columns.tsx` during #91.
//
// ── WHY THE FIX IS NOT "ADD THEM TO `enabled`" ───────────────────────────────
// `enabled` has THREE readers asking two different questions, and widening it fixes
// one while silently changing the others. The last test in this file is the guard on
// that; see the comment there. The guard that was actually wrong is the one in
// `controllerOptions`, whose question is "does the engine need this config?" — so
// that is the only one this fix changes.

interface Row {
  readonly id: string;
  readonly name: string;
  readonly team: string;
}

const rows: Row[] = [
  { id: 'r1', name: 'Ada', team: 'Engine' },
  { id: 'r2', name: 'Grace', team: 'Compiler' },
];

const columns: ColumnDef<Row, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'team', header: 'Team' },
];

const getRowId = (row: Row) => row.id;

const headers = () => [...document.querySelectorAll<HTMLElement>('thead th')];
const bodyCells = () => [...document.querySelectorAll<HTMLElement>('tbody td')];

describe('#96 — fit and overflowTooltip on their own', () => {
  it('applies fit: content with no other columnsFeatures member set', () => {
    // The whole defect in one assertion. `minWidth: fit-content` is what the
    // engine's `fit === 'content'` arm emits; before the fix the config never
    // reached the engine and every `<th>` carried no style at all.
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        columnsFeatures={{ fit: 'content' }}
      />
    );

    for (const cell of headers()) {
      expect(cell.style.minWidth).toBe('fit-content');
    }
  });

  it('applies fit: container with no other member set', () => {
    // The other string value, because `container` emits `{}` — an empty style — and
    // is therefore the arm whose "working" and "discarded" states look most alike
    // from the DOM. Distinguished here by the sibling assertion: `content` sets
    // `min-width` and `container` must not.
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        columnsFeatures={{ fit: 'container' }}
      />
    );

    for (const cell of headers()) {
      expect(cell.style.minWidth).toBe('');
    }
  });

  it('applies overflowTooltip with no other member set', () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        columnsFeatures={{ overflowTooltip: true }}
      />
    );

    // `truncate` is the class the engine adds so the tooltip has something to
    // reveal. Both bands, because `columnPresentation` runs per header AND per body
    // cell and a fix that reached only one would leave the tooltip revealing
    // nothing in the rows.
    for (const cell of [...headers(), ...bodyCells()]) {
      expect(cell.className).toContain('truncate');
    }
  });

  it('still emits nothing for a config that sets neither', () => {
    // The negative control on the widened guard. `columnsFeatures={{}}` must stay
    // discarded — otherwise the fix would hand TanStack's 150px default `min-width`
    // to every column in every grid that passes an empty config, which is #91's
    // failure mode in reverse.
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        columnsFeatures={{}}
      />
    );

    for (const cell of headers()) {
      expect(cell.getAttribute('style')).toBeNull();
    }
  });

  it('leaves the toolbar’s column list offered when only fit is set', async () => {
    // ⚠ **THE REGRESSION GUARD, and the reason `enabled` itself was not widened.**
    //
    // `toolbar.tsx` reads `visibility: columns.enabled ? columns.visibility : true`.
    // The fallback is deliberate and documented there: a grid that never opted into
    // `columnsFeatures` still gets the column list, because that is what the control
    // this menu replaced always did.
    //
    // Adding `fit`/`overflowTooltip` to `enabled` would flip that ternary for a
    // `{ fit: 'content' }` caller — `enabled` true, `visibility` false — and
    // **silently remove the column list from their settings menu**. Measured: with
    // `enabled` widened, this test fails and the two checkbox items below are absent.
    // Fixing the discard guard instead leaves all three readers of `enabled`
    // answering exactly what they answered before.
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        columnsFeatures={{ fit: 'content' }}
        toolbar={{ viewOptions: true }}
      />
    );

    const trigger = screen.getByRole('button', { name: /view|column/i });
    trigger.click();

    // One checkbox item per hideable column — the column list is still there.
    const items = await screen.findAllByRole('menuitemcheckbox');
    expect(items.length).toBeGreaterThanOrEqual(2);
    expect(items.map((i) => i.textContent)).toEqual(
      expect.arrayContaining(['name', 'team'])
    );
  });
});
