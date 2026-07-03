# Command

A **command palette** — a searchable, filtered list of grouped commands with
keyboard navigation and per-command shortcuts. Use it inline, or as a ⌘K overlay
via `CommandDialog`.

> **Design-pending v1.** Ported from the legacy shadcn UI kit's `command` (a `cmdk` wrapper) and
> rebuilt on the Base UI **Combobox** primitive + **Dialog** — per the roadmap
> ("Command builds on Combobox + Dialog"), with **no `cmdk` dependency**. Base UI
> owns filtering, keyboard nav, and ARIA. Reconcile against a Figma mockup with
> `/figma-component Command <url> --update` once one lands.

## When to use

- A ⌘K command palette for quick navigation / actions.
- A searchable action menu inside a panel or dialog.

## When not to use

- Picking a value for a form field → use `Combobox` / `InputSelect`.
- A small static action menu → use `DropdownMenu`.

## Usage

It's **data-driven** — pass grouped `commands` (Base UI Combobox filters the
data, so commands are data, not children):

```tsx
const commands = [
  { heading: 'Suggestions', items: [
    { value: 'calendar', label: 'Calendar', icon: <CalendarIcon /> },
    { value: 'search', label: 'Search', shortcut: '⌘S' },
  ] },
  { heading: 'Settings', items: [
    { value: 'profile', label: 'Profile' },
    { value: 'billing', label: 'Billing', disabled: true },
  ] },
];

// inline
<Command commands={commands} onSelect={(value) => run(value)} />

// ⌘K overlay
<CommandDialog
  open={open}
  onOpenChange={setOpen}
  commands={commands}
  onSelect={(value) => { run(value); setOpen(false); }}
/>
```

## Parts

| Concept         | Role       | Notes                                                      |
| --------------- | ---------- | ---------------------------------------------------------- |
| `Command`       | container  | Inline palette (input + filtered list).                    |
| `CommandDialog` | `dialog`   | `Command` inside a Dialog (the ⌘K overlay).                |
| input           | `combobox` | Search field; typing filters.                              |
| list            | `listbox`  | Filtered results.                                          |
| group           | `group`    | A `{ heading, items }` section.                            |
| item            | `option`   | A command `{ value, label, icon?, shortcut?, disabled? }`. |
