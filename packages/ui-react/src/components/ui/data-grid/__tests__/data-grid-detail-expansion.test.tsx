import type { ColumnDef } from '@tanstack/react-table';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DataGrid } from '../data-grid';

// U1 — `detailExpansion`. Acceptance targets:
//   packages/ui-spec/components/data-table/behavior.md  "Detail and tree expansion are separate"
//   packages/ui-spec/components/data-grid/behavior.md   "Accordion detail expansion"
// plus design §7's ARIA id contract.

interface Person {
  id: string;
  name: string;
}

const columns: ColumnDef<Person, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
];
const rows: Person[] = [
  { id: '1', name: 'Ada' },
  { id: '2', name: 'Grace' },
  { id: '3', name: 'Alan' },
];
const getRowId = (row: Person) => row.id;

const detail = {
  render: (row: Person) => <span>Details for {row.name}</span>,
};

function expanders() {
  return screen.getAllByRole('button', { name: 'Toggle details' });
}

describe('DataGrid detailExpansion', () => {
  it('reveals a caller-rendered panel under its record', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        detailExpansion={detail}
      />
    );

    expect(screen.queryByText('Details for Ada')).not.toBeInTheDocument();
    await user.click(expanders()[0]);
    expect(screen.getByText('Details for Ada')).toBeVisible();
    await user.click(expanders()[0]);
    expect(screen.queryByText('Details for Ada')).not.toBeInTheDocument();
  });

  it('emits `aria-controls` exactly while the panel is mounted (design §7)', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        detailExpansion={detail}
      />
    );

    const button = expanders()[0];
    // Collapsed: state is reported, but there is no target to point at.
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).not.toHaveAttribute('aria-controls');

    await user.click(button);

    const next = expanders()[0];
    expect(next).toHaveAttribute('aria-expanded', 'true');
    const target = next.getAttribute('aria-controls');
    expect(target).toBeTruthy();
    // The attribute points at an element that actually exists.
    const panel = document.getElementById(target as string);
    expect(panel).not.toBeNull();
    expect(
      within(panel as HTMLElement).getByText('Details for Ada')
    ).toBeVisible();
  });

  it('scopes the id per table and per row', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        detailExpansion={detail}
      />
    );

    await user.click(expanders()[0]);
    await user.click(expanders()[1]);
    const [first, second] = expanders();
    expect(first.getAttribute('aria-controls')).not.toBe(
      second.getAttribute('aria-controls')
    );
    for (const button of [first, second]) {
      expect(button.getAttribute('aria-controls')).toContain('--detail--');
    }
  });

  it('survives a row id an `id` attribute could not carry', async () => {
    // The §7 scheme base64url-encodes the row id precisely because ids are
    // caller-supplied. A space, a quote or a non-ASCII character would break
    // either the attribute or the `getElementById` lookup if it reached the DOM
    // raw — so this asserts the round trip, not the encoder in isolation.
    const user = userEvent.setup();
    const awkward: Person[] = [
      { id: 'a b"c', name: 'Spaces and quotes' },
      { id: 'ünïcode/+=', name: 'Non-ASCII and base64 padding' },
    ];
    render(
      <DataGrid
        columns={columns}
        rows={awkward}
        getRowId={getRowId}
        detailExpansion={detail}
      />
    );

    for (const [index, row] of awkward.entries()) {
      await user.click(expanders()[index]);
      const target = expanders()[index].getAttribute('aria-controls');
      expect(target).toBeTruthy();
      // A raw id would have leaked the space, the quote or the `/`.
      expect(target).toMatch(/^[\w-]+--detail--[\w-]+$/);
      const panel = document.getElementById(target as string);
      expect(panel).not.toBeNull();
      expect(
        within(panel as HTMLElement).getByText(`Details for ${row.name}`)
      ).toBeVisible();
      await user.click(expanders()[index]);
    }
  });

  it('names the expander column for a screen reader', () => {
    // An empty `<th>` fails axe's `empty-table-header` rule and leaves the column
    // unnamed in the accessibility tree. The name is visually hidden, so the
    // header row still reads as a bare expander gutter.
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        detailExpansion={detail}
      />
    );

    const label = screen.getByText('Details');
    expect(label).toHaveClass('sr-only');
    expect(label.closest('th')).not.toBeNull();
  });

  it('honours `isExpandable`', () => {
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        detailExpansion={{ ...detail, isExpandable: (row) => row.id !== '2' }}
      />
    );
    // Grace has no panel to reveal, so it gets no control.
    expect(expanders()).toHaveLength(2);
  });

  it('does not let a detail toggle select or activate its row', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        selection={{ mode: 'multiple' }}
        detailExpansion={detail}
        rowInteraction={{ onClick: onRowClick }}
      />
    );

    await user.click(expanders()[0]);
    expect(screen.getByText('Details for Ada')).toBeVisible();
    expect(onRowClick).not.toHaveBeenCalled();
    expect(screen.getAllByLabelText('Select row')[0]).not.toBeChecked();
  });

  it('consumes no pagination slot (ADR-0001 OQ-1)', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        detailExpansion={detail}
        pagination={{ pageSize: 2 }}
      />
    );

    // Page one holds two *records*; opening a panel must not push one off.
    expect(screen.getByText('Ada')).toBeVisible();
    expect(screen.getByText('Grace')).toBeVisible();
    await user.click(expanders()[0]);
    expect(screen.getByText('Details for Ada')).toBeVisible();
    expect(screen.getByText('Grace')).toBeVisible();
    expect(screen.queryByText('Alan')).not.toBeInTheDocument();
  });

  it('emits `onDetailExpansionChange` and nothing else', async () => {
    const user = userEvent.setup();
    const onDetailExpansionChange = vi.fn();
    const onSelectionChange = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        detailExpansion={detail}
        callbacks={{ onDetailExpansionChange, onSelectionChange }}
      />
    );

    await user.click(expanders()[0]);

    expect(onDetailExpansionChange).toHaveBeenCalledTimes(1);
    const event = onDetailExpansionChange.mock.calls[0][0];
    expect(event.slice).toBe('detailExpanded');
    expect(event.value).toEqual(new Set(['1']));
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it('keeps detail and tree expansion in separate slices', async () => {
    const user = userEvent.setup();
    const onStateChange = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        detailExpansion={detail}
        callbacks={{ onStateChange }}
      />
    );

    await user.click(expanders()[0]);

    const event = onStateChange.mock.calls[0][0];
    expect(event.slice).toBe('detailExpanded');
    // The whole point of ADR-0001: the tree slice is untouched.
    expect(event.state.treeExpanded).toEqual(new Set());
    expect(event.state.detailExpanded).toEqual(new Set(['1']));
  });
});

