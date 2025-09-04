# Acronis UI Component Library

Acronis UI Component Library is a Vue.js 3 monorepo containing UI components, icons, utilities, and documentation. 
The main packages are `@acronis-platform/ui` (components), `@acronis-platform/icons`, and `@acronis-platform/utils`.

## AI Development Rules (read first)

These rules are the source of truth for AI-assisted changes. Follow them strictly before falling back to searches or ad-hoc commands.

- Safe tool usage
  - Do not run unsafe or destructive commands automatically. Always request approval for commands that mutate state, install dependencies, or make external requests.
  - Never include `cd` in commands. Use the command’s working directory instead.
  - Prefer pnpm workspace filters: `pnpm --filter ./packages/<name> run <script>`.
  - For code edits, use structured edits only and keep imports at the top. Do not inline imports mid-file.

- Monorepo workflows
  - Install: `CYPRESS_INSTALL_BINARY=0 pnpm install` (skip Cypress binary unless running visual tests).
  - Build everything: `pnpm run build`.
  - Lint everything: `pnpm run lint` or `pnpm run lint:fix`.
  - Test UI package: `pnpm --filter ./packages/ui run test` (Vitest + Vue Test Utils).
  - Docs dev: `pnpm --filter ./packages/documentation run dev` (VitePress).

- Coding conventions (Vue 3 UI Kit)
  - Use Vue 3 Composition API with `<script setup lang="ts">`. Avoid Options API.
  - Component naming: prefix with `Av` in PascalCase (e.g., `AvButton`). File names in kebab-case (e.g., `button.vue`).
  - Component directories contain: main `.vue`, types `*.ts`, constants `*.constants.ts`, `__tests__/`, `__stories__/`.
  - CSS: prefix classes with `av-` and use BEM-like modifiers/elements. Use CSS variables with `--av-` prefix. Use design tokens; do not hardcode hex colors.
  - TypeScript: define interfaces for props/emits, export public types, use `withDefaults(defineProps<Props>(), { ... })` and `defineEmits<Events>()`.

  - Testing
    - Unit tests: Vitest + Vue Test Utils. Place `*.spec.ts` alongside components or in package tests. Use table-driven tests for utils.
    - Accessibility: use `vitest-axe` where relevant.
    - Visual regression (Cypress): keep viewport and DPR normalized via repo config in `packages/ui/cypress.config.ts` and support hooks/utilities in `packages/ui/cypress/support/component.ts` and `packages/ui/cypress/support/style.css`. Avoid animations and nondeterminism in demos.
    - See `.github/instructions/unit-tests.instructions.md` for detailed testing guidelines used in this repo.

  - Documentation
    - Do not edit generated `packages/documentation/components/<c>/<c>.md` files.
    - Author narrative/examples in `packages/documentation/components/<c>/<c>.doc.md`.
    - Reference demos from `packages/examples/demos/<c>/*` and include sources using fenced includes.
    - Regenerate docgen tables with `pnpm --filter ./packages/documentation run generate:docs` when props/slots/events change.
    - See `.github/instructions/docs.instructions.md` for full documentation authoring rules.

  - Linting and tokens
    - Use existing design tokens and CSS variables (e.g., `var(--acv-color-white)`). Avoid raw hex colors to satisfy Stylelint rules.
    - Run `pnpm run lint` before committing. Fix issues rather than disabling rules.

- Commits and PRs
  - Use Conventional Commits. Include scope where helpful (e.g., `feat(ui-button): add loading state`).
  - Update unit tests, docs `.doc.md`, and visual tests as part of the same change where applicable.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Libraries and Frameworks

- Vue 3
- Vite
- VitePress
- Cypress
- pnpm

## Development setup

### Prerequisites and Setup
- Node.js version: **20.x** (exact version in `.nvmrc`)
- Package Manager: **pnpm@9.7.1** (exact version in `package.json`)
- Install pnpm globally: `npm install -g pnpm@9.7.1`

### Bootstrap and Build Process

**CRITICAL**: Always set timeouts of 90+ minutes for both build and test commands. **NEVER CANCEL** long-running commands.

1. **Install dependencies** (takes ~1-5 minutes):
   ```bash
   CYPRESS_INSTALL_BINARY=0 pnpm install
   ```
   Note: Use `CYPRESS_INSTALL_BINARY=0` to skip Cypress binary download in sandbox environments. Cypress visual regression tests require the binary but most development work doesn't.

2. **Build all packages** - takes 1m 43s. **NEVER CANCEL**. Set timeout to 120+ minutes:
   ```bash
   pnpm run build
   ```

3. **Run linting** - takes 1m 20s. **NEVER CANCEL**. Set timeout to 90+ minutes:
   ```bash
   pnpm run lint
   ```

4. **Run tests** - takes 1m 8s. **NEVER CANCEL**. Set timeout to 90+ minutes:
   ```bash
   pnpm run test
   ```

### Development Workflows

#### Documentation Development
- Start documentation server (VitePress):
  ```bash
  pnpm --filter ./packages/documentation run dev
  ```
  Access at: `http://localhost:5173/ui-component-library/`

- Build documentation:
  ```bash
  pnpm --filter ./packages/documentation run build
  pnpm --filter ./packages/documentation run preview
  ```

#### Component Development
- Build UI components in watch mode:
  ```bash
  pnpm --filter ./packages/ui run dev
  ```

- Run specific package commands:
  ```bash
  pnpm --filter ./packages/ui run [script]
  pnpm --filter ./packages/icons run [script]
  pnpm --filter ./packages/utils run [script]
  ```

#### Testing and Quality
- Run linting with auto-fix:
  ```bash
  pnpm run lint:fix
  ```

- Run tests with coverage:
  ```bash
  pnpm --filter ./packages/ui run test:coverage
  ```

