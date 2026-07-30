import * as React from 'react';
import {
  EyeClosedIcon,
  EyeIcon,
} from '@constructor-lab/icons-react/stroke-mono';

import { cn } from '@/lib/utils';
import { ButtonIconInput } from '../button-icon-input';

// Mirrors the Figma "InputPassword" component set (node 6325:11375): a password
// field with an optional `label` (and `*` required marker), the masked input box,
// a reveal toggle inside the box, and an optional `description` or `error`
// message below. The Figma variant set is `state × variant × password × content`;
// `variant` (normal / error) is driven by the presence of `error`, `password`
// (hidden / shown) by the reveal toggle, and `state` / `content` are runtime
// pseudo-states, not props.
//
// It does NOT reuse the `InputBox` primitive: that primitive is hard-wired to the
// `--ui-input-text-*` tier, while this field has its own `--ui-input-password-*`
// tier with its own per-state values. Tailwind cannot build an arbitrary-value
// class from a runtime string, so the tier has to appear literally in the source
// for the scanner to emit it — hence the box styles are spelled out here rather
// than parameterized.
//
// The reveal toggle is a `ButtonIconInput`, and it inherits the field's variant:
// in the error treatment the eye turns red and its focus ring switches to
// `--ui-focus-error`, matching the Figma error column. The box's end padding is
// computed from the tokens (`padding-x + button width + box gap`) so the value
// never runs under the toggle.
export interface InputPasswordProps extends Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'children' | 'type'
> {
  /** Field label, rendered above the input. */
  label?: React.ReactNode;
  /** Marks the field required — appends a `*` after the label. */
  required?: boolean;
  /** Helper text below the input. Hidden while `error` is set. */
  description?: React.ReactNode;
  /**
   * Error message below the input. Its presence switches the field to the error
   * treatment (red box border, red reveal icon, red message).
   */
  error?: React.ReactNode;
  /** Controlled reveal state — `true` renders the value as plain text. */
  revealed?: boolean;
  /** Initial reveal state when uncontrolled. */
  defaultRevealed?: boolean;
  /** Called with the next reveal state when the toggle is activated. */
  onRevealedChange?: (revealed: boolean) => void;
}

const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>(
  (
    {
      className,
      id,
      label,
      required,
      description,
      error,
      revealed,
      defaultRevealed = false,
      onRevealedChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const reactId = React.useId();
    const inputId = id ?? reactId;
    const messageId = `${inputId}-message`;

    const [uncontrolledRevealed, setUncontrolledRevealed] =
      React.useState(defaultRevealed);
    const isControlled = revealed !== undefined;
    const isRevealed = isControlled ? revealed : uncontrolledRevealed;

    const hasError = error != null && error !== '';
    const message = hasError ? error : description;
    const hasMessage = message != null && message !== '';

    const toggleRevealed = () => {
      const next = !isRevealed;
      if (!isControlled) setUncontrolledRevealed(next);
      onRevealedChange?.(next);
    };

    return (
      <div className="group flex w-full min-w-[var(--ui-input-password-global-container-width-min)] flex-col gap-[var(--ui-input-password-global-container-gap)]">
        {label != null && label !== '' && (
          <label
            htmlFor={inputId}
            className={cn(
              'flex gap-[var(--ui-input-password-global-container-label-gap)] text-sm leading-4',
              disabled
                ? 'text-[var(--ui-input-password-global-label-color-disabled)]'
                : 'text-[var(--ui-input-password-global-label-color-idle)] group-hover:text-[var(--ui-input-password-global-label-color-hover)]'
            )}
          >
            {label}
            {required && (
              <span
                aria-hidden="true"
                className="text-[var(--ui-input-password-global-required-color)]"
              >
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={isRevealed ? 'text' : 'password'}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            aria-required={required || undefined}
            aria-describedby={hasMessage ? messageId : undefined}
            className={cn(
              'h-[var(--ui-input-password-global-box-height)] w-full min-w-0 rounded-[var(--ui-input-password-global-box-border-radius)] border-[length:var(--ui-input-password-global-box-border-width)] border-solid border-[var(--ui-input-password-normal-box-border-color-idle)] bg-[var(--ui-input-password-global-box-color-idle)] ps-[var(--ui-input-password-global-box-padding-x)] pe-[calc(var(--ui-input-password-global-box-padding-x)+var(--ui-button-icon-input-global-container-width)+var(--ui-input-password-global-box-gap))] py-[var(--ui-input-password-global-box-padding-y)] text-sm leading-6 text-[var(--ui-input-password-global-value-color-idle)] transition-colors placeholder:text-[var(--ui-input-password-global-placeholder-color-idle)] focus-visible:outline-none focus-visible:ring-[3px] enabled:hover:text-[var(--ui-input-password-global-value-color-hover)] enabled:hover:placeholder:text-[var(--ui-input-password-global-placeholder-color-hover)] enabled:not-aria-[invalid=true]:hover:border-[var(--ui-input-password-normal-box-border-color-hover)] enabled:not-aria-[invalid=true]:hover:bg-[var(--ui-input-password-global-box-color-hover)] not-aria-[invalid=true]:focus-visible:border-[var(--ui-input-password-normal-box-border-color-hover)] not-aria-[invalid=true]:focus-visible:ring-[var(--ui-focus-primary)] aria-[invalid=true]:border-[var(--ui-input-password-error-msg-box-border-color-idle)] enabled:aria-[invalid=true]:hover:border-[var(--ui-input-password-error-msg-box-border-color-hover)] aria-[invalid=true]:focus-visible:ring-[var(--ui-focus-error)] disabled:cursor-not-allowed disabled:border-[var(--ui-input-password-normal-box-border-color-disabled)] disabled:bg-[var(--ui-input-password-global-box-color-disabled)] disabled:text-[var(--ui-input-password-global-value-color-disabled)] disabled:placeholder:text-[var(--ui-input-password-global-placeholder-color-disabled)]',
              className
            )}
            {...props}
          />
          <ButtonIconInput
            variant={hasError ? 'error' : 'normal'}
            disabled={disabled}
            onClick={toggleRevealed}
            aria-label={isRevealed ? 'Hide password' : 'Show password'}
            aria-pressed={isRevealed}
            aria-controls={inputId}
            className="absolute end-[var(--ui-input-password-global-box-padding-x)] top-1/2 -translate-y-1/2"
          >
            {isRevealed ? <EyeIcon /> : <EyeClosedIcon />}
          </ButtonIconInput>
        </div>

        {hasMessage && (
          <p
            id={messageId}
            className={cn(
              'text-xs leading-4',
              hasError
                ? 'text-[var(--ui-input-password-error-msg-error-color)]'
                : disabled
                  ? 'text-[var(--ui-input-password-normal-description-color-disabled)]'
                  : 'text-[var(--ui-input-password-normal-description-color-idle)] group-hover:text-[var(--ui-input-password-normal-description-color-hover)]'
            )}
          >
            {message}
          </p>
        )}
      </div>
    );
  }
);
InputPassword.displayName = 'InputPassword';

export { InputPassword };
