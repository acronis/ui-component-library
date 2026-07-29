import { createRef } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  Tree,
  TreeItem,
  TreeItemGroup,
  TreeItemLabel,
  TreeItemTrigger,
  TreeView,
  type TreeNode,
} from '../tree';

// A parent treeitem's accessible name includes its descendants' text, so query
// items by their label text and walk up to the nearest treeitem.
const item = (label: string) =>
  screen.getByText(label).closest('[role="treeitem"]') as HTMLElement;

const nodes: TreeNode[] = [
  {
    id: 'p1',
    label: 'Parent 1',
    children: [
      { id: 'c1', label: 'Child 1' },
      { id: 'c2', label: 'Child 2' },
    ],
  },
  { id: 'p2', label: 'Parent 2' },
];

function Composable() {
  return (
    <Tree aria-label="Files">
      <TreeItem value="p1">
        <TreeItemTrigger>
          <TreeItemLabel>Parent 1</TreeItemLabel>
        </TreeItemTrigger>
        <TreeItemGroup>
          <TreeItem value="c1">
            <TreeItemTrigger>
              <TreeItemLabel>Child 1</TreeItemLabel>
            </TreeItemTrigger>
          </TreeItem>
        </TreeItemGroup>
      </TreeItem>
    </Tree>
  );
}

describe('Tree', () => {
  it('renders a tree with treeitems and correct aria', () => {
    render(<Composable />);
    expect(screen.getByRole('tree', { name: 'Files' })).toBeInTheDocument();
    const parent = item('Parent 1');
    expect(parent).toHaveAttribute('aria-level', '1');
    expect(parent).toHaveAttribute('aria-expanded', 'false');
    expect(parent).toHaveAttribute('aria-selected', 'false');
  });

  it('flips the collapsed disclosure chevron and indents on the inline-start edge (RTL)', () => {
    render(<Composable />);
    const parent = item('Parent 1');
    // The collapsed row shows the right-pointing chevron, which must flip under
    // `dir="rtl"` — the breadcrumb `rtl:rotate-180` precedent.
    const chevron = parent.querySelector('[data-slot="tree-item-chevron"] svg');
    expect(chevron).toHaveClass('rtl:rotate-180');
    // Depth indentation and the trailing padding are logical, so they mirror in
    // RTL instead of pinning the tree to the physical left edge.
    const trigger = parent.querySelector(
      '[data-slot="tree-item-trigger"]'
    ) as HTMLElement;
    expect(trigger).toHaveClass('pe-2');
    expect(trigger.getAttribute('style')).toContain('padding-inline-start');
    expect(trigger.getAttribute('style')).not.toContain('padding-left');
  });

  it('collapses children by default and expands on row click', async () => {
    const user = userEvent.setup();
    render(<Composable />);
    expect(screen.queryByText('Child 1')).not.toBeInTheDocument();
    await user.click(screen.getByText('Parent 1'));
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(item('Parent 1')).toHaveAttribute('aria-expanded', 'true');
    // Nested child is one level deeper.
    expect(item('Child 1')).toHaveAttribute('aria-level', '2');
  });

  it('selects a single node at a time', async () => {
    const user = userEvent.setup();
    render(<TreeView data={nodes} aria-label="t" />);
    await user.click(screen.getByText('Parent 2'));
    expect(item('Parent 2')).toHaveAttribute('aria-selected', 'true');
    expect(item('Parent 1')).toHaveAttribute('aria-selected', 'false');
  });

  it('fires onNodeToggle and onNodeSelect', async () => {
    const user = userEvent.setup();
    const onNodeToggle = vi.fn();
    const onNodeSelect = vi.fn();
    render(
      <TreeView
        data={nodes}
        aria-label="t"
        onNodeToggle={onNodeToggle}
        onNodeSelect={onNodeSelect}
      />
    );
    await user.click(screen.getByText('Parent 1'));
    expect(onNodeSelect).toHaveBeenCalledWith('p1');
    expect(onNodeToggle).toHaveBeenCalledWith('p1', true);
  });

  it('renders checkboxes that toggle without selecting the row', async () => {
    const user = userEvent.setup();
    const onNodeCheck = vi.fn();
    const onNodeSelect = vi.fn();
    render(
      <TreeView
        data={nodes}
        aria-label="t"
        showCheckbox
        onNodeCheck={onNodeCheck}
        onNodeSelect={onNodeSelect}
      />
    );
    const p2 = item('Parent 2');
    const checkbox = within(p2).getByRole('checkbox');
    await user.click(checkbox);
    expect(onNodeCheck).toHaveBeenCalledWith('p2', true);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    // Clicking the checkbox must not select the row.
    expect(onNodeSelect).not.toHaveBeenCalled();
    expect(p2).toHaveAttribute('aria-selected', 'false');
  });

  it('honors defaultExpanded / defaultSelected', () => {
    render(
      <TreeView
        data={nodes}
        aria-label="t"
        defaultExpanded={['p1']}
        defaultSelected="p2"
      />
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(item('Parent 2')).toHaveAttribute('aria-selected', 'true');
  });

  it('supports keyboard: ArrowRight expands, Enter selects, ArrowDown moves focus', async () => {
    const user = userEvent.setup();
    render(<TreeView data={nodes} aria-label="t" />);
    const p1 = item('Parent 1');
    p1.focus();
    await user.keyboard('{ArrowRight}');
    expect(p1).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{Enter}');
    expect(p1).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowDown}');
    expect(item('Child 1')).toHaveFocus();
  });

  it('scopes the focus ring to the item itself (not a shared group)', () => {
    render(<TreeView data={nodes} aria-label="t" />);
    const trigger = screen
      .getByText('Parent 1')
      .closest('[data-slot="tree-item-trigger"]') as HTMLElement;
    expect(trigger.className).toContain(
      '[[role=treeitem]:focus-visible>&]:ring-2'
    );
    expect(trigger.className).not.toContain('group-focus-visible');
  });

  // The virtualized path is layout-driven (only the visible window mounts), which
  // happy-dom can't measure — real windowing is proved by the `LongVirtualized`
  // VR story in Chromium. Here we smoke-test that it mounts as a scrollable tree
  // without rendering the whole (large) dataset. Expand/select logic is shared
  // with the non-virtualized path and covered by the tests above.
  it('renders a virtualized tree inside a ScrollArea without mounting all rows', () => {
    const big: TreeNode[] = Array.from({ length: 1000 }, (_, i) => ({
      id: `n${i}`,
      label: `Node ${i}`,
    }));
    render(<TreeView data={big} virtualized height={200} aria-label="big" />);
    const tree = screen.getByRole('tree', { name: 'big' });
    expect(tree).toBeInTheDocument();
    // Virtualized rows live inside the shared ScrollArea component.
    expect(tree.closest('[data-slot="scroll-area"]')).toBeInTheDocument();
    // Far from all 1000 rows are in the DOM.
    expect(screen.queryAllByRole('treeitem').length).toBeLessThan(1000);
  });

  it('forwards ref to the tree root', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Tree ref={ref} aria-label="t">
        <TreeItem value="a">
          <TreeItemTrigger>
            <TreeItemLabel>A</TreeItemLabel>
          </TreeItemTrigger>
        </TreeItem>
      </Tree>
    );
    expect(ref.current).toHaveAttribute('role', 'tree');
  });
});
