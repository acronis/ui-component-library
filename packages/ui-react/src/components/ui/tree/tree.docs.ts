// Curated prop summaries for AutoTypeTable. The real prop types extend
// `HTMLAttributes<HTMLDivElement>` (a large surface); these document the
// Tree-specific props. The composable parts (TreeItem, TreeItemTrigger, …) take
// their element's native attributes plus, on TreeItem, a required `value`.
import type * as React from 'react';

/** A node in the data-driven `TreeView`. */
export interface TreeNode {
  /** Stable id — the key for expand / select / check state. */
  id: string;
  /** The row's text (or content). */
  label: React.ReactNode;
  /** Leading icon, rendered when `showIcon` is set. */
  icon?: React.ReactNode;
  /** Trailing slot — e.g. a `<Tag>` badge or meta content. */
  tag?: React.ReactNode;
  /** Child nodes; presence makes the node expandable. */
  children?: TreeNode[];
}

/** Props shared by `Tree` (composable root) and `TreeView` (data-driven). */
export interface TreeProps {
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

/** `TreeView` — the data-driven convenience wrapper over the parts. */
export interface TreeViewProps extends TreeProps {
  /** The node tree. */
  data: TreeNode[];
  /** Render a checkbox on every row. */
  showCheckbox?: boolean;
  /** Render each node's `icon`. */
  showIcon?: boolean;
  /** Mount only the visible window of rows so large trees stay fast. */
  virtualized?: boolean;
  /** Scroll-viewport height when `virtualized` (number = px). Default 320. */
  height?: number | string;
  /** Estimated row height in px for the virtualizer (rows are measured). Default 36. */
  estimateRowHeight?: number;
  /** Rows rendered beyond the visible window on each side. Default 10. */
  overscan?: number;
}
