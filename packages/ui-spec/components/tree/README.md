# Tree

A hierarchical **tree menu** — used inside dropdowns and as a standalone tree
view. Rows nest with an indent, expand/collapse via a chevron, and support an
optional checkbox, leading icon, and a trailing slot (e.g. a `Tag`).

> **Design-pending v1.** Ported from ui-legacy's `tree` and reconciled against the
> Figma "Tree" component set (node `2847-8319`). The legacy ad-hoc `--tree-*`
> styling is dropped for semantic `--ui-*` tokens; a dedicated `--ui-tree-*` tier
> and the Figma per-state focus fill are deferred to a `/figma-component --update`.

## When to use

- A dropdown or panel that navigates a nested structure (files, org units,
  categories, saved filters).
- Multi-select over a hierarchy (with checkboxes).
- A standalone tree view of hierarchical data.

## When not to use

- A flat list → use a list / menu instead.
- A single-level disclosure → use `Collapsible` or `Accordion`.
- Breadcrumb-style location → use `Breadcrumb`.

## Two ways to use it

- **Composable parts** — full control over each row's content:

  ```tsx
  <Tree defaultExpanded={['src']} defaultSelected="index">
    <TreeItem value="src">
      <TreeItemTrigger>
        <TreeItemIcon>
          <FolderIcon />
        </TreeItemIcon>
        <TreeItemLabel>src</TreeItemLabel>
      </TreeItemTrigger>
      <TreeItemGroup>
        <TreeItem value="index">
          <TreeItemTrigger>
            <TreeItemLabel>index.ts</TreeItemLabel>
          </TreeItemTrigger>
        </TreeItem>
      </TreeItemGroup>
    </TreeItem>
  </Tree>
  ```

- **Data-driven `TreeView`** — pass a `TreeNode[]`:

  ```tsx
  <TreeView data={nodes} showIcon showCheckbox defaultExpanded={['src']} />
  ```

## Parts

| Part               | Element    | Role       | Notes                                        |
| ------------------ | ---------- | ---------- | -------------------------------------------- |
| `Tree`             | `div`      | `tree`     | Root; owns state + keyboard nav.             |
| `TreeItem`         | `div`      | `treeitem` | One node; `value` is its id. Focusable.      |
| `TreeItemTrigger`  | `div`      | —          | The clickable, indented row.                 |
| `TreeItemLabel`    | `span`     | —          | Node label.                                  |
| `TreeItemIcon`     | `span`     | —          | Optional leading icon.                       |
| `TreeItemCheckbox` | `Checkbox` | `checkbox` | Optional; toggles without selecting the row. |
| `TreeItemGroup`    | `div`      | `group`    | Nested children; renders only when expanded. |
| `TreeView`         | `Tree`     | `tree`     | Data-driven wrapper over the parts.          |
