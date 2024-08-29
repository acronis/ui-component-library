# Vue.js Components Style Guide

Acronis UI components are built using Vue.js.
This document describes the rules and best practices for writing Vue.js components.
Also, please follow the [official Vue.js style guide](https://vuejs.org/style-guide/).

We use Vue.js with the Composition API.
Many rules are based on the official Vue.js style guide.
These rules are reflected in the eslint [rulesets](https://github.com/antfu/eslint-config) that we use.
If you want to contribute to the project, please follow these rules.

## Basics

You should make your Vue components better.
Try not to write code faster, but write simpler and better code.
This will help you and your team maintain and update components in the future.

## Creating Vue components

- each component should be in a separate file;
- components must be decoupled into dumb and smart components;
- dumb components should be as simple as possible, they should not have any logic;
- smart components should contain all the logic and should not contain any presentation logic;
- dumb components should be reusable, follow DRY principle;

## Naming

- use name prefix for all components;
- use PascalCase for component names;
- use PascalCase for file names;
- use parent-child component naming, ie `AcvButton`, `AcvButtonGroup`, `AcvButtonIcon`;
- dont use abbreviations in component names;

## SFC

- use single file component;
- use `<template>`, `<script>`, `<style>` sections;
- use typescript and `lang="ts"` for script section;
- use css and `lang="css"` in the style section;
- always try to use setup script for the component;
- use `defineProps` and `defineEmits` for props and events;

## Props

- use `defineProps` for props;
- define types for props in separate file;

```typescript
interface AcvButtonProps {
  status: string
}

const props = defineProps<AcvButtonProps>({
  status: String
});
```

## Exposing parent-child Vue components API

Each component usually consists of:

- state (props and data)
- functions and methods

Basic behaviour:

- Pass data from parent to child components using props.
- Emit events from child to parent components.

Complex behaviour:

- parent get data from child component;
- parent call a function in child component;
- provide/inject to pass data from parent to child components.

Within parent component you can define dependent children in several ways:

- pass child components data using props and define child components directly in the parent component;
- use scoped slots to define child components or it partials in the parent component;
- use provide/inject to pass data from parent to child components;

### Slot props

- share state and functions in template;
- use it in renderless components, overriding some content via slots

### Provide/Inject

Parent component providing a mutable object to the child component,
and the child component injects it and mutates it (directly or indirectly)
to share stuff back to the parent component.

You can provide parent state to the child and/or provide a method to register the child in the parent.

- use it in controller component or a composable that needs awareness of specific child components and manages them under the hood.
- use it in a component that needs to be aware of its sibling components.
- always use Symbols and inject keys and typed injected state
- don't use it for single child components
- it case of nested component with same inject key, the closest parent will be injected

```vue
<script setup>
  import { inject, reactive } from 'vue';
  defineOptions({ name: 'AcvFormItem' });
  const props = defineProps({
    name: String,
  });
  const form = inject('form');
  const field = reactive({
    value: '',
    touched: false,
    name: props.name,
  });
  form.register(field);
</script>

<template>
  <input
    v-model="field.value"
    @blur="field.touched = true"
  >
</template>
```

Typical hierarchy:

```vue
<AcvForm>
  <AcvFormItem v-model="checked" />
  <AcvFormItem v-model="checked" />
  <AcvFormItem v-model="checked" />
</AcvForm>
```

## Getting data from child components via template refs

Whenever you want access to a DOM element or a Vue component instance in your script, you assign a ref attribute to it.
This populates the $refs property if you are using the options API or the ref you created
if you are using the composition API.

- use it with on-off functions you want to call on a component;
- use it with DOM-like API to parent component or proxying DOM functions.
- do not try to expose state with refs
- do not use it with alot of child components(lot of refs brings noise to source code), use provide/inject instead

```vue
<script setup>
  import { onMounted, ref } from 'vue';
  const inputEl = ref(null);

  function focus() {
    inputEl.value?.focus();
  }

  onMounted(() => {
    focus();
  });

  // Exposes the focus function to the parent component.
  defineExpose({
    focus,
  });
</script>

<template>
  <input ref="inputEl">
</template>
```

## Style

- use simple methodology for CSS class naming, ie. prefixed class name with component name,
  one-letter class names for states and modifiers;
- use scoped styles;

```vue
<style scoped>
  .acv-button {
    background-color: #000;

    &.large {
      font-size: 20px;
    }

    &.primary {
      background-color: #f00;
    }
  }
</style>
```

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
