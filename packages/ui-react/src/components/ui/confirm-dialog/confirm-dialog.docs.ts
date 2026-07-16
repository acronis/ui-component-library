import type { ReactElement, ReactNode } from 'react';

// Curated prop surface for the docs `<AutoTypeTable>`. The runtime
// `ConfirmDialogProps` uses an indexed-access type for `portalContainer` (from
// AlertDialog) that AutoTypeTable can't resolve cleanly; this companion documents
// the caller-facing shape. (The runtime type lives in confirm-dialog.tsx; this
// file is never bundled.)

/** Props for `ConfirmDialog`. */
export interface ConfirmDialogProps {
  /** The question / headline. Required — a confirmation always has a title. */
  title: ReactNode;
  /** A short line naming the consequence (e.g. "This cannot be undone"). */
  description?: ReactNode;
  /** Confirm action label (default "Confirm"). */
  confirmLabel?: ReactNode;
  /** Cancel action label (default "Cancel"). */
  cancelLabel?: ReactNode;
  /** Style the confirm action as destructive (irreversible actions). */
  destructive?: boolean;
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean;
  /** Open on mount (uncontrolled). */
  defaultOpen?: boolean;
  /** Fires when the dialog opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Called when the confirm action is activated (before the dialog closes). */
  onConfirm?: () => void;
  /** Called when the cancel action is activated (before the dialog closes). */
  onCancel?: () => void;
  /** Optional element that opens the dialog. Omit when driving `open` yourself. */
  trigger?: ReactElement;
  /** Portal container. Pass a shadow-root mount for isolated-style previews. */
  portalContainer?: HTMLElement | null;
}
