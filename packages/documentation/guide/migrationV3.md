# Migration Acronis UI-kit to v3

This guide will help you migrate your project from v2 to v3.

## Components

### ElAlert

- Title <Badge type="danger" text="Breaking" /> prop was removed. Use `variant` instead.

### ElButton

- <Badge type="danger" text="Deprecated" /> textColor values: muted, high-emphasis, medium-emphasis, disabled, high-emphasis-inverse, medium-emphasis-inverse, disabled-inverse.
- <Badge type="danger" text="Deprecated" /> `type` prop renamed to `variant`.
- <Badge type="danger" text="Deprecated" /> `type="ghost"` renamed to `variant="tertiary"`.
- <Badge type="danger" text="Deprecated" /> type values: success, ghost, inverted.

### ElCard
### ElDropdown
### ElLink
### ElSpinners

### ElTooltip

- <Badge type="danger" text="Deprecated" /> `type` placement renamed to `position`.
