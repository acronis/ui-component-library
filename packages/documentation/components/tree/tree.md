---
title: Tree component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# Tree

<!--@include: ./tree.doc.md-->

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
