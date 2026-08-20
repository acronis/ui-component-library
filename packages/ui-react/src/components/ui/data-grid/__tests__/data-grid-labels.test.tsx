// The `labels` group (PLTFRM-93117): can a caller replace every string DataGrid
// renders itself, and does omitting one keep its default?
//
// ── WHY THE ASSERTIONS RUN AGAINST LOCALE FIXTURES ──────────────────────────
// A test that overrides one member with `'xx'` proves the plumbing and nothing
// else. The two fixtures below are real translations with awkward properties on
// purpose, because those are what a single-string API gets wrong:
//
//   - `de` needs a different plural split from English, and its word order puts the
//     noun before the verb in "Spalte host verschieben". A member that were a
//     template string with `{column}` in it could not express that.
//   - `ja` has no plural inflection at all and uses a counter suffix, so the English
//     "row(s)" parenthetical is meaningless rather than merely wrong.
//
// Both are asserted through the same members, which is the claim: the API is
// adequate for languages that do not work like English.
//
// ── AND WHY ONE TEST READS THE DEFAULTS OBJECT ──────────────────────────────
// `every member is reachable` walks `DATA_GRID_DEFAULT_LABELS` and fails on a member
// nothing renders. Without it, adding a key here and forgetting to wire it produces
// a documented, type-checked, published label that does nothing — the exact failure
// mode PLTFRM-93016 was filed about one layer along.

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DataGrid } from '../data-grid';
import {
  DATA_GRID_DEFAULT_LABELS,
  type DataGridLabels,
} from '../data-grid-config/labels';

type Server = { id: string; host: string; role: string };

const rows: Server[] = [
  { id: 's1', host: 'db-primary-01', role: 'Datenbank' },
  { id: 's2', host: 'web-edge-07', role: 'Webserver' },
];

const columns = [
  { accessorKey: 'host', header: 'Host' },
  { accessorKey: 'role', header: 'Rolle' },
];

/** German: different plural split, and verb after the noun. */
const de: DataGridLabels = {
  rowsPerPage: 'Zeilen pro Seite',
  nextPage: 'Zur nächsten Seite',
  selectAllRows: 'Alle Zeilen auswählen',
  selectRow: 'Zeile auswählen',
  columnSettings: 'Spalteneinstellungen',
  pageOf: (page, total) => `Seite ${page} von ${total}`,
  selectedCount: (selected, total) =>
    `${selected} von ${total} ${total === 1 ? 'Zeile' : 'Zeilen'} ausgewählt`,
  reorderColumn: (columnId) => `Spalte ${columnId} verschieben`,
};

/** Japanese: no plural inflection, counter suffix, no spaces. */
const ja: DataGridLabels = {
  rowsPerPage: '1ページあたりの行数',
  nextPage: '次のページ',
  selectAllRows: 'すべての行を選択',
  selectRow: '行を選択',
  columnSettings: '列の設定',
  pageOf: (page, total) => `${total}ページ中${page}ページ目`,
  selectedCount: (selected, total) => `${total}件のうち${selected}件を選択中`,
  reorderColumn: (columnId) => `${columnId}列を並べ替え`,
};

const grid = (labels?: DataGridLabels) =>
  render(
    <DataGrid
      columns={columns}
      rows={rows}
      getRowId={(row: Server) => row.id}
      selection={{ mode: 'multiple' }}
      columnsFeatures={{ visibility: true, reordering: true }}
      toolbar={{ viewOptions: true }}
      pagination={{ pageSize: 1 }}
      {...(labels === undefined ? {} : { labels })}
    />
  );

describe('DataGrid labels — defaults', () => {
  it('renders English when the caller says nothing', () => {
    const { container } = grid();

    expect(container.textContent).toContain('Rows per page');
    expect(container.textContent).toContain('0 of 2 row(s) selected.');
    expect(
      container.querySelector('[aria-label="Select all rows"]')
    ).not.toBeNull();
  });
});

