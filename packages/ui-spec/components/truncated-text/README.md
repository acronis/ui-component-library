# TruncatedText

Text that truncates with an ellipsis and reveals its full value in a tooltip
**only when it's actually clipped** — the tooltip is skipped when everything
fits, so short cells don't get a pointless hover target. Single-line ellipsis by
default, or a multi-line clamp via `lines`.

> **Design-pending v1.** This component was built from requirements, not a
> "ready for dev" Figma mockup. Reconcile it with
> `/figma-component TruncatedText <url> --update` once a mockup lands — that step
> adds the Code Connect mapping and the `figma:` block.

## When to use

- Width-constrained labels that may overflow: table cells, list rows, chips,
  breadcrumbs, any fixed-width column where names vary in length.
- When the full value must stay reachable (hover / focus) even though it is
  visually clipped.

## When not to use

- Text that should always wrap rather than clip — use plain flowing text.
- Rich content (multiple elements, markup) — `children` is a plain string.
- A tooltip on content that never overflows — use **Tooltip** directly.

## Parts

| Part    | Element  | Notes                                                                        |
| ------- | -------- | ---------------------------------------------------------------------------- |
| root    | `<span>` | The (clipped) text; becomes the tooltip trigger when truncated.              |
| tooltip | popup    | The full value, revealed on hover / focus **only when the text is clipped**. |

## Example (React — implemented)

```tsx
import { TruncatedText } from '@constructor-lab/ui-react';

// Single-line ellipsis; hover reveals the full value only if it overflows.
<TruncatedText>Acme Corporation International Holdings & Subsidiaries</TruncatedText>

// Multi-line clamp: truncates after two lines.
<TruncatedText lines={2} side="bottom">
  A long description that clamps after two lines and reveals the rest on hover.
</TruncatedText>
```

Vue and Web Component implementations are planned and will target the same
contract — see `api.yaml` `adapters`.
