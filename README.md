# Acronis UI Component Library Monorepo

![NPM Version](https://img.shields.io/npm/v/%40acronis-platform%2Fui-component-library)

Acronis UI Component Library is a monorepo that contains multiple packages. 
The main package is `@acronis-platform/ui`.

## Simplified structure of the monorepo

```md
├── .github                          - _Github Action workflows_
├── _templates                       - _Hygen templates for component generator_
├── packages/browserlist-config      - _Browserlist configs_
├── packages/dev-server              - _Main package for components_
├── packages/documentation           - _Vitepress documentation_
├── packages/figma-fetcher           - _Figma fetch icons utility_
├── packages/icons                   - _Main package for components_
├── packages/ui                      - _Main package for components_
│   ├── cypress                      - _Cypress tests_
│   ├── scripts                      - _Build scripts_
│   ├── src
│   │   ├── components               - _Components_
│   │   ├── composables              - _Composables_
│   │   ├── directives               - _Directives_
│   │   ├── locale                   - _Locale messages_
│   │   ├── styles                   - _Styles, themes, tokens_
│   │   ├── widgets                  - _Widgets_
│   │   └── index.ts                 - _Entry point_
│   ├── test                         - _Unit tests coverage report_
├── packages/utils
├── package.json
├── pnpm-lock.yaml
├── README.md   
└── SECURITY.md   
```

## Installation

Install dependencies for all packages:

``` bash
pnpm install
```

## Run documentation with dev server

Start dev documentation server:

```bash
pnpm --filter ./packages/documentation run dev
```

Build components library in watch mode:

```bash
pnpm --filter ./packages/ui run dev
```

## Build and preview documentation

```bash
pnpm --filter ./packages/documentation run build
pnpm --filter ./packages/documentation run preview
```

## Build for production

```bash
pnpm --filter ./packages/ui run build
```

## License

[MIT](https://github.com/acronis/ui-component-library/blob/main/LICENSE)
