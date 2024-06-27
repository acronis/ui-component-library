---
title: Markup Table component
lang: en-US
editLink: true
---

# Markup Table

Markup table is a simple table without complex behaviour

## Features

- accessibility
- async data loading
- custom css classes
- download data
- expandable rows
- filters
- fixed and auto layouts
- formatters
- freeze rows and columns
- grouping data
- keyboard navigation
- localization
- pagination
- persistent settings state
- responsive design
- row selection
- sorting
- tree structure data
- virtual scrolling

## UX Patterns

- [Markup Table](https://lightningdesignsystem.com/components/data-tables) from Lightning Design System
- [Markup Table](https://carbondesignsystem.com/components/data-table/usage/) from Carbon Design System
- [Data Table Design UX Patterns](https://www.pencilandpaper.io/articles/ux-pattern-analysis-enterprise-data-tables)
- [Data Table Design Patterns](https://bootcamp.uxdesign.cc/data-table-design-patterns-4e38188a0981)
- [Design better data tables](https://uxdesign.cc/design-better-data-tables-4ecc99d23356)
- [Data Tables: Four Major User Tasks](https://www.nngroup.com/articles/data-tables/)
- [Designing User-Friendly Data Tables](https://uxbooth.com/articles/designing-user-friendly-data-tables/)
- [UI considerations for designing large data tables](https://coyleandrew.medium.com/acv-considerations-for-designing-large-data-tables-aa6c1ea93797)

## UI Design Guidelines

- [Bootstrap Tables](https://bootstrap-vue.org/docs/components/table)

## Accessibility Guidelines

- [Data Tables](https://www.w3.org/WAI/tutorials/tables/)
- [Accessible Data Tables](https://www.deque.com/blog/accessible-data-tables/)
- [Accessible Data Tables: A Semantic Approach](https://www.deque.com/blog/accessible-data-tables-a-semantic-approach/)
- [Accessible Data Tables: The WCAG Standard](https://www.deque.com/blog/accessible-data-tables-the-wcag-standard/)
- [Creating Accessible Tables](https://webaim.org/techniques/tables/data)
- [Web Accessibility Checklist - Tables](https://dequeuniversity.com/checklists/web/tables)
- [Princeton - Tables](https://digital.accessibility.princeton.edu/how/content/tables)
- [USFCA - Tables](https://myusf.usfca.edu/digital-accessibility/tables)

## Props

| Prop name | Description               | Type    | Values      | Default |
| --------- | ------------------------- | ------- | ----------- | ------- |
| columns   | Table columns             | Array   | -           |         |
| data      | Table data                | Array   | -           |         |
| bordered  | Whether table is bordered | boolean | true, false | true    |
| dense     | Whether table is compact  | boolean | -           |         |
| height    |                           | number  | -           |         |

## Slots

| Name                   | Description | Bindings |
| ---------------------- | ----------- | -------- |
| default                |             |          |
| caption                |             |          |
| `header_${column.key}` |             |          |
| `column_${column.key}` |             | <br/>    |
