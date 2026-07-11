import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  BinIcon,
  FilesIcon,
  PencilIcon,
} from '@spec-lab/icons-react/stroke-mono';

import {
  ButtonMenuDropdown,
  ButtonMenuDropdownContent,
  ButtonMenuDropdownItem,
  ButtonMenuDropdownSection,
  ButtonMenuDropdownTrigger,
} from '../button-menu-dropdown';

const meta = {
  title: 'UI/ButtonMenuDropdown',
  component: ButtonMenuDropdown,
  parameters: {
    // Interactive menu — rendered open so the VR baseline captures the panel.
    layout: 'centered',
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controlled open state of the dropdown panel.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state when uncontrolled.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    onOpenChange: {
      control: false,
      description: 'Fired when the panel opens or closes.',
      table: {
        type: { summary: '(open: boolean) => void' },
        category: 'Events',
      },
    },
    modal: {
      control: 'boolean',
      description: 'Whether the menu traps focus / blocks outside interaction.',
      table: { type: { summary: 'boolean' }, category: 'Behavior' },
    },
  },
} satisfies Meta<typeof ButtonMenuDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ButtonMenuDropdown defaultOpen>
      <ButtonMenuDropdownTrigger>Actions</ButtonMenuDropdownTrigger>
      <ButtonMenuDropdownContent>
        <ButtonMenuDropdownSection>
          <ButtonMenuDropdownItem>Rename</ButtonMenuDropdownItem>
          <ButtonMenuDropdownItem>Duplicate</ButtonMenuDropdownItem>
          <ButtonMenuDropdownItem>Archive</ButtonMenuDropdownItem>
        </ButtonMenuDropdownSection>
      </ButtonMenuDropdownContent>
    </ButtonMenuDropdown>
  ),
};

export const WithExtras: Story = {
  render: () => (
    <ButtonMenuDropdown defaultOpen>
      <ButtonMenuDropdownTrigger>Actions</ButtonMenuDropdownTrigger>
      <ButtonMenuDropdownContent>
        <ButtonMenuDropdownSection>
          <ButtonMenuDropdownItem icon={<PencilIcon />} shortcut="⌘R">
            Rename
          </ButtonMenuDropdownItem>
          <ButtonMenuDropdownItem icon={<FilesIcon />} shortcut="⌘C">
            Copy
          </ButtonMenuDropdownItem>
          <ButtonMenuDropdownItem cascade>Move to</ButtonMenuDropdownItem>
        </ButtonMenuDropdownSection>
        <ButtonMenuDropdownSection>
          <ButtonMenuDropdownItem icon={<BinIcon />}>
            Delete
          </ButtonMenuDropdownItem>
          <ButtonMenuDropdownItem disabled>Unavailable</ButtonMenuDropdownItem>
        </ButtonMenuDropdownSection>
      </ButtonMenuDropdownContent>
    </ButtonMenuDropdown>
  ),
};