- Run visual regression tests (requires Cypress binary):
  ```bash
  pnpm --filter ./packages/ui run cypress:run
  ```

## Code Standards for development

### Always Run Before Committing
1. `pnpm run build` - **NEVER CANCEL**. Build must complete successfully.
2. `pnpm run lint` - **NEVER CANCEL**. All linting must pass.
3. `pnpm run test` - **NEVER CANCEL**. All unit tests must pass.

### Development Workflow

- **Components**: Edit files in `packages/ui/src/components/`
- **Icons**: Edit files in `packages/icons/src/`
- **Utils**: Edit files in `packages/utils/src/`
- **Documentation**: Edit files in `packages/documentation/src/`
- **Examples**: Edit files in `packages/examples/src/`

- implement features in components
- add examples in documentation
- test components
- run linting and tests
- run build

#### Component Development

#### Documentation Development

### Manual Validation Scenarios
After making changes, **ALWAYS** validate with these complete scenarios:

1. **Documentation Validation**:
   - Run `pnpm --filter ./packages/documentation run dev`
   - Access `http://localhost:5173/ui-component-library/`
   - Navigate to component pages affected by your changes
   - Verify components render and examples work

2. **Component Library Validation**:
   - Run `pnpm --filter ./packages/ui run dev`
   - Verify build completes without errors
   - Check that TypeScript types are generated correctly

3. **Build Validation**:
   - Run full `pnpm run build`
   - Verify all packages build successfully
   - Check `dist/` folders contain expected output

## Repository Structure

### Key Packages
```
packages/
├── ui/                    - Main UI component library (@acronis-platform/ui)
│   ├── src/components/    - Vue 3 components
│   ├── src/styles/        - Styles, themes, design tokens
│   ├── src/composables/   - Vue composables
│   ├── src/directives/    - Vue directives
│   └── cypress/           - Visual regression tests
├── icons/                 - Icon library (@acronis-platform/icons)
├── utils/                 - Utility functions (@acronis-platform/utils)
├── documentation/         - VitePress documentation
├── examples/             - Component demo examples
├── dev-server/           - Development server for testing
├── configs/              - Shared configuration files
└── figma-*/              - Figma integration tools
```

### Important Files
- `pnpm-workspace.yaml` - Workspace configuration
- `.nvmrc` - Node.js version specification
- `.github/workflows/ci.yml` - Main CI pipeline
- `packages/ui/vite.config.ts` - Build configuration
- `packages/ui/package.json` - Main component library package

### CI/CD Workflows
- **ci.yml** - Main CI: build, lint, test
- **visual-regression.yml** - Cypress visual tests
- **docs-deploy.yml** - Documentation deployment
- Multiple release workflows for different packages

## Key guidelines

- Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification for commit messages
- Use [Semantic Versioning](https://semver.org/) for releases
- Follow Vue 3 best practices and idiomatic patterns
- Maintain existing code structure and organization
- Use dependency injection patterns where appropriate
- Write unit tests for new functionality. Use table-driven unit tests when possible.
- Document public APIs and complex logic. Suggest changes to the `docs/` folder when appropriate
- Use TypeScript for new functionality
- Use [VitePress](https://vitepress.vuejs.org/) for documentation

## Common Issues and Troubleshooting

### Cypress Binary Issues
If you see Cypress download errors:
```bash
CYPRESS_INSTALL_BINARY=0 pnpm install
```
This is expected in sandbox environments. Visual regression tests require the binary but most development doesn't.

### Build Timeouts
- **NEVER CANCEL** builds or tests that appear hung
- Builds can take 1-2+ minutes, tests can take 1+ minutes
- Always set timeouts to 90-120+ minutes
- Wait at least 10 minutes before considering a command truly stuck

### TypeScript Issues
If TypeScript compilation fails:
```bash
pnpm --filter ./packages/ui run lint:ts
```

### Dependency Issues
If packages fail to resolve:
```bash
pnpm install --frozen-lockfile
```

## Development Tips

### Making Changes
- **Components**: Edit files in `packages/ui/src/components/`
- **Styles**: Edit files in `packages/ui/src/styles/`
- **Documentation**: Edit markdown files in `packages/documentation/`
- **Icons**: Icons are generated from Figma - see `packages/figma-fetcher/`

### Testing Changes
- Unit tests: `pnpm --filter ./packages/ui run test`
- Visual regression: `pnpm --filter ./packages/ui run cypress:run`
- Manual testing: Use documentation dev server

### Performance Notes
- **Full builds**: ~1m 43s
- **Linting**: ~1m 20s  
- **Tests**: ~1m 8s
- **Documentation build**: ~1m (part of full build)

## Package Scripts Reference

### Root Package Scripts
- `pnpm run build` - Build all packages
- `pnpm run test` - Run all tests
- `pnpm run lint` - Lint all packages
- `pnpm run lint:fix` - Auto-fix linting issues

### UI Package Scripts
- `pnpm --filter ./packages/ui run dev` - Watch mode build
- `pnpm --filter ./packages/ui run build` - Production build
- `pnpm --filter ./packages/ui run test` - Run unit tests
- `pnpm --filter ./packages/ui run test:coverage` - Tests with coverage
- `pnpm --filter ./packages/ui run cypress:run` - Visual regression tests
- `pnpm --filter ./packages/ui run lint` - Lint UI package
- `pnpm --filter ./packages/ui run lint:ts` - TypeScript checks

### Documentation Package Scripts  
- `pnpm --filter ./packages/documentation run dev` - Dev server
- `pnpm --filter ./packages/documentation run build` - Build docs
- `pnpm --filter ./packages/documentation run preview` - Preview built docs

**Remember: NEVER CANCEL builds, tests, or long-running commands. Always wait for completion.**
