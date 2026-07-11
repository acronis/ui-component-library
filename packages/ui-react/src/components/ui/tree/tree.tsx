'use client';

import * as React from 'react';
import {
  ChevronDownIcon,
  ChevronRightIcon,
} from '@spec-lab/icons-react/stroke-mono';
import { useVirtualizer } from '@tanstack/react-virtual';

import { cn } from '@/lib/utils';
import { Checkbox } from '../checkbox';
import { ScrollArea } from '../scroll-area';

// Ported from the legacy shadcn UI kit's `tree`
// and reconciled against the Figma "Tree" component set
// (node 2847-8319 / doc 2092-2578): a tree menu, used inside dropdowns and as a
// standalone tree view. A row can carry an expand chevron, a checkbox, a leading
// icon, a label, and a trailing slot (e.g. a Tag), across idle / hover /
// selected / focus states.
//
// Adaptations from legacy:
// - Legacy was a single data-driven `<Tree data={...}>`. Here the primitive is a
//   set of **composable parts** (Tree / TreeItem / TreeItemTrigger /
//   TreeItemLabel / TreeItemGroup / TreeItemCheckbox / TreeItemIcon) following
//   the ui-react convention (cf. breadcrumb), with a **`TreeView`** convenience
//   wrapper that renders the legacy `TreeNode[]` shape on top of the parts.
// - Legacy styled rows with ad-hoc `hsl(var(--tree-*)/0.05)` vars + opacity
//   hacks. Those are dropped for semantic `--ui-*` tokens in the blue
//   (electricblue/info) selection gamma the Figma uses: idle transparent, hover
//   `--ui-background-status-info` (#eef2f7), selected
//   `--ui-background-status-info-hover` (#e2ebf5), focus the standard
//   `--ui-focus-primary` ring. Checkbox comes from the Base UI ui-react
//   `Checkbox` (its own token tier), not the legacy shadcn one.
//
// Design-pending v1: no dedicated `--ui-tree-*` tier exists yet (Figma models it
// under a `componentLegacy/tree/*` group); rows bind the shared semantic
// vocabulary. Reconcile a real tier + the Figma focus fill with
// `/figma-component Tree <url> --update`.

const INDENT_STEP = 16; // px added to a row's left padding per nesting level
const BASE_PADDING = 8; // px left padding at level 0

// ── contexts ────────────────────────────────────────────────────────────────

interface TreeContextValue {
  expanded: Set<string>;
  selected: string | null;
  checked: Set<string>;
  focusedId: string | null;
  toggleExpanded: (id: string) => void;
  select: (id: string) => void;
  toggleChecked: (id: string, next: boolean) => void;
  setFocusedId: (id: string | null) => void;
  treeRef: React.RefObject<HTMLDivElement | null>;
}

const TreeContext = React.createContext<TreeContextValue | null>(null);

function useTreeContext(component: string): TreeContextValue {
  const ctx = React.useContext(TreeContext);
  if (!ctx) {
    throw new Error(`<${component}> must be used within a <Tree>.`);
  }
  return ctx;
}

interface TreeItemContextValue {
  value: string;
  level: number;
  expandable: boolean;
  expanded: boolean;
  selected: boolean;
  checked: boolean;
}

const TreeItemContext = React.createContext<TreeItemContextValue | null>(null);

function useTreeItemContext(component: string): TreeItemContextValue {
  const ctx = React.useContext(TreeItemContext);
  if (!ctx) {
    throw new Error(`<${component}> must be used within a <TreeItem>.`);
  }
  return ctx;
}

const TreeLevelContext = React.createContext(0);

// ── Tree (root) ──────────────────────────────────────────────────────────────

