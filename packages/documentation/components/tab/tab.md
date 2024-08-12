---
title: ACV Tab component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# ACV Tab

> Tab will be used to create a tab element.

<!--@include: ./tab.doc.md-->

## Props

| Prop name | Description                                                                                                                                                                               | Type             | Values | Default |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------ | ------- |
| label     | Tab label                                                                                                                                                                                 | string           | -      |         |
| icon      | Tab icon                                                                                                                                                                                  | string           | -      |         |
| value     | Tab key<br/>identifier corresponding to the activeName of Tabs, representing the alias of the tab-pane<br/>ordinal number of the tab-pane in the sequence, e.g. the first tab-pane is '1' | number \| string | -      |         |
| disabled  | Whether the tab is disabled                                                                                                                                                               | boolean          | -      | false   |
| closable  | Whether the tab is closable                                                                                                                                                               | boolean          | -      |         |

## Slots

| Name    | Description                  | Bindings |
| ------- | ---------------------------- | -------- |
| prepend | Prepend content to the title |          |
| append  | Append content to the title  |          |

## Expose

### tabName

>

### isActive

>
