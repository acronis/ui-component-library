# AspectRatio

Constrains its content to a fixed **width-to-height ratio** using the native CSS
`aspect-ratio` property. Ported from the legacy shadcn UI kit as a **design-pending v1** (no
Figma node yet; reconcile with `/figma-component AspectRatio <url> --update` when
mockups land).

## When to use

- Keep media (images, videos, map/iframe embeds) at a consistent shape while the
  width flexes — avoids layout shift as the asset loads.
- Reserve a proportional box in a grid or card.

## When not to use

- **Intrinsic-size content** (text blocks that should grow to fit) — let it flow.
- **A fixed pixel box** — just set `width`/`height`.

## Anatomy

`root` (`<div>` with `aspect-ratio: <ratio>`) → `content` (the child that fills
it).

## Examples

```tsx
import { AspectRatio } from '@spec-lab/ui-react';

// 16:9 media
<AspectRatio ratio={16 / 9}>
  <img className="h-full w-full object-cover" src="/cover.jpg" alt="Cover" />
</AspectRatio>

// Square (default), clipped with a radius
<AspectRatio className="overflow-hidden rounded-lg">
  <img className="h-full w-full object-cover" src="/avatar.jpg" alt="" />
</AspectRatio>
```
