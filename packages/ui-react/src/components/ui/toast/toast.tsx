'use client';

import * as React from 'react';
import { Toast as ToastPrimitive } from '@base-ui/react/toast';
import { TimesSmallIcon } from '@constructor-lab/icons-react/stroke-mono';
import {
  CircleCheckGreenIcon,
  CircleInfoBlueIcon,
  CircleWarningOrangeIcon,
  DiamondWarningRedIcon,
  TriangleWarningYellowIcon,
} from '@constructor-lab/icons-react/stroke-multi';

import { usePortalContainer } from '@/lib/portal-container';
import { cn } from '@/lib/utils';
import { Button } from '../button';
import { ButtonIcon } from '../button-icon';
import { Spinner } from '../spinner';

// Ported from the legacy shadcn UI kit's `sonner`, rebuilt on the Base UI toast
// primitive (no Sonner dependency). The contract is preserved: drop a single
// `<Toaster />` at the app root and call the imperative `toast(...)` /
// `toast.success(...)` API from anywhere.
//
// Bound to the dedicated `--ui-toast-*` tier (Figma node 7421:126262), which
// carries the whole card: container radius / border / surface / gaps / padding,
// the status bar width, the content/text/actions container metrics, the icon box,
// and per-status `left-line` + `border-color`. Before this it themed from the
// shared semantic status vocabulary, so the generated tier was unconsumed and a
// brand re-pointing any `--ui-toast-*` value had no effect.
//
// The design's five statuses are info / success / warning / critical / danger.
// This component's public `type` names them success / info / warning / critical /
// error, keeping `error` (not `danger`) for API compatibility — it binds the
// danger tokens. `loading` and the untyped default have no design counterpart and
// stay deliberately neutral: a plain `border-border` card with no status bar, so
// `toast(title)` and `toast.loading(...)` keep working.
//
// `shadow-md` is the design's own elevation, not a Tailwind default: the token
// build bridges the three `palette.shadow.*` groups onto Tailwind's `--shadow-*`
// namespace, so the utility resolves to `0 16px 32px` in the design's shadow
// colour and follows the theme. (Figma has no shadow variable type, so the tier's
// `container/shadow` is a string naming the effect style; the emitter drops it
// rather than emit a dead custom property.)
//
// One design value is NOT bound:
//   - the status icons are Figma asset instances, so they come from
//     `@constructor-lab/icons-react/stroke-multi` by name. The dismiss glyph is
//     the design's `TimesSmall` (a small mark in a 16px box) — plain `Times`
//     fills the box and reads far too heavy at this size.
//
// The dismiss control and the action are instances of shipped components in the
// design (`ButtonIcon` node 2236:6286, `variant: secondary | ghost`; the toast
// uses `ghost` for both), so they render `ButtonIcon` / `Button` instead of
// restating those tiers here. Restating them is how the action ended up wearing
// ButtonIcon's *icon* colour as a label colour, with no hover / active / disabled
// state bound at all.
//
// Auto-dismiss after `timeout` (default 5000ms); `loading` persists until
// updated or dismissed.

// A module-level manager so `toast(...)` works outside React (like Sonner's
// `toast`). `<Toaster />` subscribes this manager to its provider.
const toastManager = ToastPrimitive.createToastManager();

export type ToastType =
  | 'success'
  | 'info'
  | 'warning'
  /** The design's `Critical` status — between `warning` and `error`. */
  | 'critical'
  | 'error'
  | 'loading';

export interface ToastOptions {
  /** Secondary line under the title. */
  description?: React.ReactNode;
  /** Auto-dismiss delay in ms; `0` keeps the toast until dismissed. */
  timeout?: number;
  /** A single inline action button (e.g. Undo). */
  action?: { label: React.ReactNode; onClick?: () => void };
  /** Stable id — re-adding with the same id updates the toast in place. */
  id?: string;
}

function add(
  title: React.ReactNode,
  type?: ToastType,
  options: ToastOptions = {}
) {
  const { action, ...rest } = options;
  return toastManager.add({
    title,
    type,
    actionProps: action
      ? { children: action.label, onClick: action.onClick }
      : undefined,
    ...rest,
  });
}

