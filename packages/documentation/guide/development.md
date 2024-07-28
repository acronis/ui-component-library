# Development

## Environment

To develop the project, you need to have the following tools installed:

- nodejs >= 20.9
- pnpm >= 8

To start develop new components, you need to run the following command:

```bash
/* Start the development server with hot-reload dist on file changes */
pnpm run dev

/* Run vitepress instance as a playground */
pnpm run @acronis-platform/ui-component-library-documentation:dev
```

## Create new component

To create a new **[component]** component, you need to create sources with:

- vue component (**@acronis-platform/ui-component-library/src/components/[component]/[component].vue**)
- unit tests (**@acronis-platform/ui-component-library/src/components/[component]/[component].spec.ts**) with Vitest
- component types (**@acronis-platform/ui-component-library/src/components/[component]/[component].ts**)
- documentation page (**@acronis-platform/ui-component-library/src/components/[component]/[component].md**)
- component styles, style section in (**@acronis-platform/ui-component-library/src/components/[component]/[component].vue**)
- component tokens (**@acronis-platform/ui-component-library/src/components/[component]/[component].css**) that include all points of can be configured
- demos (**@acronis-platform/demos/src/[component]/[component]Basic.vue**)
- add export to public.ts (**@acronis-platform/ui-component-library/src/components/index.ts**)

You can create them manually or use [Hygen](https://www.hygen.io) generator.
To use Hygen generator, you need to run the following command:

```bash
hygen component new
```

## Creating examples of components usage

You can create as many examples for that particular component as you want.
They can be shown in component and examples section of documentation package.
Such examples are useful for developers to understand how to use the component.

To create an example, you need to create a new file in the **packages/demos/src/[component]/[component][Example].vue** folder.

## Generate documentation

We use jsdoc codegen to generate markdown documentation for components, types and so on.
To generate documentation, you need to run the following command:

```bash
pnpm run --filter packages/documentation collect
```

To start the Vitepress documentation server, you need to run the following command:

```bash
pnpm run documentation:dev
```

## Component development

We use Vite for component development.
You can start the development server with hot-reload dist on file changes by running the following command:

```bash
pnpm run dev:component [component]
```
