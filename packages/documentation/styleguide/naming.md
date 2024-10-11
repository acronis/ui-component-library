# Naming conventions

Naming conventions are important in any project.

They help to keep the codebase consistent and easy to read.

This document outlines the naming conventions used in this project.

Most of the naming conventions will be covered with eslint rules.

## General

- **Use PascalCase** for all names.
- **Use hyphens** for multi-word names\*\*.
- **Use a consistent naming pattern** for all files in a project.

## Vue Components

- **Base components** should start with `Base`, e.g. `BaseButton.vue`.
- **Single-instance components** should start with `The`, e.g. `TheHeader.vue`.
- **Components that are tightly coupled with a parent component** should start with the parent component's name, e.g. `UserProfileOptions.vue`.
- **Child components** should start with the parent component's name, e.g. `UserProfileOptionsItem.vue`.
- **Components that are used as a wrapper for other components** should start with `Wrap`, e.g. `WrapButton.vue`.
- **Components that are used as a container for other components** should start with `Container`, e.g. `ContainerGrid.vue`.
- **Components that are used as a layout for other components** should start with `Layout`, e.g. `LayoutGrid.vue`.
- **Components that are used as a page layout** should start with `Page`, e.g. `PageGrid.vue`.
- **Components that are used as a view layout** should start with `View`, e.g. `ViewGrid.vue`.
- **Components that are used as a modal layout** should start with `Modal`, e.g. `ModalGrid.vue`.
- **Components that are used as a dialog layout** should start with `Dialog`, e.g. `DialogGrid.vue`.
- **Components that are used as a form layout** should start with `Form`, e.g. `FormGrid.vue`.
- **Components that are used as a list layout** should start with `List`, e.g. `ListGrid.vue`.
- **Components that are used as a table layout** should start with `Table`, e.g. `TableGrid.vue`.
- **Components that are used as a card layout** should start with `Card`, e.g. `CardGrid.vue`.
- **Components that are used as a sidebar layout** should start with `Sidebar`, e.g. `SidebarGrid.vue`.
- **Components that are used as a header layout** should start with `Header`, e.g. `HeaderGrid.vue`.
- **Components that are used as a footer layout** should start with `Footer`, e.g. `FooterGrid.vue`.
- **Components that are used as a navigation layout** should start with `Nav`, e.g. `NavGrid.vue`.
- **Components that are used as a menu layout** should start with `Menu`, e.g. `MenuGrid.vue`.
- **Components that are used as a dropdown layout** should start with `Dropdown`, e.g. `DropdownGrid.vue`.

## Composables
