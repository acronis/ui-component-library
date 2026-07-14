# ButtonIconMenu

An icon-only menu trigger: a 32×32 bordered button with a fixed ellipsis
("more"/kebab) glyph. It is the icon-only sibling of [`ButtonMenu`](../button-menu/README.md).

## When to use

- To open a menu of secondary/overflow actions from a compact spot — table rows,
  card headers, toolbars — where a labeled `ButtonMenu` doesn't fit.

## When not to use

- For a labeled menu trigger, use [`ButtonMenu`](../button-menu/README.md).
- For a one-off icon action that does **not** open a menu, use
  [`ButtonIcon`](../button-icon/README.md).
- For a non-ellipsis icon, use `ButtonIcon` (the glyph here is fixed).

## Parts

| Part   | Element  | Notes                                              |
| ------ | -------- | -------------------------------------------------- |
| `root` | `button` | 32×32 bordered trigger; `open` applies active look |
| `icon` | `svg`    | Built-in 16px ellipsis glyph, centered             |

## Examples

```tsx
import { ButtonIconMenu } from '@constructor-lab/ui-react';

// Presentational — keep `open` in sync with the menu you control
<ButtonIconMenu
  aria-label="Row actions"
  open={open}
  onClick={() => setOpen((v) => !v)}
/>

// Composed onto a menu trigger via the render prop
<Menu.Trigger render={<ButtonIconMenu aria-label="Row actions" />} />
```

## Notes

- **Presentational**: it renders the trigger and reflects `open`
  (`aria-expanded` + the active treatment); the consumer owns the menu.
- The glyph is **fixed** (ellipsis) — for any other icon use `ButtonIcon`.
- Theming reuses the ButtonIcon `secondary` token tier (`--ui-button-icon-*`);
  the focus ring reuses `--ui-focus-primary`.
