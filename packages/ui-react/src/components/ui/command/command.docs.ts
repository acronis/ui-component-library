// Curated prop summaries for AutoTypeTable. The real `CommandProps` extends the
// Base UI Combobox Root props (a large surface); these document the
// command-specific props. `CommandDialog` adds the Dialog open props + `title`.
import type * as React from 'react';

/** A single command in the palette. */
export interface CommandOption {
  /** Unique id; passed to `onSelect` when chosen. */
  value: string;
  /** Display + searchable text (filtering matches this). */
  label: string;
  /** Optional leading icon. */
  icon?: React.ReactNode;
  /** Optional trailing shortcut hint (e.g. `⌘K`). */
  shortcut?: string;
  disabled?: boolean;
}

/** A titled section of commands. */
export interface CommandGroup {
  /** Section heading; omit to render the items ungrouped. */
  heading?: string;
  items: CommandOption[];
}

/** `Command` — the inline command palette. */
export interface CommandProps {
  /** The commands, in groups. */
  commands?: CommandGroup[];
  /** Runs when a command is chosen (click or Enter on the highlighted row). */
  onSelect?: (value: string) => void;
  /** Search input placeholder. */
  placeholder?: string;
  /** Shown when no command matches the query. */
  emptyMessage?: React.ReactNode;
}

/** `CommandDialog` — `Command` inside a Dialog (the ⌘K overlay). */
export interface CommandDialogProps extends CommandProps {
  /** Whether the dialog is open (controlled). */
  open?: boolean;
  /** Fires when the dialog opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean;
  /** Accessible label for the dialog. Default "Command palette". */
  title?: string;
}