/**
 * Imperative toast API. `toast(title, options)` shows a neutral toast;
 * `toast.success` / `info` / `warning` / `error` / `loading` set the variant.
 * `toast.dismiss(id?)` closes one (or all) and `toast.promise` ties a toast to a
 * promise's lifecycle.
 */
const toast = Object.assign(
  (title: React.ReactNode, options?: ToastOptions) =>
    add(title, undefined, options),
  {
    success: (title: React.ReactNode, options?: ToastOptions) =>
      add(title, 'success', options),
    info: (title: React.ReactNode, options?: ToastOptions) =>
      add(title, 'info', options),
    warning: (title: React.ReactNode, options?: ToastOptions) =>
      add(title, 'warning', options),
    critical: (title: React.ReactNode, options?: ToastOptions) =>
      add(title, 'critical', options),
    error: (title: React.ReactNode, options?: ToastOptions) =>
      add(title, 'error', options),
    loading: (title: React.ReactNode, options?: ToastOptions) =>
      add(title, 'loading', { timeout: 0, ...options }),
    dismiss: (id?: string) => toastManager.close(id),
    promise: toastManager.promise,
  }
);

// Each status binds its own pair from the tier — the card border and the left
// status bar — plus the design's full-color status icon. `loading` and the
// untyped default are not design statuses and take neither (see the header).
type ToastStatus = 'success' | 'info' | 'warning' | 'critical' | 'error';
const TOAST_STYLE: Record<
  ToastStatus,
  { border: string; accent: string; icon: React.ReactNode }
