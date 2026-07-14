import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CalendarIcon,
  FileIcon,
  FolderIcon,
  CogIcon,
} from '@constructor-lab/icons-react/stroke-mono';

import { Command, CommandDialog, type CommandGroup } from '../command';
import { Button } from '../../button';

const commands: CommandGroup[] = [
  {
    heading: 'Suggestions',
    items: [
      { value: 'calendar', label: 'Calendar', icon: <CalendarIcon /> },
      {
        value: 'search-file',
        label: 'Search file',
        icon: <FileIcon />,
        shortcut: '⌘F',
      },
      { value: 'open-folder', label: 'Open folder', icon: <FolderIcon /> },
    ],
  },
  {
    heading: 'Settings',
    items: [
      { value: 'profile', label: 'Profile', shortcut: '⌘P' },
      { value: 'preferences', label: 'Preferences', icon: <CogIcon /> },
      { value: 'billing', label: 'Billing', disabled: true },
    ],
  },
];

const meta = {
  title: 'UI/Command',
  component: Command,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { commands, placeholder: 'Type a command or search…' },
  argTypes: {
    commands: {
      control: false,
      description:
        'Grouped commands: `{ heading?, items: { value, label, icon?, shortcut?, disabled? }[] }[]`.',
      table: { type: { summary: 'CommandGroup[]' }, category: 'Content' },
    },
    placeholder: {
      control: 'text',
      description: 'Search input placeholder.',
      table: { type: { summary: 'string' }, category: 'Appearance' },
    },
    emptyMessage: {
      control: 'text',
      description: 'Shown when no command matches the query.',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'No results found.' },
        category: 'Appearance',
      },
    },
    onSelect: { control: false, table: { category: 'Events' } },
  },
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-96 rounded-lg border border-border shadow-md">
      <Command {...args} />
    </div>
  ),
};

// The ⌘K overlay: the palette inside a Dialog. Rendered open for the VR baseline.
export const InDialog: StoryObj = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Open command palette
        </Button>
        <CommandDialog
          open={open}
          onOpenChange={setOpen}
          commands={commands}
          placeholder="Type a command or search…"
          onSelect={() => setOpen(false)}
        />
      </>
    );
  },
  parameters: { snapshot: { animationDelay: 400 } },
};
