// AUTO-GENERATED from @spec-lab/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @spec-lab/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { TreeItem, TreeItemGroup, TreeItemLabel, TreeItemTrigger } from '../tree';
import { Tree } from '../tree';

const meta = {
  title: 'UI/Tree/All States (generated)',
  component: Tree,
} satisfies Meta<typeof Tree>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Tree aria-label="Files" defaultExpanded={['a']} defaultSelected="a1">
      <TreeItem value="a">
        <TreeItemTrigger>
          <TreeItemLabel>Parent</TreeItemLabel>
        </TreeItemTrigger>
        <TreeItemGroup>
          <TreeItem value="a1">
            <TreeItemTrigger>
              <TreeItemLabel>Child</TreeItemLabel>
            </TreeItemTrigger>
          </TreeItem>
        </TreeItemGroup>
      </TreeItem>
    </Tree>
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: () => <Tree aria-label="Files" defaultExpanded={['a']} defaultSelected="a1">
      <TreeItem value="a">
        <TreeItemTrigger>
          <TreeItemLabel>Parent</TreeItemLabel>
        </TreeItemTrigger>
        <TreeItemGroup>
          <TreeItem value="a1">
            <TreeItemTrigger>
              <TreeItemLabel>Child</TreeItemLabel>
            </TreeItemTrigger>
          </TreeItem>
        </TreeItemGroup>
      </TreeItem>
    </Tree>,
};

export const FocusVisible: Story = {
  render: () => <Tree aria-label="Files" defaultExpanded={['a']} defaultSelected="a1">
      <TreeItem value="a">
        <TreeItemTrigger>
          <TreeItemLabel>Parent</TreeItemLabel>
        </TreeItemTrigger>
        <TreeItemGroup>
          <TreeItem value="a1">
            <TreeItemTrigger>
              <TreeItemLabel>Child</TreeItemLabel>
            </TreeItemTrigger>
          </TreeItem>
        </TreeItemGroup>
      </TreeItem>
    </Tree>,
  // Real keyboard focus — paints :focus-visible without a pseudo-states addon.
  play: async () => {
    await userEvent.tab();
  },
};
