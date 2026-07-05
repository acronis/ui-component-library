// AUTO-GENERATED from @spec-lab/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @spec-lab/ui-spec generate:stories
// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { ButtonMenuDropdownTrigger, ButtonMenuDropdownContent, ButtonMenuDropdownSection, ButtonMenuDropdownItem } from '../button-menu-dropdown';
import { PencilIcon } from '@spec-lab/icons-react/stroke-mono';
import { ButtonMenuDropdown } from '../button-menu-dropdown';

const meta = {
  title: 'UI/ButtonMenuDropdown/All States (generated)',
  component: ButtonMenuDropdown,
} satisfies Meta<typeof ButtonMenuDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <ButtonMenuDropdown defaultOpen>
      <ButtonMenuDropdownTrigger>Actions</ButtonMenuDropdownTrigger>
      <ButtonMenuDropdownContent>
        <ButtonMenuDropdownSection>
          <ButtonMenuDropdownItem icon={<PencilIcon />} shortcut="⌘R">Rename</ButtonMenuDropdownItem>
          <ButtonMenuDropdownItem>Duplicate</ButtonMenuDropdownItem>
          <ButtonMenuDropdownItem cascade>Move to</ButtonMenuDropdownItem>
        </ButtonMenuDropdownSection>
      </ButtonMenuDropdownContent>
    </ButtonMenuDropdown>
    </div>
  ),
};
