---
title: Tree component
lang: en-US
editLink: true
---

# Tree

Used to visualize the value hierarchy.
The parent value that has children is marked with an arrow.
If the parent is collapsed, the arrow is facing to the right.
If the parent is expanded, the arrow faces down.
You can only select an element that is not a parent and does not contain other child elements.
If the parent is in the disabled state, you cannot expand it.
Multiple selection of items is only available when using the Tree with checkbox.

:::info Figma mockups
https://www.figma.com/file/AOtI028uCFzAmnADVCz872/Documentation?node-id=2%3A36
:::

## Basic usage

<TreeBasic />

::: details Source code
<<< @/demos/tree/TreeBasic.vue
:::

## Disabled node

## Node selection

## Node checking

## Node Filtering

## Highlighting

## Custom content

## Custom prefix icon

## Accordion mode

## Accessibility

A tree should ...

## Related components

- [Icon](/components/icon/icon.doc)
- [treeNode](/components/treeNode/treeNode.doc)

## Props

| Prop name           | Description                                          | Type           | Values | Default |
| ------------------- | ---------------------------------------------------- | -------------- | ------ | ------- |
| data                | Tree data                                            | Array          | -      |         |
| emptyText           | Text displayed when the tree is empty                | string         | -      |         |
| nodeKey             | Key of the node                                      | string         | -      |         |
| checkStrictly       | Whether to check strictly, no propagation            | boolean        | -      |         |
| defaultExpandAll    | Whether to expand all nodes                          | boolean        | -      |         |
| expandOnClickNode   | Whether to expand the node when clicking on the node | boolean        | -      |         |
| checkOnClickNode    | Whether to check the node when clicking on the node  | boolean        | -      |         |
| autoExpandParent    | Whether to expand the node when clicking on the icon | boolean        | -      |         |
| defaultExpandedKeys | Key of the default expanded nodes                    | Array          | -      |         |
| defaultCheckedKeys  | Key of the default checked nodes                     | Array          | -      |         |
| expandWhenChecked   |                                                      | boolean        | -      |         |
| showCheckbox        | Whether node checkbox is shown                       | boolean        | -      |         |
| lazy                | Whether to lazy load the children                    | boolean        | -      |         |
| load                | Load method                                          | TSFunctionType | -      |         |
| filterNodeMethod    | Filter method                                        | TSFunctionType | -      |         |
| accordion           | Accordion mode, only one node can be expanded        | boolean        | -      |         |
| indent              | Distance between the node and the left side          | number         | -      |         |
| rootIndent          | Distance between the nodes and the left side         | number         | -      |         |

## Events

| Event name  | Properties                  | Description                         |
| ----------- | --------------------------- | ----------------------------------- |
| node-expand | **payload** `string` - node | Triggered when the node is expanded |

## Slots

| Name        | Description | Bindings |
| ----------- | ----------- | -------- |
| default     |             |          |
| description |             |          |
