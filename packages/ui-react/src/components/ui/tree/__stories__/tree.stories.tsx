import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ChevronDownIcon,
  FileIcon,
  FolderIcon,
} from '@spec-lab/icons-react/stroke-mono';

import {
  Tree,
  TreeItem,
  TreeItemCheckbox,
  TreeItemGroup,
  TreeItemIcon,
  TreeItemLabel,
  TreeItemTrigger,
  TreeView,
  type TreeNode,
} from '../tree';
import { Tag } from '../../tag';
import { Button } from '../../button';
import { Popover, PopoverContent, PopoverTrigger } from '../../popover';

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
        Label
      </Tag>
    ),
  },
];

const meta = {
  title: 'UI/Tree',
  component: TreeView,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    data,
    showIcon: true,
    defaultExpanded: ['src', 'components'],
    defaultSelected: 'tree',
  },
  argTypes: {
    data: {
      control: false,
      description: 'The node tree: `{ id, label, icon?, tag?, children? }[]`.',
      table: { type: { summary: 'TreeNode[]' }, category: 'Content' },
    },
    showCheckbox: {
      control: 'boolean',
      description: 'Render a checkbox on every row.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Appearance' },
    },
    showIcon: {
      control: 'boolean',
      description: "Render each node's `icon`.",
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'Appearance' },
    },
    defaultExpanded: {
      control: 'object',
      description: 'Node ids expanded on first render (uncontrolled).',
      table: { type: { summary: 'string[]' }, category: 'Behavior' },
    },
    defaultSelected: {
      control: 'text',
      description: 'Node id selected on first render (uncontrolled).',
      table: { type: { summary: 'string' }, category: 'Behavior' },
    },
    defaultChecked: {
      control: 'object',
      description: 'Node ids checked on first render (uncontrolled).',
      table: { type: { summary: 'string[]' }, category: 'Behavior' },
    },
    onNodeToggle: { control: false, table: { category: 'Events' } },
    onNodeSelect: { control: false, table: { category: 'Events' } },
    onNodeCheck: { control: false, table: { category: 'Events' } },
  },
} satisfies Meta<typeof TreeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCheckboxes: Story = {
  args: {
    showCheckbox: true,
    showIcon: true,
    defaultChecked: ['index', 'button'],
  },
};

export const WithTags: Story = {
  args: {
    showIcon: true,
    defaultExpanded: ['src'],
    defaultSelected: undefined,
    data: [
      {
        id: 'src',
        label: 'src',
        icon: <FolderIcon />,
        tag: (
          <Tag variant="info" size="sm">
            12
          </Tag>
        ),
        children: [
          {
            id: 'index',
            label: 'index.ts',
            icon: <FileIcon />,
            tag: (
              <Tag variant="warning" size="sm">
                modified
              </Tag>
            ),
          },
        ],
      },
    ],
  },
};

// A large tree — `virtualized` mounts only the visible window (here ~8 of 1000
// rows), inside a fixed-height scroll viewport.
const bigData: TreeNode[] = Array.from({ length: 1000 }, (_, i) => ({
  id: `item-${i}`,
  label: `Item ${i + 1}`,
  icon: <FileIcon />,
}));

export const LongVirtualized: StoryObj = {
  render: () => (
    <TreeView
      data={bigData}
      showIcon
      virtualized
      height={280}
      defaultSelected="item-3"
      className="w-72 rounded-md border border-border"
    />
  ),
};

// Flatten the demo data into id -> label and the set of leaf ids, so the
// dropdown can show the picked value and close only when a leaf is chosen.
const flat = (() => {
  const labels: Record<string, string> = {};
  const leaves = new Set<string>();
  const walk = (list: TreeNode[]) => {
    for (const n of list) {
      labels[n.id] = typeof n.label === 'string' ? n.label : n.id;
      if (n.children?.length) walk(n.children);
      else leaves.add(n.id);
    }
  };
  walk(data);
  return { labels, leaves };
})();

// Tree as the menu inside a dropdown — the canonical Figma usage ("a tree menu
// placed in dropdowns"). A select-style trigger opens a Popover holding the
// Tree; selecting a leaf updates the value and closes. Rendered open (pinned
// selection) so the VR baseline captures the trigger + tree together.
function TreeDropdown() {
  const [open, setOpen] = React.useState(true);
  const [selected, setSelected] = React.useState('tree');
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="secondary" className="w-64 justify-between">
            {flat.labels[selected] ?? 'Select a file'}
            <ChevronDownIcon size={16} />
          </Button>
        }
      />
      <PopoverContent align="start" className="w-64 p-1">
        <TreeView
          data={data}
          showIcon
          defaultExpanded={['src', 'components']}
          defaultSelected={selected}
          onNodeSelect={(id) => {
            setSelected(id);
            if (flat.leaves.has(id)) setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export const InDropdown: StoryObj = {
  render: () => <TreeDropdown />,
  parameters: { snapshot: { animationDelay: 400 } },
};

// The low-level composable parts — full control over each row's content.
export const Composable: StoryObj = {
  render: () => (
    <Tree aria-label="Project" defaultExpanded={['src']} defaultSelected="index">
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
              <TreeItemIcon>
                <FileIcon />
              </TreeItemIcon>
              <TreeItemLabel>index.ts</TreeItemLabel>
            </TreeItemTrigger>
          </TreeItem>
          <TreeItem value="readme">
            <TreeItemTrigger>
              <TreeItemCheckbox />
              <TreeItemLabel>README.md</TreeItemLabel>
              <Tag variant="info" size="sm" className="ml-auto">
                Label
              </Tag>
            </TreeItemTrigger>
          </TreeItem>
        </TreeItemGroup>
      </TreeItem>
    </Tree>
  ),
};