> = {
  success: {
    border: 'border-[var(--ui-toast-success-border-color)]',
    accent: 'bg-[var(--ui-toast-success-left-line)]',
    icon: <CircleCheckGreenIcon />,
  },
  info: {
    border: 'border-[var(--ui-toast-info-border-color)]',
    accent: 'bg-[var(--ui-toast-info-left-line)]',
    icon: <CircleInfoBlueIcon />,
  },
  warning: {
    border: 'border-[var(--ui-toast-warning-border-color)]',
    accent: 'bg-[var(--ui-toast-warning-left-line)]',
    icon: <TriangleWarningYellowIcon />,
  },
  critical: {
    border: 'border-[var(--ui-toast-critical-border-color)]',
    accent: 'bg-[var(--ui-toast-critical-left-line)]',
    icon: <CircleWarningOrangeIcon />,
  },
  // `error` is the API name for the design's `danger` status.
  error: {
    border: 'border-[var(--ui-toast-danger-border-color)]',
    accent: 'bg-[var(--ui-toast-danger-left-line)]',
    icon: <DiamondWarningRedIcon />,
  },
};

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager();
  return toasts.map((item) => {
    const type = item.type as ToastType | undefined;
    const style =
      type && type in TOAST_STYLE
        ? TOAST_STYLE[type as ToastStatus]
        : undefined;
    const icon =
      type === 'loading' ? (
        <Spinner size="sm" className="size-4" />
      ) : (
        style?.icon
      );
    return (
      <ToastPrimitive.Root
        key={item.id}
        toast={item}
        className={cn(
          // The design's card: surface, 1px status border, 8px radius, min 384px.
          // The card itself is the padded row (icon · content · dismiss) — the
          // status bar overlays it rather than taking layout width, so the text
          // is `paddingX` from the card edge, not from the bar.
          // `shadow-md` is the design's elevation via the token bridge — see the
          // header note.
          'relative flex w-full items-start overflow-hidden shadow-md',
          'gap-[var(--ui-toast-global-container-gap)] px-[var(--ui-toast-global-container-padding-x)] py-[var(--ui-toast-global-container-padding-y)]',
          'min-w-[var(--ui-toast-global-container-width-min)] rounded-[var(--ui-toast-global-container-border-radius)] border-[length:var(--ui-toast-global-container-border-width)] border-solid bg-[var(--ui-toast-global-container-background)]',
          style?.border ?? 'border-border',
          'transition-all data-[ending-style]:opacity-0 data-[starting-style]:opacity-0',
          'ltr:data-[starting-style]:translate-x-4 rtl:data-[starting-style]:-translate-x-4 ltr:data-[ending-style]:translate-x-4 rtl:data-[ending-style]:-translate-x-4'
        )}
      >
        {icon ? (
          <span className="flex shrink-0 items-start px-[var(--ui-toast-global-icon-padding-x)] py-[var(--ui-toast-global-icon-padding-y)] [&_svg]:size-[var(--ui-toast-global-icon-size)]">
            {icon}
          </span>
        ) : null}
        {/* The design's `content`: the text block and the actions row share one
            column, so the actions align with the text rather than the icon. */}
        <div className="flex min-w-0 flex-1 flex-col gap-[var(--ui-toast-global-content-gap)] px-[var(--ui-toast-global-content-padding-x)] py-[var(--ui-toast-global-content-padding-y)]">
          <div className="flex w-full flex-col gap-[var(--ui-toast-global-content-text-container-gap)] px-[var(--ui-toast-global-content-text-container-padding-x)] py-[var(--ui-toast-global-content-text-container-padding-y)]">
            {/* The title carries the design's applied `headings/body-heading`
                style (16/500). The tier's own `…-title-text-style` says 14/600
                (it aliases `typography.body.strong`) — it disagrees with the
                node, so it is the Figma-side value to fix, not the render. */}
            <ToastPrimitive.Title className="ui-typography-headings-heading text-[var(--ui-toast-global-content-text-container-title-color)]" />
            <ToastPrimitive.Description className="ui-toast-global-content-text-container-description-text-style text-[var(--ui-toast-global-content-text-container-description-color)]" />
          </div>
          {item.actionProps ? (
            <div className="flex w-full flex-wrap items-center gap-x-[var(--ui-toast-global-content-actions-container-gap-x)] gap-y-[var(--ui-toast-global-content-actions-container-gap-y)] px-[var(--ui-toast-global-content-actions-container-padding-x)] py-[var(--ui-toast-global-content-actions-container-padding-y)]">
              <ToastPrimitive.Action render={<Button variant="ghost" />} />
            </div>
          ) : null}
        </div>
        {/* Both controls are instances of shipped components in the design, so they
            render those rather than restating their tokens here. */}
        <ToastPrimitive.Close
          aria-label="Close"
          render={
            <ButtonIcon variant="ghost">
              <TimesSmallIcon />
            </ButtonIcon>
          }
        />
        {/* The status bar: `statusWidth` wide, spanning the card's full height in
            the status's `left-line` colour (absolute, so it overlays the border
            like the design's `leftLine`). A neutral toast has none. */}
        {style ? (
          <span
            aria-hidden
            className={cn(
              'absolute inset-y-0 start-0 w-[var(--ui-toast-global-container-status-width)]',
              style.accent
            )}
          />
        ) : null}
      </ToastPrimitive.Root>
    );
  });
}

export interface ToasterProps {
  /** Default auto-dismiss delay in ms for toasts that don't set one. */
  timeout?: number;
  /** Max toasts shown at once; the oldest is dropped past the limit. */
  limit?: number;
  /**
   * Portal container for the toast stack. Pass a shadow-root mount for
   * isolated-style previews (the docs demos do this via `useShadowMount`).
   */
  portalContainer?: ToastPrimitive.Portal.Props['container'];
}

/**
 * The toast region. Render once near the app root; it portals a bottom-right
 * stack and renders every queued toast. Trigger toasts with the `toast` API.
 */
function Toaster({ timeout, limit, portalContainer }: ToasterProps) {
  const ctxContainer = usePortalContainer();
  const resolvedContainer = portalContainer ?? ctxContainer;
  return (
    <ToastPrimitive.Provider
      toastManager={toastManager}
      timeout={timeout}
      limit={limit}
    >
      <ToastPrimitive.Portal container={resolvedContainer}>
        <ToastPrimitive.Viewport className="fixed bottom-4 end-4 z-[100] flex w-[var(--ui-toast-global-container-width-min)] max-w-[calc(100vw-2rem)] flex-col gap-3 outline-none">
          <ToastList />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  );
}

export { toast, Toaster };
