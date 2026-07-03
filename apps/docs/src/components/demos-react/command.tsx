'use client';

import * as React from 'react';
import {
  Button,
  Command,
  CommandDialog,
  type CommandGroup,
} from '@spec-lab/ui-react';
import {
  CalendarIcon,
  CogIcon,
  FileIcon,
  FolderIcon,
} from '@spec-lab/icons-react/stroke-mono';
import { useShadowMount } from '@/components/ShadowDemo';

const commands: CommandGroup[] = [
  {
    heading: 'Suggestions',
    items: [
      { value: 'calendar', label: 'Calendar', icon: <CalendarIcon /> },
      { value: 'search-file', label: 'Search file', icon: <FileIcon />, shortcut: '⌘F' },
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

export function CommandDemo() {
  const [selected, setSelected] = React.useState<string>();
  return (
    <div className="flex flex-col gap-2">
      <div className="w-96 rounded-lg border border-border shadow-md">
        <Command commands={commands} onSelect={setSelected} />
      </div>
      <p className="text-sm text-muted-foreground">
        {selected ? `Ran: ${selected}` : 'Pick a command.'}
      </p>
    </div>
  );
}

export function CommandDialogDemo() {
  const mount = useShadowMount();
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string>();
  return (
    <div className="flex flex-col gap-2">
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open command palette
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        portalContainer={mount}
        commands={commands}
        onSelect={(value) => {
          setSelected(value);
          setOpen(false);
        }}
      />
      <p className="text-sm text-muted-foreground">
        {selected ? `Ran: ${selected}` : 'Press the button to open.'}
      </p>
    </div>
  );
}
