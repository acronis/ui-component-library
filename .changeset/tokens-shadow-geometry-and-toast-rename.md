---
'@constructor-lab/tokens': major
---

Ship the design's three shadow elevations as real tokens, and re-emit the
components tier from the current snapshot.

**Added — the shadow geometry.** `palette.shadow.{sm,md,lg}` carried only a
`color`; its `positionX` / `positionY` / `blur` / `spread` were exported by Figma
but landed under the `palette` group's `$type: color`, so a number was read as a
color and all 12 were silently dropped from the CSS. They now carry
`$type: dimension` and render (`--ui-palette-shadow-md-positiony: 16px`, …). The
Tailwind bridge composes `md` and `lg` into `--shadow-md` / `--shadow-lg`, so a
consumer's `shadow-md` is the design's `0 16px 32px` in the design's shadow colour,
following the theme, instead of Tailwind's default `0 4px 6px -1px`. `sm` ships as
tokens but is not bridged — all three design elevations are surface shadows, and
the kit's `shadow-sm` call sites are a card and a 16px slider thumb.

**Renamed — Toast (breaking).** The tier predated a Figma restructure. Update any
direct references:

| Removed                                        | Use instead                                     |
| ---------------------------------------------- | ----------------------------------------------- |
| `--ui-toast-global-container-color-background` | `--ui-toast-global-container-background`        |
| `--ui-toast-global-content-container-*`        | `--ui-toast-global-content-text-container-*`    |
| `--ui-toast-global-actions-*`                  | `--ui-toast-global-content-actions-container-*` |
| `--ui-toast-global-container-shadow-shadow`    | the `shadow-md` elevation above                 |

`--ui-toast-global-content-{gap,padding-x,padding-y}` are new (the design's
intermediate content column).

**Removed — AlertRibbon (breaking).** `--ui-alert-ribbon-ai-background` and
`--ui-alert-ribbon-global-container-padding-x` are gone; the tier now matches the
current design, which splits the padding into `padding-xleft` / `padding-xright`
and adds per-status `carousel` / `divider` colours. Nothing in this repo consumed
them.

**Fixed — pointers are no longer emitted as values.** Figma has no shadow or
text-style variable type, so those bindings are string variables holding a _name_.
The emitter now drops a string that names an effect style (`shadow-md`) or an
asset (`Assets/CircleInfoBlue`), and a text-style hint that resolves to no
semantics token, reporting each once instead of emitting a dead custom property or
a dangling alias.

Six components (Button, ButtonIcon, ButtonMenu, Chip, InputSelect,
SidebarSecondary) also gain per-brand values for `light-gray`, `telstra`,
`virtuozzo` and `yellow-1c` that the older tier predated. Their default-brand
output is unchanged.
