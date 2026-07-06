// AUTO-GENERATED from @spec-lab/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @spec-lab/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { MenuTrigger, MenuContent, MenuSection, MenuItem } from '../menu';
import { PencilIcon } from '@spec-lab/icons-react/stroke-mono';
import { Menu } from '../menu';

const meta = {
  title: 'UI/Menu/All States (generated)',
  component: Menu,
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Menu defaultOpen>
        <MenuTrigger>Actions</MenuTrigger>
        <MenuContent>
          <MenuSection>
            <MenuItem icon={<PencilIcon />} shortcut="⌘R">
              Rename
            </MenuItem>
            <MenuItem>Duplicate</MenuItem>
            <MenuItem cascade>Move to</MenuItem>
          </MenuSection>
        </MenuContent>
      </Menu>
    </div>
  ),
};
