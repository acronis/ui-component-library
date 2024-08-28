# Vue Components Style Guide

## Basics

You should make your Vue components better.
Try not to write code faster, but write simpler and better code.
This will help you and your team maintain and update components in the future.

## Decouple components

Before you start writing a new component,
get familiar with feature description and mockups,
and think about how you can decouple it into smaller components.

As a rule of thumb, every Vue component can be separated into 3 main parts:

- view(**design**): template, where you design the user interface,
- logic(**data**): script where you process data and manage user actions,
- reactive data(**interaction**): features that make interaction with the component dynamic.

You can use this approach to develop components in iterations from design to interactions.
In **first** iteration you can implement only the view part of the component.
In the **next** iteration you can implement the logic part of the component.
In the **last** iteration you can implement the reactive data and interaction part of the component.

## Use composition API

Use the composition API to manage component logic.
Use pure functions to manage reactive data and side effects.
They will simplify test, debug and obviousness.
With pure functions you can decouple composable with Vue-specific code and functions with business logic.

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

## Creating vue components from scratch

Proposed steps to create a new component:

1. Create a new folder in `packages/ui-components/src/components` with the component name
2. First implement basic representation of the components mockups
3. Decouple the component into smaller components
4. Implement features with composition API
5. Check feature requirements and implement them as component API(props, events, slots)
6. Check accessibility requirements
7. Create unit tests for the component
8. Update documentation(jsdoc, vitepress) for the component
9. Create pull requests for the component