export interface TreeProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'defaultChecked'
> {
  /** Node ids expanded on first render (uncontrolled). */
  defaultExpanded?: string[];
  /** Node id selected on first render (uncontrolled). Selection is single. */
  defaultSelected?: string;
  /** Node ids checked on first render (uncontrolled). Requires checkboxes. */
  defaultChecked?: string[];
  /** Fires when a node is expanded or collapsed. */
  onNodeToggle?: (id: string, expanded: boolean) => void;
  /** Fires when a node is selected. */
  onNodeSelect?: (id: string) => void;
  /** Fires when a node's checkbox changes. */
  onNodeCheck?: (id: string, checked: boolean) => void;
}

type TreeStateOptions = Pick<
  TreeProps,
  | 'defaultExpanded'
  | 'defaultSelected'
  | 'defaultChecked'
  | 'onNodeToggle'
  | 'onNodeSelect'
  | 'onNodeCheck'
>;

// Shared expand / select / check + roving-focus state, used by both the
// composable Tree root and the virtualized TreeView path.
function useTreeState(
  {
    defaultExpanded = [],
    defaultSelected,
    defaultChecked = [],
    onNodeToggle,
    onNodeSelect,
    onNodeCheck,
  }: TreeStateOptions,
  treeRef: React.RefObject<HTMLDivElement | null>
): TreeContextValue {
  const [expanded, setExpanded] = React.useState(
    () => new Set(defaultExpanded)
  );
  const [selected, setSelected] = React.useState<string | null>(
    defaultSelected ?? null
  );
  const [checked, setChecked] = React.useState(() => new Set(defaultChecked));
  const [focusedId, setFocusedId] = React.useState<string | null>(null);

  const toggleExpanded = React.useCallback(
    (id: string) => {
      setExpanded((prev) => {
        const next = new Set(prev);
        const isOpen = next.has(id);
        if (isOpen) next.delete(id);
        else next.add(id);
        onNodeToggle?.(id, !isOpen);
        return next;
      });
    },
    [onNodeToggle]
  );

  const select = React.useCallback(
    (id: string) => {
      setSelected(id);
      onNodeSelect?.(id);
    },
    [onNodeSelect]
  );

  const toggleChecked = React.useCallback(
    (id: string, next: boolean) => {
      setChecked((prev) => {
        const set = new Set(prev);
        if (next) set.add(id);
        else set.delete(id);
        return set;
      });
      onNodeCheck?.(id, next);
    },
    [onNodeCheck]
  );

  return React.useMemo<TreeContextValue>(
    () => ({
      expanded,
      selected,
      checked,
      focusedId,
      toggleExpanded,
      select,
      toggleChecked,
      setFocusedId,
      treeRef,
    }),
    [
      expanded,
      selected,
      checked,
      focusedId,
      toggleExpanded,
      select,
      toggleChecked,
      treeRef,
    ]
  );
}

const Tree = React.forwardRef<HTMLDivElement, TreeProps>(
  (
    {
      className,
      defaultExpanded,
      defaultSelected,
      defaultChecked,
      onNodeToggle,
      onNodeSelect,
      onNodeCheck,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const innerRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(
      forwardedRef,
      () => innerRef.current as HTMLDivElement
    );
    const ctx = useTreeState(
      {
        defaultExpanded,
        defaultSelected,
        defaultChecked,
        onNodeToggle,
        onNodeSelect,
        onNodeCheck,
      },
      innerRef
    );

    return (
      <TreeContext.Provider value={ctx}>
        <div
          ref={innerRef}
          role="tree"
          className={cn('w-full', className)}
          {...props}
        >
          <TreeLevelContext.Provider value={0}>
            {children}
          </TreeLevelContext.Provider>
        </div>
      </TreeContext.Provider>
    );
  }
);
Tree.displayName = 'Tree';

// Move focus to the next / previous visible treeitem, or the first / last.
function focusRelative(
  treeRoot: HTMLElement | null,
  current: HTMLElement,
  to: 'next' | 'prev' | 'first' | 'last'
) {
  if (!treeRoot) return;
  const items = Array.from(
    treeRoot.querySelectorAll<HTMLElement>('[role="treeitem"]')
  );
  if (items.length === 0) return;
  const idx = items.indexOf(current);
  let target: HTMLElement | undefined;
  if (to === 'first') target = items[0];
  else if (to === 'last') target = items[items.length - 1];
  else if (to === 'next') target = items[Math.min(idx + 1, items.length - 1)];
  else target = items[Math.max(idx - 1, 0)];
  target?.focus();
}

// ── TreeItem ─────────────────────────────────────────────────────────────────

export interface TreeItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Stable id for this node — drives expand / select / check state. */
  value: string;
  /**
   * Whether the node can expand. Auto-detected from the presence of a
   * `TreeItemGroup` child; pass explicitly for flat rendering (e.g. the
   * virtualized `TreeView`, where children aren't nested in the DOM).
   */
  expandable?: boolean;
}

