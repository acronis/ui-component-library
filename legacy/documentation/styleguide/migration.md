## Migrating components to ui-component library

Proposed steps to migrate components to the ui-component library:

1. Insert the component `as-is` into `packages/ui-components/src/components` folder
2. Refactor it:
   - Remove any unnecessary code (props, methods, etc.)
   - Refactor the component to use the `vue` composition API
   - Check styleguide for the component and make sure it is implemented correctly
   - Check accessibility requirements
3. Create demos, stories according to the mockups
4. Create unit tests for the component
5. Update documentation(jsdoc, vitepress) for the component
6. Create pull requests for the component
