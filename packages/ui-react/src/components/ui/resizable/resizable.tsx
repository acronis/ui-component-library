import * as ResizablePrimitive from 'react-resizable-panels';

import { cn } from '@/lib/utils';

// Resizable panels: a thin wrapper over `react-resizable-panels` (v4: `Group` /
// `Panel` / `Separator`) themed with the next-gen `--ui-resizable-*` token tier,
// following the shadcn composition (`ResizablePanelGroup` / `ResizablePanel` /
// `ResizableHandle`). Base UI has no resizable primitive, so this is the one
// component that wraps a third-party panel library instead.
//
// The handle is a 9px-wide draggable `Separator` (hit-area geometry; no token)
// that paints a single centered 1px divider line
// (`--ui-resizable-border-width`/`-style`): `--ui-border-on-surface-border` at
// rest, `--ui-resizable-border-color-hover` on hover, and
// `--ui-resizable-border-color-active` while dragging (`:active`). Keyboard focus
// paints a 3px `--ui-focus-primary` ring; the resting cursor is
// `--ui-resizable-cursor` (`ew-resize`). The design dropped the grab-bar grip, so
// the `withHandle` prop (and the grip's now-deleted token set) were removed — the
// handle now renders the divider line only.
//
// `orientation="vertical"` (panels stacked) flips the layout: the Group goes
// `flex-col`, the Separator becomes a horizontal line (`aria-orientation=horizontal`),
// and the cursor becomes `ns-resize`.

function ResizablePanelGroup({
  className,
  ...props
}: ResizablePrimitive.GroupProps) {
  return (
    <ResizablePrimitive.Group
      className={cn(
        'flex h-full w-full aria-[orientation=vertical]:flex-col',
        className
      )}
      {...props}
    />
  );
}

function ResizablePanel(props: ResizablePrimitive.PanelProps) {
  return <ResizablePrimitive.Panel {...props} />;
}

export type ResizableHandleProps = ResizablePrimitive.SeparatorProps;

function ResizableHandle({ className, ...props }: ResizableHandleProps) {
  return (
    <ResizablePrimitive.Separator
      className={cn(
        'relative flex w-[9px] items-center justify-center',
        'cursor-[var(--ui-resizable-cursor)] outline-none',
        // Centered 1px divider line (idle → gray, hover → hover token, drag → active token).
        'after:absolute after:inset-y-0 after:start-1/2 after:-translate-x-1/2',
        'after:w-[var(--ui-resizable-border-width)] after:bg-[var(--ui-border-on-surface-border)]',
        'hover:after:bg-[var(--ui-resizable-border-color-hover)]',
        'active:after:bg-[var(--ui-resizable-border-color-active)]',
        'focus-visible:ring-[3px] focus-visible:ring-[var(--ui-focus-primary)]',
        // orientation=horizontal = panels stacked → horizontal divider line.
        'aria-[orientation=horizontal]:h-[9px] aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:cursor-[ns-resize]',
        'aria-[orientation=horizontal]:after:inset-x-0 aria-[orientation=horizontal]:after:inset-y-auto aria-[orientation=horizontal]:after:start-auto aria-[orientation=horizontal]:after:top-1/2 aria-[orientation=horizontal]:after:h-[var(--ui-resizable-border-width)] aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:-translate-y-1/2 aria-[orientation=horizontal]:after:translate-x-0',
        className
      )}
      {...props}
    />
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
