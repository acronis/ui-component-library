// Reflects ui-react's `--ui-sidebar-secondary-*` tokens (packages/tokens/css/
// components/SidebarSecondary.css) — not the legacy shadcn SecondaryMenu's
// fixed px/hex values, which no longer apply.
export function SecondaryMenuSpecs() {
  return (
    <div className="space-y-3 text-sm">
      <div>
        <strong className="font-semibold">Width:</strong> 256px expanded, 48px
        collapsed
      </div>
      <div>
        <strong className="font-semibold">Header Padding:</strong> 16px
        horizontal, 12px vertical
      </div>
      <div>
        <strong className="font-semibold">Section Header Padding:</strong>{' '}
        16px horizontal, 2px vertical
      </div>
      <div>
        <strong className="font-semibold">Row:</strong> 40px min height, 16px
        horizontal padding, 8px vertical padding, 8px icon-to-label gap
      </div>
      <div>
        <strong className="font-semibold">Icon Size:</strong> 16×16px
      </div>
      <div>
        <strong className="font-semibold">Typography:</strong>
        <ul className="ml-4 mt-1 space-y-1">
          <li>
            Menu item / section label: Inter Semi Bold, 14px, 24px
            line-height
          </li>
          <li>Header: Inter Regular, 24px, 32px line-height</li>
        </ul>
      </div>
      <div>
        <strong className="font-semibold">Colors:</strong> every fill, border,
        and label is a{' '}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">
          --ui-sidebar-secondary-*
        </code>{' '}
        token from <code className="text-xs">@spec-lab/tokens</code> — no
        fixed hex values. Selected and unselected rows each wire their own
        idle/hover/active token so brand overrides apply per state.
      </div>
    </div>
  );
}