const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>(
  (
    {
      className,
      value,
      expandable: expandableProp,
      children,
      onKeyDown,
      onFocus,
      ...props
    },
    forwardedRef
  ) => {
    const tree = useTreeContext('TreeItem');
    const level = React.useContext(TreeLevelContext);

    // Expandable when explicitly set, else when a <TreeItemGroup> is a child.
    const detected = React.useMemo(
      () =>
        React.Children.toArray(children).some(
          (child) => React.isValidElement(child) && child.type === TreeItemGroup
        ),
      [children]
    );
    const expandable = expandableProp ?? detected;

    const expanded = tree.expanded.has(value);
    const selected = tree.selected === value;
    const checkedState = tree.checked.has(value);

    const itemCtx = React.useMemo<TreeItemContextValue>(
      () => ({
        value,
        level,
        expandable,
        expanded,
        selected,
        checked: checkedState,
      }),
      [value, level, expandable, expanded, selected, checkedState]
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;
      const current = e.currentTarget;
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          focusRelative(tree.treeRef.current, current, 'next');
          break;
        case 'ArrowUp':
          e.preventDefault();
          focusRelative(tree.treeRef.current, current, 'prev');
          break;
        case 'Home':
          e.preventDefault();
          focusRelative(tree.treeRef.current, current, 'first');
          break;
        case 'End':
          e.preventDefault();
          focusRelative(tree.treeRef.current, current, 'last');
          break;
        case 'ArrowRight':
          if (expandable && !expanded) {
            e.preventDefault();
            tree.toggleExpanded(value);
          } else if (expandable && expanded) {
            e.preventDefault();
            focusRelative(tree.treeRef.current, current, 'next');
          }
          break;
        case 'ArrowLeft':
          if (expandable && expanded) {
            e.preventDefault();
            tree.toggleExpanded(value);
          }
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          tree.select(value);
          break;
        default:
          break;
      }
    };

    // Lazy roving tabindex: before the tree has been focused, every item is
    // tabbable so Tab can enter at the first; once an item takes focus, only the
    // focused item stays in the tab order.
    const tabIndex =
      tree.focusedId == null ? 0 : tree.focusedId === value ? 0 : -1;

    return (
      <TreeItemContext.Provider value={itemCtx}>
        <div
          ref={forwardedRef}
          role="treeitem"
          aria-level={level + 1}
          aria-selected={selected}
          aria-expanded={expandable ? expanded : undefined}
          tabIndex={tabIndex}
          onKeyDown={handleKeyDown}
          onFocus={(e) => {
            onFocus?.(e);
            if (tree.focusedId !== value) tree.setFocusedId(value);
          }}
          className={cn('outline-none', className)}
          {...props}
        >
          {children}
        </div>
      </TreeItemContext.Provider>
    );
  }
);
TreeItem.displayName = 'TreeItem';

// ── TreeItemTrigger (the visible, clickable row) ──────────────────────────────

export type TreeItemTriggerProps = React.HTMLAttributes<HTMLDivElement>;

