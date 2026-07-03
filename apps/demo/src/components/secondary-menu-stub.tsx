import * as React from 'react';

// TODO(uikit): re-do with approved pattern. Legacy `SecondaryMenu*` has no
// drop-in ui-react equivalent (the closest is `SidebarSecondary*`, which
// models sections/collapse very differently) — this is a minimal plain
// `<nav>`/`<ul>` stand-in so the input demos keep rendering/navigating.

export function SecondaryMenu({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <nav
      aria-label="Section navigation"
      className={`w-56 shrink-0 border-r border-border overflow-y-auto ${className ?? ''}`}
    >
      {children}
    </nav>
  );
}

export function SecondaryMenuContent({
  children,
}: {
  children?: React.ReactNode;
}) {
  return <div className="flex flex-col gap-6 p-4">{children}</div>;
}

export function SecondaryMenuGroup({
  title,
  children,
}: {
  title?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      {title && (
        <p className="px-2 pb-1 text-xs font-medium uppercase text-muted-foreground">
          {title}
        </p>
      )}
      <ul className="flex flex-col gap-0.5">{children}</ul>
    </div>
  );
}

export interface SecondaryMenuItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  active?: boolean;
  icon?: React.ReactNode;
  tag?: React.ReactNode;
  children?: React.ReactNode;
}

export function SecondaryMenuItem({
  active,
  icon,
  tag,
  children,
  className,
  ...props
}: SecondaryMenuItemProps) {
  return (
    <li>
      <button
        type="button"
        aria-current={active ? 'page' : undefined}
        className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
          active
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground hover:bg-accent/50'
        } ${className ?? ''}`}
        {...props}
      >
        {icon}
        <span className="flex-1 truncate">{children}</span>
        {tag && (
          <span className="shrink-0 text-xs text-muted-foreground">
            {tag}
          </span>
        )}
      </button>
    </li>
  );
}
