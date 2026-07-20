# UI Components library

A pnpm monorepo for the Acronis design system: a React component
library, a design-token pipeline (Figma → JSON → CSS/Tailwind), icon
packages, design-data packages, and supporting apps and tooling.

**Architecture in brief:** The library (`@constructor-lab/ui-react`) is built on
[Base UI](https://base-ui.com/) unstyled primitives and themed by
`@constructor-lab/tokens` (`--ui-*` CSS custom properties generated from
`@constructor-lab/tokens`). Tailwind CSS is used **internally** to
compile styles — consumers receive fully pre-built CSS and can use any styling
solution in their own project. No Tailwind installation required.

## 📦 Workspaces

The repo is organized into four top-level directories: `context/` (shared docs),
`apps/` (deployed apps, private), `packages/` (published libraries + data), and
`tools/` (private build tooling).

| Path                          | Package                                 | Published | Role                                                                         |
| ----------------------------- | --------------------------------------- | --------- | ---------------------------------------------------------------------------- |
| `packages/ui-react/`          | `@constructor-lab/ui-react`             | **yes**   | React component library on **Base UI**, themed by `tokens`.                  |
| `packages/icons-react/`       | `@constructor-lab/icons-react`          | **yes**   | React icon components generated from `design-assets` (tree-shakeable).       |
| `packages/icons-svg/`         | `@constructor-lab/icons-svg`            | no        | Raw SVG sources for the next-gen icon set (source-only).                     |
| `packages/tokens/`            | `@constructor-lab/tokens`               | **yes**   | DTCG-2025.10 design tokens (primitives / semantics / components). Data only. |
| `packages/design-assets/`     | `@constructor-lab/design-assets`        | **yes**   | Icon/illustration manifests + bundled binaries. Data only.                   |
| `packages/tokens/`            | `@constructor-lab/tokens`               | **yes**   | Generated per-brand CSS vars, per-component CSS, Tailwind presets, DTCG.     |
| `apps/demo/`                  | `@constructor-lab/ui-kit-demo`          | no        | Vite SPA showcasing components with live theme switching.                    |
| `apps/docs/`                  | `@constructor-lab/uikit-docs`           | no        | Next.js 15 + Fumadocs documentation site.                                    |
| `apps/demos/`                 | `@constructor-lab/ui-kit-demos`         | no        | Shared demo components (source-only, no build).                              |
| `tools/style-dictionary/`     | `@constructor-lab/style-dictionary`     | no        | Style Dictionary v5 build: `tokens` → `tokens` CSS/presets.                  |
| `tools/figma-icons-fetcher/`  | `@constructor-lab/figma-icons-fetcher`  | no        | Fetches + SVGO-optimizes icons from Figma into the `icons-svg*` packages.    |
| `tools/figma-token-exporter/` | `@constructor-lab/figma-token-exporter` | no        | Self-hosted Figma plugin + receiver that exports variables/styles to tokens. |

See [`AGENTS.md`](./AGENTS.md) for the authoritative workspace map and the
per-workspace `AGENTS.md` files for area-specific conventions.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10+

### Installation (development)

```bash
# Clone the repository
git clone https://github.com/constructor-lab/ui-component-library.git
cd uikit

# Install dependencies
pnpm install

# Build all packages
pnpm run build
```

### Running the Demo

```bash
# Start the demo application
cd apps/demo
pnpm run dev
```

The demo will be available at `http://localhost:3000`.

## 📖 Usage (`@constructor-lab/ui-react`)

`@constructor-lab/ui-react` is the UI Components library's React component library.

### Installation

```bash
pnpm add @constructor-lab/ui-react react react-dom
```

`react` and `react-dom` (`^18.2.0 || ^19.0.0`) are peer dependencies. The theme
layer (`@constructor-lab/tokens`) and icons (`@constructor-lab/icons-react`)
ship as direct dependencies, so no extra install is needed.

### Import Styles

Import the pre-built stylesheet once at your application entry point. It bundles
the `--ui-*` token layer and all component CSS — no Tailwind installation
required:

```typescript
// main.tsx or App.tsx
import '@constructor-lab/ui-react/styles';
```

### Using Components

All components are exported from the package root:

```tsx
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Input,
  Label,
  Badge,
  Alert,
  AlertTitle,
  AlertDescription,
} from '@constructor-lab/ui-react';

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter your email" />
        </div>
        <Alert>
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>This is an informational message.</AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter>
        <Button>Submit</Button>
        <Badge variant="secondary">New</Badge>
      </CardFooter>
    </Card>
  );
}
```

> **Aliases:** `Input`/`Search`/`Textarea` are aliases of the full-field
> components `InputText`/`InputSearch`/`InputTextArea`, and `Badge` is an alias
> of the design-system-native `Tag`.

### Available Components

The library covers layout (`Card`, `AppShell`, `Grid`, `Stack`, `Section`,
`Separator`, `ScrollArea`, `Resizable`), navigation (`Breadcrumb`, `Tabs`,
`Pagination`, `SidebarPrimary`, `SidebarSecondary`, `SearchGlobal`), forms
(`InputText`, `InputSearch`, `InputTextArea`, `InputSelect`, `InputDatePicker`,
`Combobox`, `Select`, `Checkbox`, `Radio`, `Switch`, `Slider`, `NumberField`,
`Field`, `Form`, `Label`), buttons (`Button`, `ButtonIcon`, `ButtonMenu`),
overlays (`Dialog`, `Sheet`, `Popover`, `Tooltip`, `DropdownMenu`), feedback
(`Alert`, `Tag`/`Badge`, `Chip`, `Progress`, `ProgressCircle`, `Spinner`,
`Skeleton`, `Toast`, `Empty`), and data display (`Table`, `DataTable`, `Chart`,
`Avatar`, `DescriptionList`, `Accordion`, `Collapsible`). See the full export
surface in [`packages/ui-react/src/index.ts`](./packages/ui-react/src/index.ts).

Icons are provided by [`@constructor-lab/icons-react`](./packages/icons-react).

### Package Exports

```typescript
// Main entry — all components + the `cn` utility
import { Button, cn } from '@constructor-lab/ui-react';

// React-only entry
import { Button } from '@constructor-lab/ui-react/react';

// Pre-built CSS (token layer + component styles)
import '@constructor-lab/ui-react/styles';
```

### TypeScript Support

The library is fully typed:

```tsx
import type { ButtonProps, CardProps } from '@constructor-lab/ui-react';

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
```

### Utility Functions

```typescript
import { cn } from '@constructor-lab/ui-react';

// Merge class names
const className = cn(
  'base-class',
  condition && 'conditional-class',
  'another-class'
);
```

## 🎨 Styling & Theming

Tailwind CSS is used **internally** as a build-time tool to compile component
styles. It is **not** part of the public API — the library ships standard,
pre-built CSS, so consumers can use any styling solution (CSS Modules, SCSS,
plain CSS, Tailwind of any version, etc.). No Tailwind installation is required
to consume the kit.

### Tokens (`ui-react`)

The library is themed entirely by `--ui-*` CSS custom properties from
`@constructor-lab/tokens`, which are generated from
`@constructor-lab/tokens` via `@constructor-lab/style-dictionary`. The
token layer ships inside `@constructor-lab/ui-react/styles`; light/dark and
per-brand values are driven by CSS variables (zero JavaScript overhead,
SSR-compatible). Override the `--ui-*` variables to customize.

The token pipeline (and the Figma sync used to refresh it) is documented in the
workspace docs for [`tokens`](./packages/tokens/AGENTS.md) and
[`tokens`](./packages/tokens/AGENTS.md).

## 🏗️ Project Structure

```
uikit/
├── apps/                       # Deployed apps (private)
│   ├── demo/                   # Vite SPA          (@constructor-lab/ui-kit-demo)
│   ├── demos/                  # Shared demos      (@constructor-lab/ui-kit-demos)
│   └── docs/                   # Next.js + Fumadocs (@constructor-lab/uikit-docs)
├── packages/                   # Published libraries + design data
│   ├── ui-react/               # Base UI library    (@constructor-lab/ui-react)
│   ├── icons-react/            # React icons        (@constructor-lab/icons-react)
│   ├── icons-svg/              # Raw SVG sources    (@constructor-lab/icons-svg)
│   ├── tokens/          # DTCG tokens (data) (@constructor-lab/tokens)
│   ├── design-assets/          # Asset manifests    (@constructor-lab/design-assets)
│   └── tokens/              # Generated CSS/Tailwind (@constructor-lab/tokens)
├── tools/                      # Private build tooling
│   ├── style-dictionary/       # tokens → tokens CSS/presets
│   ├── figma-icons-fetcher/    # Figma → icons-svg* SVG fetcher
│   └── figma-token-exporter/   # Figma plugin + receiver → token snapshot
├── context/                    # Cross-workspace docs (conventions, commits, releasing)
├── .changeset/                 # Pending changesets (each PR adds one)
├── .github/workflows/          # ci, release, demo-deploy, visual-regression
├── AGENTS.md                   # Authoritative workspace map (for AI agents + humans)
├── package.json                # Workspace root: scripts + shared devDeps
├── pnpm-workspace.yaml         # pnpm workspaces + dependency catalog
└── README.md
```

## 🛠️ Scripts

All commands run from the repo root unless noted otherwise. Every workspace
exposes the same vocabulary, so `pnpm -r <name>` is reliable.

| Script                                     | What it does                                                |
| ------------------------------------------ | ----------------------------------------------------------- |
| `pnpm -r dev` / `pnpm --filter <name> dev` | Run the dev server / watcher for one or all workspaces      |
| `pnpm -r build`                            | Build every package in topological order (ui → demo/docs)   |
| `pnpm -r test`                             | Run the test suite once across all workspaces               |
| `pnpm -r test:watch`                       | Run tests in watch mode                                     |
| `pnpm -r lint` / `pnpm -r lint:fix`        | ESLint across all workspaces                                |
| `pnpm -r typecheck`                        | `tsc --noEmit` across all workspaces                        |
| `pnpm format` / `pnpm format:check`        | Prettier write / check from the repo root                   |
| `pnpm -r clean`                            | Delete `dist/`, `.next/`, `storybook-static/`, etc.         |
| `pnpm changeset`                           | Add a changeset for a PR that changes a published workspace |

To run a single workspace, prefix with `pnpm --filter <package-name>`:

```bash
pnpm --filter @constructor-lab/uikit-docs dev
pnpm --filter @constructor-lab/ui-react storybook
```

The root also exposes token-pipeline shortcuts: `pnpm sd` (build all Style
Dictionary targets), `pnpm sd:tokens` / `pnpm sd:assets` (subsets), and
`pnpm tokens:sync` (re-emit `tokens` then rebuild `tokens`).

## 🚢 Releasing

Releases are driven by [changesets](https://github.com/changesets/changesets).
Every PR that changes a published workspace's released surface should include a
`.changeset/*.md` file describing the bump:

```bash
pnpm changeset
```

On merge to `main`, the **Release** workflow opens (or updates) a single
"Version Packages" PR aggregating all pending changesets. Merging that PR
publishes to **npm** and **GitHub Packages** and creates the corresponding
**GitHub Release**, which in turn triggers the **Demo & Storybook Pages
deploy**. See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the full flow.

## 🚀 Quick Reference

### Complete Setup Example

```tsx
// main.tsx
import '@constructor-lab/ui-react/styles';

// App.tsx
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@constructor-lab/ui-react';

export function App() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My App</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  );
}
```

## 📚 Documentation

- [`AGENTS.md`](./AGENTS.md) — authoritative workspace map + conventions
- [ui-react package](./packages/ui-react) — Base UI component library
- [tokens](./packages/tokens/AGENTS.md) / [tokens](./packages/tokens/AGENTS.md) — token pipeline
- [Demo Package Documentation](./apps/demo/README.md)

## 📝 License

MIT License — Copyright (c) 2026 Acronis International GmbH

See [LICENSE](./LICENSE) for more details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔗 Links

- [Base UI](https://base-ui.com/) — unstyled primitives used by `ui-react`
- [Tailwind CSS](https://tailwindcss.com/) — internal build tool
- [DTCG](https://www.designtokens.org/) — design token format used by `tokens`