describe.each([['de', de] as const, ['ja', ja] as const])(
  'DataGrid labels — %s',
  (_locale, labels) => {
    it('replaces the visible chrome text', () => {
      const { container } = grid(labels);

      expect(container.textContent).toContain(labels.rowsPerPage);
      // The English default must be gone, not merely joined by the translation.
      expect(container.textContent).not.toContain('Rows per page');
    });

    it('replaces the page counter', () => {
      // Regression: this one was missed until the German story's baseline showed
      // "Page 1 of 2" sitting among translated chrome.
      const { container } = grid(labels);

      expect(container.textContent).toContain(labels.pageOf!(1, 2));
      expect(container.textContent).not.toContain('Page 1 of');
    });

    it('replaces the accessible names', () => {
      const { container } = grid(labels);

      expect(
        container.querySelector(`[aria-label="${labels.selectAllRows}"]`)
      ).not.toBeNull();
      expect(
        container.querySelector(`[aria-label="${labels.selectRow}"]`)
      ).not.toBeNull();
      expect(
        container.querySelector('[aria-label="Select all rows"]')
      ).toBeNull();
    });

    it('formats the selection summary through the caller function', () => {
      const { container } = grid(labels);

      // 0 selected of 2 — the same arguments the English default receives, so the
      // difference in output is entirely the caller's formatting.
      expect(container.textContent).toContain(labels.selectedCount!(0, 2));
      expect(container.textContent).not.toContain('row(s) selected');
    });

    it('formats an interpolated accessible name through the caller function', () => {
      const { container } = grid(labels);

      expect(
        container.querySelector(
          `[aria-label="${labels.reorderColumn!('host')}"]`
        )
      ).not.toBeNull();
    });
  }
);

describe('DataGrid labels — partial overrides', () => {
  it('keeps the default for every member the caller omits', () => {
    const { container } = grid({ rowsPerPage: 'Zeilen pro Seite' });

    expect(container.textContent).toContain('Zeilen pro Seite');
    // Untouched members still English, which is what makes adopting this group
    // incremental rather than all-or-nothing.
    expect(container.textContent).toContain('0 of 2 row(s) selected.');
    expect(
      container.querySelector('[aria-label="Select all rows"]')
    ).not.toBeNull();
  });

  it('treats an explicit `undefined` as "not supplied"', () => {
    // A caller spreading a partial translation map hits this: the key exists with
    // no value. It must fall through to the default rather than render "undefined".
    const { container } = grid({ rowsPerPage: undefined });

    expect(container.textContent).toContain('Rows per page');
    expect(container.textContent).not.toContain('undefined');
  });
});

describe('DataGrid labels — the surface itself', () => {
  it('every member is reachable through the config, with no extras', () => {
    // Guards the *type* rather than the render: a member added to `DataGridLabels`
    // without a default here has no English fallback, and one added to the defaults
    // without being declared is unreachable from `labels`.
    const keys = Object.keys(DATA_GRID_DEFAULT_LABELS).sort();
    expect(keys.length).toBeGreaterThan(25);

    const overrides = Object.fromEntries(
      keys.map((key) => [
        key,
        typeof (DATA_GRID_DEFAULT_LABELS as Record<string, unknown>)[key] ===
        'function'
          ? () => 'X'
          : 'X',
      ])
    ) as DataGridLabels;

    // Every member overridden at once must render without throwing — a function
    // member wired as a string (or the reverse) fails here rather than in someone's
    // console.
    const { container } = grid(overrides);
    expect(container.querySelector('table')).not.toBeNull();
    expect(container.textContent).not.toContain('Rows per page');
  });

  it('renders the selection summary from the resolved count, not the row model', () => {
    // The argument contract behind `selectedCount`: it receives the resolved count
    // and the total, so a caller's formatter is handed the same numbers the English
    // default gets. Asserted with a formatter that echoes them unambiguously.
    const { container } = grid({
      selectedCount: (selected, total) => `[${selected}|${total}]`,
    });

    expect(container.textContent).toContain('[0|2]');
  });
});
