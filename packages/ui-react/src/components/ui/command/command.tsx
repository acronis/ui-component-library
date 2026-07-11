'use client';

import * as React from 'react';
import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import { MagnifierIcon } from '@spec-lab/icons-react/stroke-mono';

import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '../dialog';

// Command palette. Ported from the legacy shadcn UI kit's `command` (a cmdk wrapper) and rebuilt
// on ui-react conventions per the roadmap ("Command builds on Combobox + Dialog")
// — no cmdk dependency. It's the Base UI Combobox primitive rendered as an
// **always-open, inline** filtered list (Combobox.List renders without a
// Positioner/Popup), driven by data: pass grouped `commands` and an `onSelect`.
// Base UI owns the filtering, keyboard navigation, and combobox/listbox ARIA.
// `CommandDialog` drops it into a Dialog for the ⌘K overlay.
//
// Data-driven rather than composable children because Base UI Combobox filters
// its `items` prop (not arbitrary children) — the same shape the ui-react
// Combobox uses. `bg-popover`/`text-popover-foreground` (no ui-react bridge) →
// `bg-background`/`text-foreground`; the Base UI `data-[highlighted]` row uses
// `bg-accent`. No color is hand-authored.

export interface CommandOption {
  /** Unique id; passed to `onSelect` when chosen. */
  value: string;
  /** Display + searchable text. */
  label: string;
  /** Optional leading icon. */
  icon?: React.ReactNode;
  /** Optional trailing shortcut hint (e.g. `⌘K`). */
  shortcut?: string;
  disabled?: boolean;
}

export interface CommandGroup {
  /** Optional section heading. */
  heading?: string;
  items: CommandOption[];
}

// Base UI recognises a grouped list when each top-level item has an `items[]`.
interface BaseGroup {
  value: string;
  heading?: string;
  items: CommandOption[];
}

export interface CommandProps extends Omit<
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Root<string>>,
  'items' | 'open' | 'defaultOpen' | 'children' | 'onValueChange'
> {
  /** The commands, in groups. A group with no `heading` renders ungrouped. */
  commands?: CommandGroup[];
  /** Runs when a command is chosen (click or Enter on the highlighted row). */
  onSelect?: (value: string) => void;
  placeholder?: string;
  emptyMessage?: React.ReactNode;
  className?: string;
}

const Command = React.forwardRef<HTMLDivElement, CommandProps>(
  (
    {
      commands = [],
      onSelect,
      placeholder = 'Type a command…',
      emptyMessage = 'No results found.',
      className,
      ...rootProps
    },
    ref
  ) => {
    const groups = React.useMemo<BaseGroup[]>(
      () =>
        commands.map((group, i) => ({
          value: group.heading ?? `group-${i}`,
          heading: group.heading,
          items: group.items,
        })),
      [commands]
    );

    return (
      <ComboboxPrimitive.Root
        open
        items={groups}
        onValueChange={(value) => {
          if (typeof value === 'string') onSelect?.(value);
        }}
        {...rootProps}
      >
        <div
          ref={ref}
          data-slot="command"
          className={cn(
            'flex h-full w-full flex-col overflow-hidden rounded-md bg-background text-foreground',
            className
          )}
        >
          <div
            data-slot="command-input-wrapper"
            className="flex items-center gap-2 border-b border-border px-3"
          >
            <MagnifierIcon
              size={16}
              className="shrink-0 text-[var(--ui-text-on-surface-secondary)]"
            />
            <ComboboxPrimitive.Input
              data-slot="command-input"
              placeholder={placeholder}
              className="flex h-11 w-full bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-[var(--ui-text-on-surface-secondary)]"
            />
          </div>

          <ComboboxPrimitive.List
            data-slot="command-list"
            className="max-h-[300px] overflow-y-auto overflow-x-hidden p-1"
          >
            {(group: BaseGroup) => (
              <ComboboxPrimitive.Group
                key={group.value}
                items={group.items}
                data-slot="command-group"
                className="overflow-hidden py-1 text-foreground"
              >
                {group.heading != null && group.heading !== '' && (
                  <ComboboxPrimitive.GroupLabel className="px-2 py-1.5 text-xs font-medium text-[var(--ui-text-on-surface-secondary)]">
                    {group.heading}
                  </ComboboxPrimitive.GroupLabel>
                )}
                <ComboboxPrimitive.Collection>
                  {(item: CommandOption) => (
                    <ComboboxPrimitive.Item
                      key={item.value}
                      value={item.value}
                      disabled={item.disabled}
                      data-slot="command-item"
                      className={cn(
                        'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-foreground outline-none',
                        'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
                        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                        '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-[var(--ui-text-on-surface-secondary)]'
                      )}
                    >
                      {item.icon}
                      <span className="min-w-0 flex-1 truncate">
                        {item.label}
                      </span>
                      {item.shortcut != null && item.shortcut !== '' && (
                        <span
                          data-slot="command-shortcut"
                          className="ms-auto text-xs tracking-widest text-[var(--ui-text-on-surface-secondary)]"
                        >
                          {item.shortcut}
                        </span>
                      )}
                    </ComboboxPrimitive.Item>
                  )}
                </ComboboxPrimitive.Collection>
              </ComboboxPrimitive.Group>
            )}
          </ComboboxPrimitive.List>

          <ComboboxPrimitive.Empty
            data-slot="command-empty"
            className="py-6 text-center text-sm text-[var(--ui-text-on-surface-secondary)] empty:hidden"
          >
            {emptyMessage}
          </ComboboxPrimitive.Empty>
        </div>
      </ComboboxPrimitive.Root>
    );
  }
);
Command.displayName = 'Command';

type DialogRootProps = React.ComponentPropsWithoutRef<typeof Dialog>;

export interface CommandDialogProps extends Pick<
  CommandProps,
  'commands' | 'onSelect' | 'placeholder' | 'emptyMessage'
> {
  /** Whether the dialog is open (controlled). */
  open?: DialogRootProps['open'];
  onOpenChange?: DialogRootProps['onOpenChange'];
  defaultOpen?: DialogRootProps['defaultOpen'];
  /** Accessible label for the dialog. */
  title?: string;
  /** Portal container (e.g. a shadow-root mount for isolated-style previews). */
  portalContainer?: React.ComponentProps<
    typeof DialogContent
  >['portalContainer'];
}

function CommandDialog({
  title = 'Command palette',
  portalContainer,
  commands,
  onSelect,
  placeholder,
  emptyMessage,
  open,
  onOpenChange,
  defaultOpen,
}: CommandDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} defaultOpen={defaultOpen}>
      <DialogContent
        aria-label={title}
        portalContainer={portalContainer}
        className="overflow-hidden p-0 shadow-lg"
      >
        <Command
          commands={commands}
          onSelect={onSelect}
          placeholder={placeholder}
          emptyMessage={emptyMessage}
        />
      </DialogContent>
    </Dialog>
  );
}

export { Command, CommandDialog };