const TreeItemTrigger = React.forwardRef<HTMLDivElement, TreeItemTriggerProps>(
  ({ className, style, onClick, children, ...props }, ref) => {
    const tree = useTreeContext('TreeItemTrigger');
    const item = useTreeItemContext('TreeItemTrigger');

    return (
      <div
        ref={ref}
        data-slot="tree-item-trigger"
        data-selected={item.selected || undefined}
        data-expanded={item.expanded || undefined}
        style={{
          paddingLeft: item.level * INDENT_STEP + BASE_PADDING,
          ...style,
        }}
        onClick={(e) => {
          onClick?.(e);
          if (e.defaultPrevented) return;
          // Keep keyboard focus on the owning treeitem when clicking the row.
          (
            e.currentTarget.closest('[role="treeitem"]') as HTMLElement | null
          )?.focus();
          tree.select(item.value);
          if (item.expandable) tree.toggleExpanded(item.value);
        }}
        className={cn(
          'flex w-full cursor-pointer select-none items-center gap-2 rounded-md py-1.5 pr-2 text-sm leading-6 text-foreground transition-colors',
          'hover:bg-[var(--ui-background-status-info)]',
          'data-[selected]:bg-[var(--ui-background-status-info-hover)]',
          // Ring only when THIS row's own treeitem is focus-visible. A direct-child
          // (`>`) selector — not a named group — so a focused parent item never
          // rings its descendants (they share the treeitem role/ancestry).
          '[[role=treeitem]:focus-visible>&]:relative [[role=treeitem]:focus-visible>&]:z-10 [[role=treeitem]:focus-visible>&]:ring-2 [[role=treeitem]:focus-visible>&]:ring-[var(--ui-focus-primary)]',
          className
        )}
        {...props}
      >
        {item.expandable ? (
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            data-slot="tree-item-chevron"
            onClick={(e) => {
              // Toggle only — the row's onClick still selects.
              e.stopPropagation();
              (
                e.currentTarget.closest(
                  '[role="treeitem"]'
                ) as HTMLElement | null
              )?.focus();
              tree.toggleExpanded(item.value);
            }}
            className="inline-flex size-4 shrink-0 items-center justify-center text-[var(--ui-text-on-surface-secondary)] hover:text-foreground"
          >
            {item.expanded ? (
              <ChevronDownIcon size={16} />
            ) : (
              <ChevronRightIcon size={16} />
            )}
          </button>
        ) : (
          <span aria-hidden="true" className="inline-block size-4 shrink-0" />
        )}
        {children}
      </div>
    );
  }
);
TreeItemTrigger.displayName = 'TreeItemTrigger';

// ── TreeItemLabel ─────────────────────────────────────────────────────────────

export type TreeItemLabelProps = React.HTMLAttributes<HTMLSpanElement>;

const TreeItemLabel = React.forwardRef<HTMLSpanElement, TreeItemLabelProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="tree-item-label"
      className={cn('min-w-0 flex-1 truncate', className)}
      {...props}
    />
  )
);
TreeItemLabel.displayName = 'TreeItemLabel';

// ── TreeItemIcon (leading icon) ───────────────────────────────────────────────

export type TreeItemIconProps = React.HTMLAttributes<HTMLSpanElement>;

const TreeItemIcon = React.forwardRef<HTMLSpanElement, TreeItemIconProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      aria-hidden="true"
      data-slot="tree-item-icon"
      className={cn(
        'inline-flex size-4 shrink-0 items-center justify-center text-[var(--ui-text-on-surface-secondary)] [&_svg]:size-4',
        className
      )}
      {...props}
    />
  )
);
TreeItemIcon.displayName = 'TreeItemIcon';

// ── TreeItemCheckbox (wired to tree checked state) ────────────────────────────

export type TreeItemCheckboxProps = Omit<
  React.ComponentPropsWithoutRef<typeof Checkbox>,
  'checked' | 'onCheckedChange'
>;

const TreeItemCheckbox = React.forwardRef<
  React.ComponentRef<typeof Checkbox>,
  TreeItemCheckboxProps
