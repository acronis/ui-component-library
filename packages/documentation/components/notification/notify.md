---
title: Notify component
lang: en-US
editLink: true
description: This file is generated automatically from the source code. Changes made here will be lost.
---

# Notify

<!--@include: ./notify.doc.md-->

## Props

| Prop name    | Description | Type           | Values | Default                           |
| ------------ | ----------- | -------------- | ------ | --------------------------------- |
| message      |             | string\|object | -      |                                   |
| type         |             | string         | -      | AcvNotificationType.SUCCESS       |
| position     |             | string         | -      | AcvNotificationPosition.TOP_RIGHT |
| duration     |             | number         | -      | 3000                              |
| dismissible  |             | boolean        | -      | true                              |
| onDismiss    |             | func           | -      | () =&gt; {<br/>}                  |
| onClick      |             | func           | -      | () =&gt; {<br/>}                  |
| queue        |             | boolean        | -      |                                   |
| content      |             | object         | -      |                                   |
| pauseOnHover |             | boolean        | -      | true                              |

## Expose

### dismiss

>
