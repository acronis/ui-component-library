# @spec-lab/ui-react

The next-generation Constructor Lab React component library — a **Base UI**
implementation, themed by [`@spec-lab/tokens`](../tokens)
(generated from [`@spec-lab/tokens`](../tokens)).

> Early days: this package is being built out component by component. See
> [`AGENTS.md`](./AGENTS.md) for conventions.

## Install

```sh
pnpm add @spec-lab/ui-react react react-dom
```

## Usage

```tsx
import '@spec-lab/ui-react/styles';
import { Button, Switch } from '@spec-lab/ui-react';

export function Example() {
  return (
    <div>
      <Button variant="default">Save</Button>
      <Switch defaultChecked />
    </div>
  );
}
```

`@spec-lab/ui-react/styles` loads the `acronis` token base. To switch
theme at runtime:

```css
/* one import ships every brand + both themes */
@import '@spec-lab/ui-react/styles';
```

```html
<!-- brand + light/dark are attributes; no extra import -->
<html data-brand="deep-sky" data-theme="dark"></html>
```

Light/dark is driven by `light-dark()` + `color-scheme`; `dark:` utilities are
wired to `[data-theme='dark']`.

## Fonts

The design tokens use **Inter** as the default family, and the generated CSS
emits a graceful fallback stack (`font-family: Inter, system-ui, sans-serif`).
The library deliberately **does not bundle the font** — loading it is the
consumer's choice, so you control hosting, subsets, and weights.

To render in Inter, self-host it (recommended — no third-party CDN, GDPR-safe).
[`@fontsource/inter`](https://fontsource.org/fonts/inter) (SIL Open Font
License) is the simplest route:

```sh
pnpm add @fontsource/inter
```

```tsx
// Load only the weights you use (the typography scale uses 400/500/600/700).
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import '@spec-lab/ui-react/styles';
```

> The static `@fontsource/inter` registers the family as `Inter`, which matches
> the token output. The variable package `@fontsource-variable/inter` registers
> `Inter Variable` instead, so it won't match `font-family: Inter` without an
> extra alias — prefer the static package unless you add that mapping yourself.

If you skip this step, text falls back to `system-ui` / the platform sans-serif.

## Develop

```sh
pnpm --filter @spec-lab/ui-react storybook   # explore components
pnpm --filter @spec-lab/ui-react test        # Vitest + RTL
pnpm --filter @spec-lab/ui-react build       # library bundle + types
```
