'use client';

import * as React from 'react';
import { Autocomplete as AutocompletePrimitive } from '@base-ui/react/autocomplete';
import { TimesIcon } from '@constructor-lab/icons-react/stroke-mono';

import { usePortalContainer } from '@/lib/portal-container';
import { cn } from '@/lib/utils';

// A free-text input with a filtered list of suggestions, built on Base UI's
// Autocomplete primitive. Unlike `Combobox` (which selects a value from a fixed
// list and constrains the input to it), Autocomplete keeps the typed text as the
// value and merely *suggests* completions — use it for search-as-you-type,
// tag/email entry, and open-ended fields. There is no `--ui-autocomplete-*` tier,
// so it reuses the `--ui-input-select-*` tokens (already imported) — its field
// box and dropdown match InputSelect / Combobox. The Root filters `items` by the
// input value automatically.
//
// Aliased directly to the Base UI Root (not wrapped in a generic function) to
// preserve its flat-items / grouped-items call overloads.
const Autocomplete = AutocompletePrimitive.Root;

export interface AutocompleteInputProps extends Omit<
  React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.Input>,
  'className'
> {
  className?: string;
  /** Wrapper (box) className. */
  containerClassName?: string;
  /** Show a clear (✕) button while the field has a value. */
  clearable?: boolean;
}

const AutocompleteInput = React.forwardRef<
  HTMLInputElement,
  AutocompleteInputProps
>(({ className, containerClassName, clearable, ...props }, ref) => (
  <AutocompletePrimitive.InputGroup
    className={cn(
      'group flex h-[var(--ui-input-select-global-box-height)] w-full min-w-0 items-center gap-[var(--ui-input-select-global-box-gap)] rounded-[var(--ui-input-select-global-box-border-radius)] border bg-[var(--ui-input-select-global-box-color-idle)] border-[var(--ui-input-select-normal-box-border-color-idle)] px-[var(--ui-input-select-global-box-padding-x)] text-sm leading-6 transition-colors',
      'not-has-disabled:hover:bg-[var(--ui-input-select-global-box-color-hover)] not-has-disabled:hover:border-[var(--ui-input-select-normal-box-border-color-hover)]',
      'has-[input:focus-visible]:border-[var(--ui-input-select-normal-box-border-color-hover)] has-[input:focus-visible]:ring-[3px] has-[input:focus-visible]:ring-[var(--ui-focus-primary)]',
      'has-disabled:cursor-not-allowed has-disabled:border-[var(--ui-input-select-normal-box-border-color-disabled)] has-disabled:bg-[var(--ui-input-select-global-box-color-disabled)]',
      'has-[input[aria-invalid=true]]:border-[var(--ui-input-select-error-box-border-color-idle)] has-[input[aria-invalid=true]:focus-visible]:ring-[var(--ui-focus-error)]',
      containerClassName
    )}
  >
    <AutocompletePrimitive.Input
      ref={ref}
      className={cn(
        'min-w-0 flex-1 bg-transparent text-[var(--ui-input-select-global-value-color-idle)] outline-none placeholder:text-[var(--ui-input-select-global-placeholder-color-idle)] disabled:cursor-not-allowed disabled:text-[var(--ui-input-select-global-value-color-disabled)]',
        className
      )}
      {...props}
    />
    {clearable && (
      <AutocompletePrimitive.Clear
        aria-label="Clear"
        className="flex shrink-0 cursor-pointer items-center text-[var(--ui-input-select-normal-icon-expand-color-idle)] outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)] data-[disabled]:hidden"
      >
        <TimesIcon size={16} />
      </AutocompletePrimitive.Clear>
    )}
  </AutocompletePrimitive.InputGroup>
));
AutocompleteInput.displayName = 'AutocompleteInput';

export interface AutocompleteContentProps extends React.ComponentPropsWithoutRef<
  typeof AutocompletePrimitive.Popup
> {
  sideOffset?: number;
  align?: AutocompletePrimitive.Positioner.Props['align'];
  side?: AutocompletePrimitive.Positioner.Props['side'];
  /** Container to portal into (e.g. a shadow root, so the popup inherits styles). */
  portalContainer?: AutocompletePrimitive.Portal.Props['container'];
}

