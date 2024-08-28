## Migrating components to ui-component library

Proposed steps to migrate components to the ui-component library:

1. Insert the component `as-is` into `packages/ui-components/src/components` folder
2. Refactor it:

- Remove any unnecessary code (props, methods, etc.)
- Refactor the component to use the `vue` composition API
- Check styleguide for the component and make sure it is implemented correctly

3. Create demos, stories according to the mockups
4. Create unit tests for the component
5. Update documentation(jsdoc, vitepress) for the component
6. Create pull requests for the component

## Creating vue components from scratch

Proposed steps to create a new component:

1. Create a new folder in `packages/ui-components/src/components` with the component name
2. First implement basic representation of the components mockups
3. Decouple the component into smaller components
4. Implement features with composition API
5. Check feature requirements and implement them as component API(props, events, slots)
6. Create unit tests for the component
7. Update documentation(jsdoc, vitepress) for the component
8. Create pull requests for the component