>(({ className, ...props }, ref) => {
  const tree = useTreeContext('TreeItemCheckbox');
  const item = useTreeItemContext('TreeItemCheckbox');
  // The row handles select/expand; the checkbox only toggles its own state.
  // Wrap it so clicks (including the hidden form input's) stop before the row.
  return (
    <span
      data-slot="tree-item-checkbox"
      className="inline-flex shrink-0"
      onClick={(e) => e.stopPropagation()}
    >
      <Checkbox
        ref={ref}
        checked={item.checked}
        onCheckedChange={(next) =>
          tree.toggleChecked(item.value, next === true)
        }
        className={cn('shrink-0', className)}
        {...props}
      />
    </span>
  );
});
TreeItemCheckbox.displayName = 'TreeItemCheckbox';

// ── TreeItemGroup (nested children) ───────────────────────────────────────────

export type TreeItemGroupProps = React.HTMLAttributes<HTMLDivElement>;

const TreeItemGroup = React.forwardRef<HTMLDivElement, TreeItemGroupProps>(
  ({ className, children, ...props }, ref) => {
    const item = useTreeItemContext('TreeItemGroup');
    if (!item.expanded) return null;
    return (
      <div ref={ref} role="group" className={cn(className)} {...props}>
        <TreeLevelContext.Provider value={item.level + 1}>
          {children}
        </TreeLevelContext.Provider>
      </div>
    );
  }
);
TreeItemGroup.displayName = 'TreeItemGroup';

// ── TreeView (data-driven convenience wrapper) ────────────────────────────────

export interface TreeNode {
  id: string;
  label: React.ReactNode;
  /** Leading icon (rendered when `showIcon`). */
  icon?: React.ReactNode;
  /** Trailing slot — e.g. a `<Tag>` badge or meta content. */
  tag?: React.ReactNode;
  children?: TreeNode[];
}

export interface TreeViewProps extends TreeProps {
  data: TreeNode[];
  /** Render a checkbox on every row. */
  showCheckbox?: boolean;
  /** Render each node's `icon`. */
  showIcon?: boolean;
  /**
   * Virtualize the rows — only the visible window is mounted, so very large
   * trees stay fast. Renders a flat list (depth via `aria-level`, not nested
   * DOM) inside a `ScrollArea`. Set `height` to bound the scroll viewport.
   */
  virtualized?: boolean;
  /** Scroll-viewport height when `virtualized` (number = px). Default 320. */
  height?: number | string;
  /** Estimated row height in px for the virtualizer (rows are measured). Default 36. */
  estimateRowHeight?: number;
  /** Rows rendered beyond the visible window on each side. Default 10. */
  overscan?: number;
}

interface RowOpts {
  showCheckbox: boolean;
  showIcon: boolean;
}

function rowContent(node: TreeNode, opts: RowOpts): React.ReactNode {
  return (
    <>
      {opts.showCheckbox && <TreeItemCheckbox />}
      {opts.showIcon && node.icon != null && (
        <TreeItemIcon>{node.icon}</TreeItemIcon>
      )}
      <TreeItemLabel>{node.label}</TreeItemLabel>
      {node.tag != null && <span className="ms-auto shrink-0">{node.tag}</span>}
    </>
  );
}

function renderNodes(nodes: TreeNode[], opts: RowOpts): React.ReactNode {
  return nodes.map((node) => (
    <TreeItem key={node.id} value={node.id}>
      <TreeItemTrigger>{rowContent(node, opts)}</TreeItemTrigger>
      {node.children && node.children.length > 0 && (
        <TreeItemGroup>{renderNodes(node.children, opts)}</TreeItemGroup>
      )}
    </TreeItem>
  ));
}

interface FlatNode {
  node: TreeNode;
  level: number;
  expandable: boolean;
}

