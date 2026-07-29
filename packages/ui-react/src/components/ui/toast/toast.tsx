'use client';

import * as React from 'react';
import { Toast as ToastPrimitive } from '@base-ui/react/toast';
import { TimesIcon } from '@constructor-lab/icons-react/stroke-mono';
import {
  CircleCheckGreenIcon,
  CircleInfoBlueIcon,
  DiamondWarningRedIcon,
  TriangleWarningYellowIcon,
} from '@constructor-lab/icons-react/stroke-multi';

import { usePortalContainer } from '@/lib/portal-container';
import { cn } from '@/lib/utils';
import { Spinner } from '../spinner';

// Ported from the legacy shadcn UI kit's `sonner`, rebuilt on the Base UI toast
// primitive (no Sonner dependency). The contract is preserved: drop a single
// `<Toaster />` at the app root and call the imperative `toast(...)` /
// `toast.success(...)` API from anywhere.
//
// Reconciled with the redesigned Figma "Notification" set (node 6946-25164) —
// which shares the redesigned Alert's visual language: a white surface
// (bg-background) with a strong status border (--ui-border-on-status-*-strong), a
// 6px left accent bar in the strong status background
// (--ui-background-status-strong-*), and a variant-driven full-color status icon;
// a toast adds a floating drop shadow. Status maps: success/info/warning →
// same; `error` → the danger tokens; `loading` and the untyped default stay
// neutral (border-border, no accent). Auto-dismiss after `timeout` (default
// 5000ms); `loading` toasts persist until updated or dismissed.

// A module-level manager so `toast(...)` works outside React (like Sonner's
// `toast`). `<Toaster />` subscribes this manager to its provider.
const toastManager = ToastPrimitive.createToastManager();

export type ToastType = 'success' | 'info' | 'warning' | 'error' | 'loading';

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
    error: (title: React.ReactNode, options?: ToastOptions) =>
      add(title, 'error', options),
    loading: (title: React.ReactNode, options?: ToastOptions) =>
      add(title, 'loading', { timeout: 0, ...options }),
    dismiss: (id?: string) => toastManager.close(id),
    promise: toastManager.promise,
  }
);

// The four colored status types → strong border + accent-bar tokens + a
// full-color status icon (matching the design). `loading` and the untyped
// default stay neutral (no accent, a plain border-border card).
type ToastStatus = 'success' | 'info' | 'warning' | 'error';
const TOAST_STYLE: Record<
  ToastStatus,
  { border: string; accent: string; icon: React.ReactNode }
> = {
  success: {
    border: 'border-[var(--ui-border-on-status-success-strong)]',
    accent: 'bg-[var(--ui-background-status-strong-success)]',
    icon: <CircleCheckGreenIcon className="size-4" />,
  },
  info: {
    border: 'border-[var(--ui-border-on-status-info-strong)]',
    accent: 'bg-[var(--ui-background-status-strong-info)]',
    icon: <CircleInfoBlueIcon className="size-4" />,
  },
  warning: {
    border: 'border-[var(--ui-border-on-status-warning-strong)]',
    accent: 'bg-[var(--ui-background-status-strong-warning)]',
    icon: <TriangleWarningYellowIcon className="size-4" />,
  },
  error: {
    border: 'border-[var(--ui-border-on-status-danger-strong)]',
    accent: 'bg-[var(--ui-background-status-strong-danger)]',
    icon: <DiamondWarningRedIcon className="size-4" />,
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
          'relative flex w-full items-stretch overflow-hidden rounded-lg border border-solid bg-background shadow-lg',
          style?.border ?? 'border-border',
          'transition-all data-[ending-style]:opacity-0 data-[starting-style]:opacity-0',
          'ltr:data-[starting-style]:translate-x-4 rtl:data-[starting-style]:-translate-x-4 ltr:data-[ending-style]:translate-x-4 rtl:data-[ending-style]:-translate-x-4'
        )}
      >
        {style ? (
          <span
            aria-hidden
            className={cn('w-1.5 shrink-0 self-stretch', style.accent)}
          />
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col py-2">
          <div className="flex items-start gap-2 ps-4 pe-2">
            {icon ? (
              <span className="flex h-6 shrink-0 items-center py-1 [&_svg]:size-4">
                {icon}
              </span>
            ) : null}
            <ToastPrimitive.Title className="flex-1 py-1 text-sm font-semibold leading-6 text-foreground" />
            <ToastPrimitive.Close
              aria-label="Close"
              className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-focus-primary)]"
            >
              <TimesIcon className="size-4" />
            </ToastPrimitive.Close>
          </div>
          <ToastPrimitive.Description className="pb-1 ps-10 pe-4 text-sm leading-6 text-foreground" />
          {item.actionProps ? (
            <div className="pb-1 ps-10 pe-4">
              <ToastPrimitive.Action className="text-sm font-semibold text-secondary hover:underline" />
            </div>
          ) : null}
        </div>
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
        <ToastPrimitive.Viewport className="fixed bottom-4 end-4 z-[100] flex w-[384px] max-w-[calc(100vw-2rem)] flex-col gap-3 outline-none">
          <ToastList />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  );
}

export { toast, Toaster };
