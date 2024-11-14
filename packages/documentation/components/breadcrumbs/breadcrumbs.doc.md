Allows you to see the entire path from the parent section to the section
in which the user is now located and go to one or more levels above.

## Basic usage

:::tip
Set `icon` inside template to use icon for the breadcrumb item.
::: details Example

```vue
<BreadcrumbItem to="/">
  <template #icon>
    <IconDot16 />
  </template>
  Home
</BreadcrumbItem>
```

:::

<BreadcrumbsBasic />

::: details Source code
<<< ../../../examples/demos/breadcrumbs/BreadcrumbsBasic.vue
:::

## Max items

::: tip
Set `max-items` to set the max bread crumb items shown. The rest will be hidden in a dropdown menu. Truncation starts from the 2nd item. The first item and the last item will always be shown, i.e. `max-items` should be larger than 2.
:::

<BreadcrumbsMaxItems />

::: details Source code
<<< ../../../examples/demos/breadcrumbs/BreadcrumbsMaxItems.vue
:::

## Icon separator

:::info
In the `acv-breadcrumbs` component, each `acv-breadcrumb-item` wraps an `acv-breadcrumb-link`
and allows you to use an icon as the separator between breadcrumb items.
The separator icon is defined using the `separator-icon` attribute, which accepts an icon component.
By default, this is set to the `IconChevronRight16` icon, but you can customize it
with any icon of your choice.
:::

<BreadcrumbsIconSeparator />

::: details Source code
<<< ../../../examples/demos/breadcrumbs/BreadcrumbsIconSeparator.vue
:::

## Character separator

:::info
Set the `separator` attribute to a character (e.g., `/`) to use it as the separator between
breadcrumb items.
:::

<BreadcrumbsCharacterSeparator />

::: details Source code
<<< ../../../examples/demos/breadcrumbs/BreadcrumbsCharacterSeparator.vue
:::

## Multiline

:::info
Use the `multiline` attribute to enable wrapping of breadcrumb items,
preventing overflow when there are too many items to fit in a single line.
:::

<BreadcrumbsMultiline />

::: details Source code
<<< ../../../examples/demos/breadcrumbs/BreadcrumbsMultiline.vue
:::

## Accessibility

Provided `AcvBreadcrumbs` component must adapt to the list of
[WAI-ARIA accessibility patterns](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/).

### Overview

A breadcrumb trail consists of a list of links to the parent pages of the current page in hierarchical order.
It helps users find their place within a website or web application.
Breadcrumbs are often placed horizontally before a page's main content.

### WAI-ARIA attributes

- `aria-label`: The breadcrumb trail should have an `aria-label` or `aria-labelledby` attribute that describes the purpose of the breadcrumb trail.
- `aria-current`: The last item in the breadcrumb trail should have an `aria-current` attribute set to `page` to indicate the current page.

## Related components

- [BreadcrumbItem](/components/breadcrumbs/breadcrumbItem/breadcrumbItem.doc)
- [BreadcrumbLink](/components/breadcrumbs/breadcrumbLink/breadcrumbLink.doc)
- [Dropdown](/components/dropdown/dropdown.doc)
