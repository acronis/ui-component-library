import * as React from 'react';
import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';

import { cn } from '@/lib/utils';

import { buttonVariants } from '../button';
import { ButtonMenu } from '../button-menu';
import { FittedActions, type FittedAction } from '../fitted-actions';

// The Figma "Toolbar" (node 3897-7199): a horizontal action bar for a
// selection/list context. A left cluster of ghost action buttons sits opposite a
// right cluster carrying a status label ("6 items selected:" / "25 of 1250 items
// loaded") plus optional trailing actions (a "Deselect" button, a "More actions"
// ButtonMenu). The Figma `state` variant (active | disabled) maps to the Base UI
// `disabled` prop — a disabled toolbar greys its actions and typically shows the
// item-count status instead of a selection.
//
// Built on the Base UI Toolbar primitive (`@base-ui/react/toolbar`): Root gives
// `role="toolbar"` + roving-tabindex arrow-key navigation across the items;
// Button / Link are the focusable actions; Group clusters them; Separator is the
// optional divider. Toolbar owns no color tier of its own — the action buttons
// reuse the Button `ghost` tokens (`--ui-button-ghost-*`) and the status text uses
// the shared secondary text token (`text-muted-foreground`).
//
// Base UI disables items via `data-disabled` (it keeps them focusable rather than
// setting the native `disabled` attribute — an a11y choice), so the disabled
// treatment is wired through `data-[disabled]:` selectors, not `disabled:`.

const toolbarActionClass = cn(
  buttonVariants({ variant: 'ghost' }),
  'data-[disabled]:pointer-events-none data-[disabled]:text-[var(--ui-button-ghost-label-color-disabled)] data-[disabled]:[&_svg]:text-[var(--ui-button-ghost-icon-color-disabled)]'
);

export type ToolbarProps = React.ComponentPropsWithoutRef<
  typeof BaseToolbar.Root
>;

const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, ...props }, ref) => (
    <BaseToolbar.Root
      ref={ref}
      data-slot="toolbar"
      className={cn('flex w-full items-center gap-4', className)}
      {...props}
    />
  )
);
Toolbar.displayName = 'Toolbar';

export type ToolbarGroupProps = React.ComponentPropsWithoutRef<
  typeof BaseToolbar.Group
>;

// A cluster of related items. Push a group to the trailing edge with
// `className="ms-auto"` (the right-hand status/actions cluster in the Figma).
const ToolbarGroup = React.forwardRef<HTMLDivElement, ToolbarGroupProps>(
  ({ className, ...props }, ref) => (
    <BaseToolbar.Group
      ref={ref}
      data-slot="toolbar-group"
      className={cn('flex items-center gap-4', className)}
      {...props}
    />
  )
);
ToolbarGroup.displayName = 'ToolbarGroup';

export type ToolbarButtonProps = React.ComponentPropsWithoutRef<
  typeof BaseToolbar.Button
>;

// A ghost action button with roving-tabindex focus. Pass an icon element before
// the label for the `hasIcon` design variant.
const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, ...props }, ref) => (
    <BaseToolbar.Button
      ref={ref}
      data-slot="toolbar-button"
      className={cn(toolbarActionClass, className)}
      {...props}
    />
  )
);
ToolbarButton.displayName = 'ToolbarButton';

export type ToolbarLinkProps = React.ComponentPropsWithoutRef<
  typeof BaseToolbar.Link
>;

// An anchor action styled like a ghost button (roving-tabindex focus).
const ToolbarLink = React.forwardRef<HTMLAnchorElement, ToolbarLinkProps>(
  ({ className, ...props }, ref) => (
    <BaseToolbar.Link
      ref={ref}
      data-slot="toolbar-link"
      className={cn(toolbarActionClass, className)}
      {...props}
    />
  )
);
ToolbarLink.displayName = 'ToolbarLink';

export type ToolbarSeparatorProps = React.ComponentPropsWithoutRef<
  typeof BaseToolbar.Separator
>;

// A divider between item groups. Defaults to a vertical 1px line (the toolbar is
// horizontal) tinted with the shared border token.
const ToolbarSeparator = React.forwardRef<
  HTMLDivElement,
  ToolbarSeparatorProps
>(({ className, ...props }, ref) => (
  <BaseToolbar.Separator
    ref={ref}
    data-slot="toolbar-separator"
    className={cn('mx-1 h-6 w-px shrink-0 bg-border', className)}
    {...props}
  />
));
ToolbarSeparator.displayName = 'ToolbarSeparator';

export type ToolbarStatusProps = React.ComponentPropsWithoutRef<'span'>;

// The non-interactive status label in the trailing cluster ("N items selected:",
// "X of Y items loaded"). Secondary text; not part of the roving focus order.
const ToolbarStatus = React.forwardRef<HTMLSpanElement, ToolbarStatusProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="toolbar-status"
      className={cn(
        'text-sm leading-6 text-muted-foreground whitespace-nowrap',
        className
      )}
      {...props}
    />
  )
);
ToolbarStatus.displayName = 'ToolbarStatus';

// An action item for ToolbarActions (the FittedActions shape).
export type ToolbarActionItem = FittedAction;

export interface ToolbarActionsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** The ordered action list. Trailing items collapse into the menu first. */
  actions: ToolbarActionItem[];
  /** Label for the overflow trigger. Defaults to "More actions". */
  moreLabel?: React.ReactNode;
}

// A width-aware cluster of ghost actions with a "priority+" overflow menu (Figma
// breakpoints node 6262-28276: "if there is no space for all Toolbar actions,
// then last actions must be hidden under More actions"). It delegates the
// measure/overflow behavior to `FittedActions`, rendering each inline action as a
// roving-tabindex `ToolbarButton` and the overflow trigger as a secondary
// `ButtonMenu`.
const ToolbarActions = React.forwardRef<HTMLDivElement, ToolbarActionsProps>(
  ({ actions, moreLabel = 'More actions', className, ...props }, ref) => (
    <FittedActions
      ref={ref}
      data-slot="toolbar-actions"
      actions={actions}
      moreLabel={moreLabel}
      gap={16}
      className={cn('flex-1', className)}
      renderAction={(action, { onSelect, disabled }) => (
        <ToolbarButton onClick={onSelect} disabled={disabled}>
          {action.icon}
          {action.label}
        </ToolbarButton>
      )}
      renderTrigger={({ label }) => (
        <ButtonMenu variant="secondary">{label}</ButtonMenu>
      )}
      {...props}
    />
  )
);
ToolbarActions.displayName = 'ToolbarActions';

export {
  Toolbar,
  ToolbarGroup,
  ToolbarButton,
  ToolbarLink,
  ToolbarSeparator,
  ToolbarStatus,
  ToolbarActions,
};
