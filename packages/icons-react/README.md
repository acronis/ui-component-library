# @constructor-lab/icons-react

React icon components, generated from
[`@constructor-lab/icons-svg`](../icons-svg). Tree-shakeable, themed
via `currentColor`, with the design-system size/stroke rules baked in.

## Install

```sh
pnpm add @constructor-lab/icons-react react react-dom
```

## Usage

```tsx
import {
  BoltIcon,
  ChevronDownIcon,
} from '@constructor-lab/icons-react/stroke-mono';

export function Example() {
  return (
    <p style={{ color: 'crimson' }}>
      {/* inherits text color via currentColor */}
      <BoltIcon size={16} title="Power" />
      <ChevronDownIcon /> {/* defaults to 24px, decorative */}
    </p>
  );
}
```

`size` applies the design size + stroke rules — e.g. `size={16}` renders at 16px
with a 1.6px stroke, `size={32}` at 32px with 2.5px, matching the design.

### Dynamic lookup

```tsx
import { icons, type IconName } from '@constructor-lab/icons-react/stroke-mono';

const Icon = icons['chevron-down'];
```

(Importing `icons` pulls the whole pack; prefer named imports for bundle size.)

## Develop

```sh
pnpm --filter @constructor-lab/icons-react generate    # regenerate from icons-svg
pnpm --filter @constructor-lab/icons-react storybook    # browse the gallery
pnpm --filter @constructor-lab/icons-react test         # Vitest + RTL
pnpm --filter @constructor-lab/icons-react build        # generate + lib bundle
```

Generated components live under `src/packs/` and are **not** committed — see
[`AGENTS.md`](./AGENTS.md).
