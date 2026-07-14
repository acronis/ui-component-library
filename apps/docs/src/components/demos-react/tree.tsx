'use client';

import * as React from 'react';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tag,
  Tree,
  TreeItem,
  TreeItemCheckbox,
  TreeItemGroup,
  TreeItemIcon,
  TreeItemLabel,
  TreeItemTrigger,
  TreeView,
  type TreeNode,
} from '@constructor-lab/ui-react';
import {
  ChevronDownIcon,
  FileIcon,
  FolderIcon,
} from '@constructor-lab/icons-react/stroke-mono';
import { useShadowMount } from '@/components/ShadowDemo';

const data: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    icon: <FolderIcon />,
    children: [
      { id: 'index', label: 'index.ts', icon: <FileIcon /> },
      {
        id: 'components',
        label: 'components',
        icon: <FolderIcon />,
        children: [
          { id: 'button', label: 'button.tsx', icon: <FileIcon /> },
          { id: 'tree', label: 'tree.tsx', icon: <FileIcon /> },
        ],
      },
    ],
  },
  {
    id: 'pkg',
    label: 'package.json',
    icon: <FileIcon />,
    tag: (
      <Tag variant="info" size="sm">
        root
      </Tag>
    ),
  },
];

export function TreeDemo() {
  return (
    <TreeView
      data={data}
      showIcon
      defaultExpanded={['src', 'components']}
      defaultSelected="tree"
      className="w-72"
    />
  );
}

export function TreeCheckboxesDemo() {
  return (
    <TreeView
      data={data}
      showIcon
      showCheckbox
      defaultExpanded={['src']}
      defaultChecked={['index']}
      className="w-72"
    />
  );
}

// A large tree — `virtualized` mounts only the visible window.
const bigData: TreeNode[] = Array.from({ length: 1000 }, (_, i) => ({
  id: `item-${i}`,
  label: `Item ${i + 1}`,
  icon: <FileIcon />,
}));

export function TreeVirtualizedDemo() {
  return (
    <TreeView
      data={bigData}
      showIcon
      virtualized
      height={280}
      defaultSelected="item-3"
      className="w-72 rounded-md border border-border"
    />
  );
}

const leafIds = new Set(['index', 'button', 'tree', 'pkg']);
const labelById: Record<string, string> = {
  src: 'src',
  index: 'index.ts',
  components: 'components',
  button: 'button.tsx',
  tree: 'tree.tsx',
  pkg: 'package.json',
};

// Tree as the menu inside a dropdown — the canonical Figma usage. A select-style
// trigger opens a Popover holding the Tree; picking a leaf sets the value + closes.
export function TreeInDropdownDemo() {
  const mount = useShadowMount();
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string>();
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="secondary" className="w-64 justify-between">
            {selected ? labelById[selected] : 'Select a file'}
            <ChevronDownIcon size={16} />
          </Button>
        }
      />
      <PopoverContent
        portalContainer={mount}
        align="start"
        className="w-64 p-1"
      >
        <TreeView
          data={data}
          showIcon
          defaultExpanded={['src', 'components']}
          defaultSelected={selected}
          onNodeSelect={(id) => {
            setSelected(id);
            if (leafIds.has(id)) setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

// The low-level composable parts, for full control over each row.
export function TreeComposableDemo() {
  return (
    <Tree
      aria-label="Project"
      defaultExpanded={['src']}
      defaultSelected="index"
      className="w-72"
    >
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
              <TreeItemCheckbox />
              <TreeItemLabel>index.ts</TreeItemLabel>
              <Tag variant="info" size="sm" className="ml-auto">
                entry
              </Tag>
            </TreeItemTrigger>
          </TreeItem>
        </TreeItemGroup>
      </TreeItem>
    </Tree>
  );
}
