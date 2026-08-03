# Toast

A transient notification shown in a corner stack — triggered imperatively with
the `toast(...)` API and rendered by a single `<Toaster>` region.

> **Status: ready.** Ported from the legacy shadcn UI kit `sonner` wrapper,
> rebuilt on the Base UI toast manager (no Sonner dependency) and bound to its own
> `--ui-toast-*` tier (Figma node `7421:126262`): a white card with a 1px status
> border, a status bar down the leading edge, a full-color status icon and a
> compact dismiss button. The five design statuses are `info`, `success`,
> `warning`, `critical` and `danger` (called `error` here); `toast()` and
> `toast.loading()` have no design counterpart and stay neutral.

## When to use

- Brief, low-priority feedback for an action (saved, copied, undo).
- Background operation status (loading → success/error via `toast.promise`).

## When not to use

- For information the user must act on or must not miss — use a `Dialog` or an
  inline message; toasts auto-dismiss.
- For persistent, in-page status — use an inline banner/alert surface.

## Setup

Render one `<Toaster>` near the app root, then call `toast` anywhere:

```tsx
import { Toaster, toast } from '@constructor-lab/ui-react';

// app root
<Toaster />;

// anywhere
toast.success('Profile saved', { description: 'Your changes were saved.' });
toast.critical('Backup at risk', { description: 'The last two runs failed.' });
toast('Event created', {
  description: 'Monday at 6:00 PM',
  action: { label: 'Undo', onClick: undo },
});

// tie to a promise
toast.promise(save(), {
  loading: 'Saving…',
  success: 'Saved',
  error: 'Could not save',
});
```

## Parts

| Part           | Element | Purpose                                     |
| -------------- | ------- | ------------------------------------------- |
| `root`         | div     | The `role="region"` viewport / toast stack. |
| `toast`        | div     | A single notification card.                 |
| `toast-accent` | span    | Status bar over the card's leading edge.    |
| `icon`         | span    | Leading status glyph / spinner.             |
| `content`      | div     | Column holding the text block and actions.  |
| `title`        | div     | First line (`headings/body-heading`).       |
| `description`  | div     | Secondary line.                             |
| `action`       | button  | Optional inline action, aligned with text.  |
| `close`        | button  | Dismiss (✕) button (`TimesSmall`).          |
