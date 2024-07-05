Allows you to see the entire path from the parent section to the section
in which the user is now located and go to one or more levels above.

:::info Figma component anatomy
https://www.figma.com/design/6nFlVmwDwvGloglQHxyElh/Tokens-test?node-id=515-5313
:::

## Basic usage

:::tip
Set `icon` to use icon
:::

<BreadcrumbsBasic />

::: details Source code
<<< @/demos/breadcrumbs/BreadcrumbsBasic.vue
:::

## Max items

::: tip
Set `max-items` to set the max bread crumb items shown. The rest will be hidden in a dropdown menu. Truncation starts from the 2nd item. The first item and the last item will always be shown, i.e. `max-items` should be larger than 2.
:::

<BreadcrumbsMaxItems />

::: details Source code
<<< @/demos/breadcrumbs/BreadcrumbsMaxItems.vue
:::

## Icon separator

:::info
In `acv-breadcrumb`, each `acv-breadcrumb-link` is a tag that stands for every level starting from Products.
This component has a `String` attribute `separator`, and it determines the separator.
Its default value is 'chevron-right'.
:::

<BreadcrumbsIconSeparator />

## Character separator

:::info
Set `separator` to use icon as the separator，it will cover `separator`
:::

<BreadcrumbsCharacterSeparator />

## Multiline

<BreadcrumbsMultiline />

## Accessibility ♿️

Provided `AcvBreadcrumbs` component must adapt to the list of
[WAI-ARIA button accessibility patterns](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/).

### Overview

A breadcrumb trail consists of a list of links to the parent pages of the current page in hierarchical order.
It helps users find their place within a website or web application.
Breadcrumbs are often placed horizontally before a page's main content.

### WAI-ARIA attributes

- `aria-label`: The breadcrumb trail should have an `aria-label` or `aria-labelledby` attribute that describes the purpose of the breadcrumb trail.
- `aria-current`: The last item in the breadcrumb trail should have an `aria-current` attribute set to `page` to indicate the current page.

## Related components

- [BreadcrumbLink](/components/breadcrumbs/breadcrumbLink/breadcrumbLink.doc)
- [Dropdown](/components/dropdown/dropdown.doc)
