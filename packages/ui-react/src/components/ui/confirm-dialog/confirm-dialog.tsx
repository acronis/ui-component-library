import type { ReactElement, ReactNode } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  type AlertDialogContentProps,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../alert-dialog';
import { buttonVariants } from '../button';

// PROTOTYPE (see context/opinionated-composites-proposal.md, Tier 1).
//
// ConfirmDialog is the config-driven confirmation composite: one component,
// fixed shape. Where AlertDialog is a compositional part set, ConfirmDialog bakes
// in the *approved* confirmation layout — a title, an optional consequence
// description, and exactly two footer actions (a secondary Cancel + a
// default/destructive Confirm) — so every "are you sure?" reads the same way and
// can't drift into three-button footers, a dismissible Dialog, or a
// destructive-by-default focus. Built on AlertDialog; drop to those parts for
// anything this can't express.

export interface ConfirmDialogProps {
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean;
  /** Open on mount (uncontrolled). */
  defaultOpen?: boolean;
  /** Fires when the dialog opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Optional element that opens the dialog (rendered as the trigger). Omit when
   * driving `open` yourself.
   */
  trigger?: ReactElement;
  /** The question / consequence headline. Required — a confirmation needs a title. */
  title: ReactNode;
  /** A short line naming the consequence (e.g. "This cannot be undone"). */
  description?: ReactNode;
  /** Confirm action label. */
  confirmLabel?: ReactNode;
  /** Cancel action label. */
  cancelLabel?: ReactNode;
  /** Style the confirm action as destructive (irreversible actions). */
  destructive?: boolean;
  /** Called when the confirm action is activated (before the dialog closes). */
  onConfirm?: () => void;
  /** Called when the cancel action is activated (before the dialog closes). */
  onCancel?: () => void;
  /** Portal container. Pass a shadow-root mount for isolated-style previews. */
  portalContainer?: AlertDialogContentProps['portalContainer'];
}

/**
 * A modal confirmation for a single, often destructive action. Built on
 * `AlertDialog`, so it traps focus, defaults focus to Cancel (the safe choice),
 * and cannot be dismissed by clicking outside.
 */
export function ConfirmDialog({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
  portalContainer,
}: ConfirmDialogProps) {
  return (
    <AlertDialog
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      {trigger ? <AlertDialogTrigger render={trigger} /> : null}
      <AlertDialogContent portalContainer={portalContainer}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* Cancel stays the safe default (secondary, focused first by AlertDialog). */}
          <AlertDialogCancel onClick={onCancel}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={
              destructive
                ? buttonVariants({ variant: 'destructive' })
                : undefined
            }
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
