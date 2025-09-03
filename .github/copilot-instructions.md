# Acronis UI Component Library

Acronis UI Component Library is a Vue.js 3 monorepo containing UI components, icons, utilities, and documentation. The main packages are `@acronis-platform/ui` (components), `@acronis-platform/icons`, and `@acronis-platform/utils`.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

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

## Validation

### Always Run Before Committing
1. `pnpm run build` - **NEVER CANCEL**. Build must complete successfully.
2. `pnpm run lint` - **NEVER CANCEL**. All linting must pass.
3. `pnpm run test` - **NEVER CANCEL**. All unit tests must pass.

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
├── ui/                    - Main UI component library (@acronis-platform/ui-component-library)
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