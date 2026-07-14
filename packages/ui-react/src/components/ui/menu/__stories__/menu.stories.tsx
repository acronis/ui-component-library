import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import {
  BinIcon,
  FilesIcon,
  FolderIcon,
  PencilIcon,
} from '@constructor-lab/icons-react/stroke-mono';

import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSection,
  MenuSeparator,
  MenuSubmenu,
  MenuSubmenuContent,
  MenuSubmenuTrigger,
  MenuTrigger,
} from '../menu';

const meta = {
  title: 'UI/Menu',
  component: Menu,
  parameters: {
    // Interactive menu — rendered open so the VR baseline captures the panel.
    layout: 'centered',
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controlled open state of the menu panel.',
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
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Menu defaultOpen>
      <MenuTrigger>Actions</MenuTrigger>
      <MenuContent>
        <MenuSection>
          <MenuItem>Rename</MenuItem>
          <MenuItem>Duplicate</MenuItem>
          <MenuItem>Archive</MenuItem>
        </MenuSection>
      </MenuContent>
    </Menu>
  ),
};

export const WithSectionsAndExtras: Story = {
  render: () => (
    <Menu defaultOpen>
      <MenuTrigger>Actions</MenuTrigger>
      <MenuContent>
        <MenuSection>
          <MenuItem icon={<PencilIcon />} shortcut="⌘R">
            Rename
          </MenuItem>
          <MenuItem icon={<FilesIcon />} shortcut="⌘C">
            Copy
          </MenuItem>
          <MenuItem cascade>Move to</MenuItem>
        </MenuSection>
        <MenuSection>
          <MenuItem icon={<BinIcon />}>Delete</MenuItem>
          <MenuItem disabled>Unavailable</MenuItem>
        </MenuSection>
      </MenuContent>
    </Menu>
  ),
};

// A cascaded menu whose "Move to" row opens a live submenu, which nests a deeper
// one — driven by the Base UI SubmenuRoot / SubmenuTrigger primitives. All levels
// are rendered open so the VR baseline captures the cascade.
export const CascadedSubmenu: Story = {
  render: () => (
    <Menu defaultOpen>
      <MenuTrigger>Actions</MenuTrigger>
      <MenuContent>
        <MenuSection>
          <MenuItem icon={<PencilIcon />} shortcut="⌘R">
            Rename
          </MenuItem>
          <MenuItem icon={<FilesIcon />} shortcut="⌘C">
            Copy
          </MenuItem>
          <MenuSubmenu defaultOpen>
            <MenuSubmenuTrigger icon={<FolderIcon />}>
              Move to
            </MenuSubmenuTrigger>
            <MenuSubmenuContent>
              <MenuSection>
                <MenuItem>Documents</MenuItem>
                <MenuItem>Downloads</MenuItem>
                <MenuSubmenu defaultOpen>
                  <MenuSubmenuTrigger>Projects</MenuSubmenuTrigger>
                  <MenuSubmenuContent>
                    <MenuSection>
                      <MenuItem>Facet</MenuItem>
                      <MenuItem>Constructor Lab</MenuItem>
                    </MenuSection>
                  </MenuSubmenuContent>
                </MenuSubmenu>
              </MenuSection>
            </MenuSubmenuContent>
          </MenuSubmenu>
        </MenuSection>
        <MenuSection>
          <MenuItem icon={<BinIcon />}>Delete</MenuItem>
        </MenuSection>
      </MenuContent>
    </Menu>
  ),
};

export const CheckboxAndRadio: Story = {
  render: function CheckboxAndRadioStory() {
    const [grid, setGrid] = useState(true);
    const [density, setDensity] = useState('comfortable');
    return (
      <Menu defaultOpen>
        <MenuTrigger>View</MenuTrigger>
        <MenuContent className="w-56">
          <MenuLabel>Appearance</MenuLabel>
          <MenuCheckboxItem checked={grid} onCheckedChange={setGrid}>
            Show grid
          </MenuCheckboxItem>
          <MenuSeparator />
          <MenuLabel>Density</MenuLabel>
          <MenuRadioGroup value={density} onValueChange={setDensity}>
            <MenuRadioItem value="comfortable">Comfortable</MenuRadioItem>
            <MenuRadioItem value="compact">Compact</MenuRadioItem>
          </MenuRadioGroup>
        </MenuContent>
      </Menu>
    );
  },
};

// The cascade in a right-to-left context: the panel opens to the inline-end
// (left) side, the leading icon and label sit on the right, and the cascade
// chevron flips (`rtl:rotate-180`). RTL positioning comes from Base UI's
// `DirectionProvider`; the CSS mirroring from the document `dir`. A real app
// sets `dir` on the document root (so portaled popups inherit it) and wraps once
// in `DirectionProvider` — the decorator below mirrors that; the preview's global
// decorator resets `dir` to LTR for every other story.
export const CascadedSubmenuRTL: Story = {
  name: 'Cascaded Submenu (RTL)',
  decorators: [
    (Story) => {
      document.documentElement.dir = 'rtl';
      return <Story />;
    },
  ],
  render: () => (
    <DirectionProvider direction="rtl">
      <Menu defaultOpen>
        <MenuTrigger>Actions</MenuTrigger>
        <MenuContent>
          <MenuSection>
            <MenuItem icon={<PencilIcon />} shortcut="⌘R">
              Rename
            </MenuItem>
            <MenuItem icon={<FilesIcon />} shortcut="⌘C">
              Copy
            </MenuItem>
            <MenuSubmenu defaultOpen>
              <MenuSubmenuTrigger icon={<FolderIcon />}>
                Move to
              </MenuSubmenuTrigger>
              <MenuSubmenuContent>
                <MenuSection>
                  <MenuItem>Documents</MenuItem>
                  <MenuItem>Downloads</MenuItem>
                </MenuSection>
              </MenuSubmenuContent>
            </MenuSubmenu>
          </MenuSection>
          <MenuSection>
            <MenuItem icon={<BinIcon />}>Delete</MenuItem>
          </MenuSection>
        </MenuContent>
      </Menu>
    </DirectionProvider>
  ),
};

export const LongLabels: Story = {
  render: () => (
    <Menu defaultOpen>
      <MenuTrigger>Actions</MenuTrigger>
      <MenuContent className="max-w-[16rem]">
        <MenuSection>
          <MenuItem icon={<FilesIcon />}>
            A very long menu item label that truncates with an ellipsis
          </MenuItem>
          <MenuItem shortcut="⌘K">Short</MenuItem>
        </MenuSection>
      </MenuContent>
    </Menu>
  ),
};