const AutocompleteContent = React.forwardRef<
  React.ComponentRef<typeof AutocompletePrimitive.Popup>,
  AutocompleteContentProps
>(
  (
    {
      className,
      children,
      sideOffset = 4,
      align = 'start',
      side = 'bottom',
      portalContainer,
      ...props
    },
    ref
  ) => {
    const ctxContainer = usePortalContainer();
    const resolvedContainer = portalContainer ?? ctxContainer;

    return (
      <AutocompletePrimitive.Portal container={resolvedContainer}>
        <AutocompletePrimitive.Positioner
          sideOffset={sideOffset}
          align={align}
          side={side}
          className="z-50 outline-none"
        >
          <AutocompletePrimitive.Popup
            ref={ref}
            className={cn(
              'max-h-[var(--available-height)] min-w-[var(--anchor-width)] overflow-y-auto rounded-[var(--ui-input-select-dropdown-container-border-radius)] border border-[var(--ui-input-select-dropdown-container-border-color)] bg-[var(--ui-input-select-dropdown-container-color)] py-[var(--ui-input-select-dropdown-container-padding-y)] text-sm shadow-md outline-none',
              className
            )}
            {...props}
          >
            {children}
          </AutocompletePrimitive.Popup>
        </AutocompletePrimitive.Positioner>
      </AutocompletePrimitive.Portal>
    );
  }
);
AutocompleteContent.displayName = 'AutocompleteContent';

const AutocompleteList = React.forwardRef<
  React.ComponentRef<typeof AutocompletePrimitive.List>,
  React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.List>
>(({ className, ...props }, ref) => (
  <AutocompletePrimitive.List
    ref={ref}
    className={cn('flex flex-col', className)}
    {...props}
  />
));
AutocompleteList.displayName = 'AutocompleteList';

const AutocompleteItem = React.forwardRef<
  React.ComponentRef<typeof AutocompletePrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <AutocompletePrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default items-center gap-[var(--ui-input-select-dropdown-item-global-container-gap)] px-[var(--ui-input-select-dropdown-item-global-container-padding-x)] py-[var(--ui-input-select-dropdown-item-global-container-padding-y)] leading-6 text-[var(--ui-input-select-dropdown-item-global-label-color)] outline-none select-none',
      'bg-[var(--ui-input-select-dropdown-item-unselected-container-color-idle)] data-[highlighted]:bg-[var(--ui-input-select-dropdown-item-unselected-container-color-hover)]',
      'data-[disabled]:pointer-events-none data-[disabled]:bg-[var(--ui-input-select-dropdown-item-unselected-container-color-disabled)]',
      className
    )}
    {...props}
  >
    <span className="min-w-0 flex-1 truncate">{children}</span>
  </AutocompletePrimitive.Item>
));
AutocompleteItem.displayName = 'AutocompleteItem';

const AutocompleteEmpty = React.forwardRef<
  React.ComponentRef<typeof AutocompletePrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.Empty>
>(({ className, ...props }, ref) => (
  <AutocompletePrimitive.Empty
    ref={ref}
    className={cn(
      'px-[var(--ui-input-select-dropdown-item-global-container-padding-x)] py-[var(--ui-input-select-dropdown-item-global-container-padding-y)] text-center text-sm leading-6 text-[var(--ui-input-select-normal-description-color-idle)] empty:m-0 empty:p-0',
      className
    )}
    {...props}
  />
));
AutocompleteEmpty.displayName = 'AutocompleteEmpty';

const AutocompleteGroup = AutocompletePrimitive.Group;

const AutocompleteGroupLabel = React.forwardRef<
  React.ComponentRef<typeof AutocompletePrimitive.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof AutocompletePrimitive.GroupLabel>
>(({ className, ...props }, ref) => (
  <AutocompletePrimitive.GroupLabel
    ref={ref}
    className={cn(
      'px-[var(--ui-input-select-dropdown-section-container-header-padding-x)] py-[var(--ui-input-select-dropdown-section-container-header-padding-y)] text-sm font-semibold leading-6 text-[var(--ui-input-select-dropdown-section-label-group-color)]',
      className
    )}
    {...props}
  />
));
AutocompleteGroupLabel.displayName = 'AutocompleteGroupLabel';

export {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteList,
  AutocompleteItem,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
};