// Depth-first flatten of the currently-visible rows (a node's children are
// included only when the node is expanded).
function flattenVisible(nodes: TreeNode[], expanded: Set<string>): FlatNode[] {
  const out: FlatNode[] = [];
  const walk = (list: TreeNode[], level: number) => {
    for (const node of list) {
      const expandable = !!(node.children && node.children.length > 0);
      out.push({ node, level, expandable });
      if (expandable && expanded.has(node.id)) walk(node.children!, level + 1);
    }
  };
  walk(nodes, 0);
  return out;
}

type VirtualTreeProps = Omit<TreeViewProps, 'virtualized'>;

const VirtualTree = React.forwardRef<HTMLDivElement, VirtualTreeProps>(
  (
    {
      data,
      showCheckbox = false,
      showIcon = false,
      height = 320,
      estimateRowHeight = 36,
      overscan = 10,
      className,
      style,
      defaultExpanded,
      defaultSelected,
      defaultChecked,
      onNodeToggle,
      onNodeSelect,
      onNodeCheck,
      ...props
    },
    forwardedRef
  ) => {
    // The ScrollArea root holds the ref; its Base UI viewport is the element
    // that actually scrolls, so the virtualizer observes that. `treeRef` is the
    // inner role="tree" node used for keyboard navigation.
    const rootRef = React.useRef<HTMLDivElement>(null);
    const treeRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(
      forwardedRef,
      () => rootRef.current as HTMLDivElement
    );
    const ctx = useTreeState(
      {
        defaultExpanded,
        defaultSelected,
        defaultChecked,
        onNodeToggle,
        onNodeSelect,
        onNodeCheck,
      },
      treeRef
    );

    const flat = React.useMemo(
      () => flattenVisible(data, ctx.expanded),
      [data, ctx.expanded]
    );

    const virtualizer = useVirtualizer({
      count: flat.length,
      getScrollElement: () =>
        rootRef.current?.querySelector<HTMLElement>(
          '[data-slot="scroll-area-viewport"]'
        ) ?? null,
      estimateSize: () => estimateRowHeight,
      overscan,
    });
    const items = virtualizer.getVirtualItems();
    const opts = { showCheckbox, showIcon };

    return (
      <TreeContext.Provider value={ctx}>
        <ScrollArea
          ref={rootRef}
          className={cn('w-full', className)}
          style={{ height, ...style }}
        >
          <div
            ref={treeRef}
            role="tree"
            style={{
              height: virtualizer.getTotalSize(),
              position: 'relative',
              width: '100%',
            }}
            {...props}
          >
            {items.map((vi) => {
              const { node, level, expandable } = flat[vi.index];
              return (
                <div
                  key={node.id}
                  data-index={vi.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${vi.start}px)`,
                  }}
                >
                  <TreeLevelContext.Provider value={level}>
                    <TreeItem value={node.id} expandable={expandable}>
                      <TreeItemTrigger>
                        {rowContent(node, opts)}
                      </TreeItemTrigger>
                    </TreeItem>
                  </TreeLevelContext.Provider>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </TreeContext.Provider>
    );
  }
);
VirtualTree.displayName = 'VirtualTree';

const TreeView = React.forwardRef<HTMLDivElement, TreeViewProps>(
  (
    {
      data,
      showCheckbox = false,
      showIcon = false,
      virtualized = false,
      ...props
    },
    ref
  ) => {
    if (virtualized) {
      return (
        <VirtualTree
          ref={ref}
          data={data}
          showCheckbox={showCheckbox}
          showIcon={showIcon}
          {...props}
        />
      );
    }
    // `height` / `estimateRowHeight` / `overscan` only apply when virtualized.
    const { height, estimateRowHeight, overscan, ...treeProps } = props;
    void height;
    void estimateRowHeight;
    void overscan;
    return (
      <Tree ref={ref} {...treeProps}>
        {renderNodes(data, { showCheckbox, showIcon })}
      </Tree>
    );
  }
);
TreeView.displayName = 'TreeView';

export {
  Tree,
  TreeItem,
  TreeItemTrigger,
  TreeItemLabel,
  TreeItemIcon,
  TreeItemCheckbox,
  TreeItemGroup,
  TreeView,
};