describe('DataGrid detailExpansion accordion mode', () => {
  it('closes the previously open panel', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        detailExpansion={{ ...detail, mode: 'accordion' }}
      />
    );

    await user.click(expanders()[0]);
    expect(screen.getByText('Details for Ada')).toBeVisible();

    await user.click(expanders()[1]);
    expect(screen.getByText('Details for Grace')).toBeVisible();
    expect(screen.queryByText('Details for Ada')).not.toBeInTheDocument();
  });

  it('leaves the tree slice alone while doing it (design §6 rule 7)', async () => {
    const user = userEvent.setup();
    const onStateChange = vi.fn();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        detailExpansion={{ ...detail, mode: 'accordion' }}
        callbacks={{ onStateChange }}
      />
    );

    await user.click(expanders()[0]);
    await user.click(expanders()[1]);

    for (const [event] of onStateChange.mock.calls) {
      expect(event.slice).toBe('detailExpanded');
      expect(event.state.treeExpanded).toEqual(new Set());
    }
    // Exactly one open at a time.
    expect(
      onStateChange.mock.calls[onStateChange.mock.calls.length - 1][0].value
    ).toEqual(new Set(['2']));
  });

  it('multiple mode keeps both open', async () => {
    const user = userEvent.setup();
    render(
      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        detailExpansion={{ ...detail, mode: 'multiple' }}
      />
    );

    await user.click(expanders()[0]);
    await user.click(expanders()[1]);
    expect(screen.getByText('Details for Ada')).toBeVisible();
    expect(screen.getByText('Details for Grace')).toBeVisible();
  });
});
